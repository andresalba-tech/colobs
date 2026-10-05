import { DatabaseSync } from 'node:sqlite';
import { IVisitorRepository } from '../../core/interfaces/repositories.js';
import { RecordEventDTO, CreateContactDTO } from '../../core/types.js';
import { getVisitorAnalyticsReport } from '../../api/visitor_reports.js';

export class SqliteVisitorRepository implements IVisitorRepository {
  constructor(private readonly db: DatabaseSync) {}

  recordEvent(event: RecordEventDTO): void {
    const stmt = this.db.prepare(`
      INSERT INTO visitor_events (event_type, series_selected, period_selected, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(
      event.event_type || 'comparison_view',
      event.series || '',
      String(event.period || ''),
      new Date().toISOString()
    );
  }

  recordContact(contact: CreateContactDTO): void {
    const stmt = this.db.prepare(`
      INSERT INTO visitor_contacts (name, company, role, email, phone, country, comment, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(
      contact.name || 'Anónimo',
      contact.company || '',
      contact.role || '',
      contact.email || '',
      contact.phone || '',
      contact.country || 'Colombia',
      contact.comment || '',
      new Date().toISOString()
    );
  }

  getVisitorAnalyticsReport(): any {
    return getVisitorAnalyticsReport();
  }
}
