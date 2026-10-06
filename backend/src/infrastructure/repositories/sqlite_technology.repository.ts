import { DatabaseSync } from 'node:sqlite';
import { ITechnologyRepository } from '../../core/interfaces/repositories.js';
import { TechnologyRecord } from '../../core/types.js';

export class SqliteTechnologyRepository implements ITechnologyRepository {
  constructor(private readonly db: DatabaseSync) {}

  getAll(): TechnologyRecord[] {
    return this.db
      .prepare('SELECT id, name, slug, category FROM technologies ORDER BY name ASC')
      .all() as unknown as TechnologyRecord[];
  }
}
