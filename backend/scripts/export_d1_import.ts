import fs from 'node:fs';
import { DatabaseSync } from 'node:sqlite';

const db = new DatabaseSync('./backend/data/observatory.db');

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

const jobs = db.prepare(`
  SELECT *
  FROM jobs
  ORDER BY id
`).all() as any[];

const relations = db.prepare(`
  SELECT jt.job_id, t.slug
  FROM job_technologies jt
  JOIN technologies t ON t.id = jt.technology_id
  ORDER BY jt.job_id
`).all() as any[];

let output = '';

for (const job of jobs) {
  const values = [
    job.id,
    job.external_job_id,
    job.title,
    job.company,
    job.location,
    job.country,
    job.apply_method,
    job.url,
    job.company_url,
    job.published_at,
    job.published_date,
    job.first_seen_at,
    job.last_seen_at,
    job.description,
    job.is_active,
  ];

  output += `
INSERT OR IGNORE INTO jobs (
  id,
  external_job_id,
  title,
  company,
  location,
  country,
  apply_method,
  url,
  company_url,
  published_at,
  published_date,
  first_seen_at,
  last_seen_at,
  description,
  is_active
) VALUES (${values.map(sqlValue).join(', ')});
`;
}

for (const relation of relations) {
  output += `
INSERT OR IGNORE INTO job_technologies (
  job_id,
  technology_id
) VALUES (
  ${relation.job_id},
  (SELECT id FROM technologies WHERE slug = ${sqlValue(relation.slug)})
);
`;
}

fs.writeFileSync(
  './backend/data/d1-import.sql',
  output,
  'utf8'
);

console.log(`Jobs exportados: ${jobs.length}`);
console.log(`Relaciones exportadas: ${relations.length}`);
console.log(`Archivo generado: ${Buffer.byteLength(output, 'utf8')} bytes`);