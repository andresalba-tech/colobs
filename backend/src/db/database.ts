import fs from 'fs';
import path from 'path';
import { DatabaseSync } from 'node:sqlite';

const DB_PATH = path.resolve(process.cwd(), 'data', 'observatory.db');

// Asegurar que exista la carpeta data/
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const db = new DatabaseSync(DB_PATH);

// Inicializar tablas y esquema
export function initDatabase() {
  const currentDir = import.meta.dirname || path.dirname(new URL(import.meta.url).pathname);
  const schemaPath = path.resolve(currentDir, 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf-8');
  db.exec(schemaSql);
  initDefaultTechnologies();
}

export interface TechnologyRecord {
  id: number;
  name: string;
  slug: string;
  category: string;
}

import { TAXONOMY_RULES } from '../classifier/taxonomy.js';

export const DEFAULT_TECHNOLOGIES = TAXONOMY_RULES.map((t) => ({
  name: t.name,
  slug: t.slug,
  category: t.category,
}));

function initDefaultTechnologies() {
  const insertStmt = db.prepare(`
    INSERT OR IGNORE INTO technologies (name, slug, category)
    VALUES (?, ?, ?)
  `);

  for (const tech of DEFAULT_TECHNOLOGIES) {
    insertStmt.run(tech.name, tech.slug, tech.category);
  }
}

export function getAllTechnologies(): TechnologyRecord[] {
  return db.prepare('SELECT id, name, slug, category FROM technologies ORDER BY name ASC').all() as any;
}
