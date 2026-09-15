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
  changePercent: number;
}

export function getAvailableSeries() {
  return getAllTechnologies();
}

/**
 * Retorna las métricas temporales abarcando todo el período solicitado (7d, 30d, 90d, 180d, 365d)
 * - metric = 'new': Vacantes cuya publicación inició en esa fecha/intervalo.
 * - metric = 'active': Total acumulado de vacantes abiertas y vigentes en el mercado hasta esa fecha.
 */
export function getTimelineData(
  slugs: string[],
  metric: 'new' | 'active' = 'new',
  days: number = 30
): TimelineDataPoint[] {
  if (slugs.length === 0) return [];

  const maxDateRow = db.prepare('SELECT MAX(published_date) as max_date FROM jobs').get() as { max_date: string | null };
  const maxDateStr = maxDateRow?.max_date || new Date().toISOString().slice(0, 10);
  const maxDate = new Date(maxDateStr + 'T00:00:00Z');

  // Ajustar la resolución temporal según el período para mantener la gráfica legible
  // 7 y 30 días: paso de 1 día
  // 90 días: paso de 2 días
  // 180 días (6 meses): paso de 3 días
  // 365 días (1 año): paso de 5 días
  const stepDays = days > 180 ? 5 : days > 90 ? 2 : 1;

  interface DateInterval {
    labelDate: string;
    startDate: string;
    endDate: string;
  }

  const intervals: DateInterval[] = [];

  for (let i = days; i >= 0; i -= stepDays) {
    const endOffset = i;
    const startOffset = Math.min(days, i + stepDays - 1);

    const dEnd = new Date(maxDate.getTime() - endOffset * 24 * 60 * 60 * 1000);
    const dStart = new Date(maxDate.getTime() - startOffset * 24 * 60 * 60 * 1000);

    const endDateStr = dEnd.toISOString().slice(0, 10);
    const startDateStr = dStart.toISOString().slice(0, 10);

    intervals.push({
      labelDate: endDateStr,
      startDate: startDateStr,
      endDate: endDateStr,
    });
  }

  // Mapear slugs a IDs de tecnología
  const techMap = new Map<string, number>();
  for (const slug of slugs) {
    const tech = db.prepare('SELECT id FROM technologies WHERE slug = ?').get(slug) as any;
    if (tech) {
      techMap.set(slug, tech.id);
    }
  }

  // Consulta para Nuevas en el intervalo
  const newCountsStmt = db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.published_date >= ? AND j.published_date <= ?
  `);

  // Consulta para Activas acumuladas hasta la fecha límite del intervalo
  const activeCumulativeStmt = db.prepare(`
    SELECT COUNT(DISTINCT j.id) as count
    FROM jobs j
    JOIN job_technologies jt ON j.id = jt.job_id
    WHERE jt.technology_id = ? AND j.published_date <= ? AND j.is_active = 1
  `);

  const result: TimelineDataPoint[] = [];

  for (const interval of intervals) {
    const point: TimelineDataPoint = { date: interval.labelDate };

    for (const [slug, techId] of techMap.entries()) {
      if (metric === 'active') {
        const row = activeCumulativeStmt.get(techId, interval.endDate) as { count: number };
        point[slug] = row ? row.count : 0;
      } else {
        const row = newCountsStmt.get(techId, interval.startDate, interval.endDate) as { count: number };
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
