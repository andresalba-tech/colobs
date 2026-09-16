import fs from 'node:fs';
import path from 'node:path';
import dotenv from 'dotenv';
import { classifyJobText } from '../src/classifier/classifier';

dotenv.config({
  path: path.resolve('backend/.env'),
});

const MATON_API_KEY = process.env.MATON_API_KEY;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202608';
const MATON_GATEWAY_URL =
  process.env.MATON_GATEWAY_URL || 'https://gateway.maton.ai/linkedin';

const OUTPUT_PATH = path.resolve('backend/data/daily-d1.sql');

const KEYWORDS = [
  'Software',
  'React',
  'Python',
  'Java',
  'JavaScript',
  'TypeScript',
  'Node.js',
  'AI Engineer',
  'Full Stack',
  'Frontend',
  'Backend',
  'Angular',
  'Vue',
  'Spring',
  'FastAPI',
  'Django',
  'LLM',
  'RAG',
  'Agents',
  '.NET',
];

const PAGE_SIZE = 24;
const MAX_PAGES_PER_KEYWORD = 10;
const DELAY_MS = 300;

interface NormalizedJob {
  externalId: string;
  title: string;
  company: string;
  location: string;
  applyMethod: string;
  url: string;
  companyUrl: string;
  publishedAt: string;
  publishedDate: string;
  description: string;
  technologies: Set<string>;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function sqlValue(value: unknown): string {
  if (value === null || value === undefined) {
    return 'NULL';
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return `'${String(value).replaceAll("'", "''")}'`;
}

function bogotaDate(offsetDays = 0): {
  year: number;
  month: number;
  day: number;
  iso: string;
} {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Bogota',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const values: Record<string, string> = {};

  for (const part of parts) {
    values[part.type] = part.value;
  }

  const anchor = new Date(
    Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day)
    )
  );

  anchor.setUTCDate(anchor.getUTCDate() + offsetDays);

  const year = anchor.getUTCFullYear();
  const month = anchor.getUTCMonth() + 1;
  const day = anchor.getUTCDate();

  return {
    year,
    month,
    day,
    iso: anchor.toISOString().slice(0, 10),
  };
}

async function main() {
  if (!MATON_API_KEY) {
    throw new Error('MATON_API_KEY no está configurada');
  }

    // Ventana móvil de 48 horas.
    // El solapamiento evita perder ofertas entre ejecuciones.
    const cutoffMs = Date.now() - 48 * 60 * 60 * 1000;
    const cutoffIso = new Date(cutoffMs).toISOString();

    console.log('ColObs - Ingestión diaria para D1');
    console.log(`Procesando ofertas publicadas desde: ${cutoffIso}`);

  const jobs = new Map<string, NormalizedJob>();

  for (const keyword of KEYWORDS) {
    console.log(`\nBuscando: ${keyword}`);

    let reachedCutoff = false;

    for (let page = 0; page < MAX_PAGES_PER_KEYWORD; page++) {
      const start = page * PAGE_SIZE;

      const url = new URL(`${MATON_GATEWAY_URL}/rest/jobLibrary`);

      url.searchParams.set('q', 'criteria');
      url.searchParams.set('keyword', keyword);
      url.searchParams.set('start', String(start));
      url.searchParams.set('count', String(PAGE_SIZE));
      url.searchParams.set('countries', 'urn:li:country:co');

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${MATON_API_KEY.trim()}`,
          'LinkedIn-Version': LINKEDIN_VERSION,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        const body = await response.text();

        console.error(
          `HTTP ${response.status} para "${keyword}": ${body}`
        );

        break;
      }

      const data: any = await response.json();
      const elements: any[] = data.elements || [];

      console.log(
         `  Página ${page + 1}: ${elements.length} registros (total disponible: ${data.paging?.total ?? 'N/A'})`
      );

      if (elements.length === 0) {
        break;
      }

      for (const item of elements) {
        const details = item.jobDetails || {};

        const jobUrl = item.jobPostingUrl || '';

        const idMatch = jobUrl.match(/\/(\d+)(?:\?|$)/);

        const publishedTimestamp =
          details.jobListTimeInMilliseconds;

        if (
            publishedTimestamp &&
            Number(publishedTimestamp) < cutoffMs
        ) {
            reachedCutoff = true;
            break;
        }

        const publishedAt = publishedTimestamp
          ? new Date(publishedTimestamp).toISOString()
          : new Date().toISOString();

        const publishedDate = publishedAt.slice(0, 10);

        const externalId =
          idMatch?.[1] ||
          `fallback:${details.organizationName || ''}|${details.jobTitle || ''}|${publishedDate}`;

        const matches = classifyJobText(
          details.jobTitle || '',
          details.jobDescription || ''
        );

        const existing = jobs.get(externalId);

        if (existing) {
          for (const match of matches) {
            existing.technologies.add(match.slug);
          }

          continue;
        }

        jobs.set(externalId, {
          externalId,
          title: details.jobTitle || 'Sin título',
          company: details.organizationName || 'Confidencial',
          location: details.jobLocation || 'Colombia',
          applyMethod: details.jobApplyMethod || 'N/A',
          url: jobUrl,
          companyUrl: details.organizationUrl || '',
          publishedAt,
          publishedDate,
          description: details.jobDescription || '',
          technologies: new Set(
            matches.map((match) => match.slug)
          ),
        });
      }

      if (reachedCutoff) {
        console.log('  Alcanzado límite de 48 horas. Terminando búsqueda.');
        break;
      }

      const total = Number(data.paging?.total || 0);

      if (
        elements.length < PAGE_SIZE ||
        (total > 0 && start + elements.length >= total)
      ) {
        break;
      }

      await sleep(DELAY_MS);
    }
  }

  console.log(`\nVacantes únicas encontradas: ${jobs.size}`);

  const nowIso = new Date().toISOString();

  let sql = '';

  for (const job of jobs.values()) {
    sql += `
INSERT INTO jobs (
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
)
VALUES (
  ${sqlValue(job.externalId)},
  ${sqlValue(job.title)},
  ${sqlValue(job.company)},
  ${sqlValue(job.location)},
  'CO',
  ${sqlValue(job.applyMethod)},
  ${sqlValue(job.url)},
  ${sqlValue(job.companyUrl)},
  ${sqlValue(job.publishedAt)},
  ${sqlValue(job.publishedDate)},
  ${sqlValue(nowIso)},
  ${sqlValue(nowIso)},
  ${sqlValue(job.description)},
  1
)
ON CONFLICT(external_job_id) DO UPDATE SET
  title = excluded.title,
  company = excluded.company,
  location = excluded.location,
  apply_method = excluded.apply_method,
  url = excluded.url,
  company_url = excluded.company_url,
  last_seen_at = excluded.last_seen_at,
  description = excluded.description,
  is_active = 1;
`;

    for (const slug of job.technologies) {
      sql += `
INSERT OR IGNORE INTO job_technologies (
  job_id,
  technology_id
)
SELECT
  j.id,
  t.id
FROM jobs j
JOIN technologies t
  ON t.slug = ${sqlValue(slug)}
WHERE j.external_job_id = ${sqlValue(job.externalId)};
`;
    }
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), {
    recursive: true,
  });

  fs.writeFileSync(OUTPUT_PATH, sql, 'utf8');

  console.log(
    `SQL generado: ${OUTPUT_PATH}`
  );

  console.log(
    `Tamaño: ${Buffer.byteLength(sql, 'utf8')} bytes`
  );
}

main().catch((error) => {
  console.error('Error fatal:', error);
  process.exit(1);
});