import { DatabaseSync } from 'node:sqlite';
import { IJobsRepository } from '../../core/interfaces/repositories.js';
import { GeneralStats } from '../../core/types.js';

export class SqliteJobsRepository implements IJobsRepository {
  constructor(private readonly db: DatabaseSync) {}

  getTotalJobsCount(): number {
    const row = this.db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count?: number } | undefined;
    return row?.count || 0;
  }

  getGeneralStats(): GeneralStats {
    const totalJobs = ((this.db.prepare('SELECT COUNT(*) as c FROM jobs').get() as any)?.c) || 0;
    const totalCompanies = ((this.db.prepare('SELECT COUNT(DISTINCT company) as c FROM jobs').get() as any)?.c) || 0;
    const dateRange = this.db.prepare('SELECT MIN(published_date) as min_d, MAX(published_date) as max_d FROM jobs').get() as any;
    const totalEvents = ((this.db.prepare('SELECT COUNT(*) as c FROM visitor_events').get() as any)?.c) || 0;
    const totalContacts = ((this.db.prepare('SELECT COUNT(*) as c FROM visitor_contacts').get() as any)?.c) || 0;

    const topTech = this.db.prepare(`
      SELECT t.name, t.slug, t.category, COUNT(jt.job_id) as total
      FROM technologies t
      JOIN job_technologies jt ON t.id = jt.technology_id
      GROUP BY t.id
      ORDER BY total DESC
      LIMIT 10
    `).all() as Array<{ name: string; slug: string; category: string; total: number }>;

    return {
      totalJobs,
      totalCompanies,
      dateRange: { start: dateRange?.min_d || null, end: dateRange?.max_d || null },
      visitorInteractions: totalEvents,
      leadsReceived: totalContacts,
      topTechnologies: topTech,
    };
  }
}
