import { DatabaseSync } from 'node:sqlite';
import { IAnalyticsRepository } from '../../core/interfaces/repositories.js';
import { TimelineDataPoint, SeriesSummary } from '../../core/types.js';

export class SqliteAnalyticsRepository implements IAnalyticsRepository {
  constructor(private readonly db: DatabaseSync) {}

  getTimelineData(
    slugs: string[],
    metric: 'new' | 'active' = 'new',
    days: number = 30
  ): TimelineDataPoint[] {
    if (slugs.length === 0) return [];

    const maxDateRow = this.db.prepare('SELECT MAX(published_date) as max_date FROM jobs').get() as { max_date: string | null } | undefined;
    const maxDateStr = maxDateRow?.max_date || new Date().toISOString().slice(0, 10);
    const maxDate = new Date(maxDateStr + 'T00:00:00Z');

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

    const techMap = new Map<string, number>();
    for (const slug of slugs) {
      const tech = this.db.prepare('SELECT id FROM technologies WHERE slug = ?').get(slug) as { id: number } | undefined;
      if (tech) {
        techMap.set(slug, tech.id);
      }
    }

    const newCountsStmt = this.db.prepare(`
      SELECT COUNT(DISTINCT j.id) as count
      FROM jobs j
      JOIN job_technologies jt ON j.id = jt.job_id
      WHERE jt.technology_id = ? AND j.published_date >= ? AND j.published_date <= ?
    `);

    const activeCumulativeStmt = this.db.prepare(`
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
          const row = activeCumulativeStmt.get(techId, interval.endDate) as { count: number } | undefined;
          point[slug] = row ? row.count : 0;
        } else {
          const row = newCountsStmt.get(techId, interval.startDate, interval.endDate) as { count: number } | undefined;
          point[slug] = row ? row.count : 0;
        }
      }

      result.push(point);
    }

    return result;
  }

  getSeriesCardSummary(slug: string, days: number = 30): SeriesSummary | null {
    const tech = this.db.prepare('SELECT id, name, slug, category FROM technologies WHERE slug = ?').get(slug) as
      | { id: number; name: string; slug: string; category: string }
      | undefined;
    if (!tech) return null;

    const totalActive =
      ((this.db.prepare(`
        SELECT COUNT(DISTINCT j.id) as count
        FROM jobs j
        JOIN job_technologies jt ON j.id = jt.job_id
        WHERE jt.technology_id = ? AND j.is_active = 1
      `).get(tech.id) as any)?.count) || 0;

    const currentPeriodNew =
      ((this.db.prepare(`
        SELECT COUNT(DISTINCT j.id) as count
        FROM jobs j
        JOIN job_technologies jt ON j.id = jt.job_id
        WHERE jt.technology_id = ?
          AND j.published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
      `).get(tech.id, days) as any)?.count) || 0;

    const previousPeriodNew =
      ((this.db.prepare(`
        SELECT COUNT(DISTINCT j.id) as count
        FROM jobs j
        JOIN job_technologies jt ON j.id = jt.job_id
        WHERE jt.technology_id = ?
          AND j.published_date < date((SELECT MAX(published_date) FROM jobs), '-' || ? || ' days')
          AND j.published_date >= date((SELECT MAX(published_date) FROM jobs), '-' || (? * 2) || ' days')
      `).get(tech.id, days, days) as any)?.count) || 0;

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
}
