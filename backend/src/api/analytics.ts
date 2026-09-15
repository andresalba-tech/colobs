import { db, getAllTechnologies } from '../db/database';

export interface TimelineDataPoint {
  date: string;
  [techSlug: string]: number | string;
}

export interface SeriesSummary {
  slug: string;
  name: string;
  category: string;
  totalActive: number;
  newInPeriod: number;
  changePercent: number; // Porcentaje de cambio frente al periodo previo
}

export function getAvailableSeries() {
  return getAllTechnologies();
}

/**
 * Retorna las métricas temporales diarias para hasta 3 series seleccionadas
 */
export function getTimelineData(
  slugs: string[],
  metric: 'new' | 'active' = 'new',
  days: number = 30
): TimelineDataPoint[] {
  if (slugs.length === 0) return [];

  // Calcular fecha de inicio en base a `days`
  // Si no hay suficientes días recientes, tomamos las fechas presentes en la BD
  const dateLimitQuery = db.prepare(`
    SELECT MIN(published_date) as min_date, MAX(published_date) as max_date
    FROM jobs
  `).get() as { min_date: string | null; max_date: string | null };

  if (!dateLimitQuery.min_date || !dateLimitQuery.max_date) {
    return [];
  }

  // Obtener todas las fechas distintas en orden cronológico
  const dates = db.prepare(`
    SELECT DISTINCT published_date
    FROM jobs
    WHERE published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
    ORDER BY published_date ASC
  `).all(days) as Array<{ published_date: string }>;

  const dateList = dates.map((d) => d.published_date);

  // Mapear series
  const techMap = new Map<string, number>();
  for (const slug of slugs) {
    const tech = db.prepare('SELECT id FROM technologies WHERE slug = ?').get(slug) as any;
    if (tech) {
      techMap.set(slug, tech.id);
    }
  }

  // Query para contar vacantes por fecha y tecnología
  const countsStmt = db.prepare(`
    SELECT j.published_date, COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.published_date = ?
  `);

  const result: TimelineDataPoint[] = [];

  for (const date of dateList) {
    const point: TimelineDataPoint = { date };
    for (const [slug, techId] of techMap.entries()) {
      const row = countsStmt.get(techId, date) as { count: number };
      point[slug] = row ? row.count : 0;
    }
    result.push(point);
  }

  return result;
}

/**
 * Resumen de métricas e indicador de tendencia (+X%) para la tarjeta de cada serie
 */
export function getSeriesCardSummary(slug: string, days: number = 30): SeriesSummary | null {
  const tech = db.prepare('SELECT id, name, slug, category FROM technologies WHERE slug = ?').get(slug) as any;
  if (!tech) return null;

  // Total de vacantes activas asociadas a la tecnología
  const totalActive = (db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.is_active = 1
  `).get(tech.id) as any)?.count || 0;

  // Nuevas en el periodo actual
  const currentPeriodNew = (db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ?
      AND j.published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
  `).get(tech.id, days) as any)?.count || 0;

  // Periodo previo para calcular el cambio porcentual
  const previousPeriodNew = (db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ?
      AND j.published_date < date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
      AND j.published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || (? * 2) || ' days')
  `).get(tech.id, days, days) as any)?.count || 0;

  let changePercent = 0;
  if (previousPeriodNew > 0) {
    changePercent = Math.round(((currentPeriodNew - previousPeriodNew) / previousPeriodNew) * 1000) / 10;
  } else if (currentPeriodNew > 0) {
    changePercent = 100.0;
  }

  return {
    slug: tech.slug,
    name: tech.name,
    category: tech.category,
    totalActive,
    newInPeriod: currentPeriodNew,
    changePercent,
  };
}
