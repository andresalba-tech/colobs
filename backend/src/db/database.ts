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

export const DEFAULT_TECHNOLOGIES = [
  // Lenguajes
  { name: 'JavaScript', slug: 'javascript', category: 'language' },
  { name: 'TypeScript', slug: 'typescript', category: 'language' },
  { name: 'Python', slug: 'python', category: 'language' },
  { name: 'Java', slug: 'java', category: 'language' },
  { name: 'C#', slug: 'csharp', category: 'language' },
  { name: 'Go', slug: 'go', category: 'language' },
  { name: 'Rust', slug: 'rust', category: 'language' },

  // Frontend
  { name: 'React', slug: 'react', category: 'frontend' },
  { name: 'Next.js', slug: 'nextjs', category: 'frontend' },
  { name: 'Angular', slug: 'angular', category: 'frontend' },
  { name: 'Vue', slug: 'vue', category: 'frontend' },

  // Backend
  { name: 'Node.js', slug: 'nodejs', category: 'backend' },
  { name: 'FastAPI', slug: 'fastapi', category: 'backend' },
  { name: 'Django', slug: 'django', category: 'backend' },
  { name: 'Spring', slug: 'spring', category: 'backend' },
  { name: '.NET', slug: 'dotnet', category: 'backend' },

  // IA / AI Engineering
  { name: 'AI Engineer', slug: 'ai-engineer', category: 'ai' },
  { name: 'Generative AI', slug: 'generative-ai', category: 'ai' },
  { name: 'LLM', slug: 'llm', category: 'ai' },
  { name: 'RAG', slug: 'rag', category: 'ai' },
  { name: 'Agents', slug: 'agents', category: 'ai' },
  { name: 'LangChain', slug: 'langchain', category: 'ai' },

  // Roles
  { name: 'Frontend', slug: 'frontend-role', category: 'role' },
  { name: 'Backend', slug: 'backend-role', category: 'role' },
  { name: 'Full Stack', slug: 'full-stack-role', category: 'role' },
  { name: 'Software Engineer', slug: 'software-engineer-role', category: 'role' },
];

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

export function getTechnologyBySlug(slug: string): TechnologyRecord | undefined {
  return db.prepare('SELECT id, name, slug, category FROM technologies WHERE slug = ?').get(slug) as any;
}
