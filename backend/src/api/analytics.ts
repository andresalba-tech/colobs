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
 * - metric = 'new': Vacantes cuya publicación inició en esa fecha específica (Flujo / Ritmo).
 * - metric = 'active': Total acumulado de vacantes abiertas y vigentes en el mercado hasta esa fecha (Stock / Tamaño).
 */
export function getTimelineData(
  slugs: string[],
  metric: 'new' | 'active' = 'new',
  days: number = 30
): TimelineDataPoint[] {
  if (slugs.length === 0) return [];

  // Obtener todas las fechas distintas en orden cronológico en el rango solicitado
  const dates = db.prepare(`
    SELECT DISTINCT published_date
    FROM jobs
    WHERE published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
    ORDER BY published_date ASC
  `).all(days) as Array<{ published_date: string }>;

  const dateList = dates.map((d) => d.published_date);
  if (dateList.length === 0) return [];

  // Mapear slugs a IDs de tecnología
  const techMap = new Map<string, number>();
  for (const slug of slugs) {
    const tech = db.prepare('SELECT id FROM technologies WHERE slug = ?').get(slug) as any;
    if (tech) {
      techMap.set(slug, tech.id);
    }
  }

  // Consulta para Nuevas por día (flujo exacto en esa fecha)
  const newCountsStmt = db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.published_date = ?
  `);

  // Consulta para Activas acumuladas (suma acumulada de vacantes abiertas hasta esa fecha)
  const activeCumulativeStmt = db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.published_date <= ? AND j.is_active = 1
  `);

  const result: TimelineDataPoint[] = [];

  for (const date of dateList) {
    const point: TimelineDataPoint = { date };
    for (const [slug, techId] of techMap.entries()) {
      if (metric === 'active') {
        const row = activeCumulativeStmt.get(techId, date) as { count: number };
        point[slug] = row ? row.count : 0;
      } else {
        const row = newCountsStmt.get(techId, date) as { count: number };
        point[slug] = row ? row.count : 0;
      }
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
