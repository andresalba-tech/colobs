import dotenv from 'dotenv';
dotenv.config();

import { db, initDatabase, getAllTechnologies } from '../db/database';
import { classifyJobText } from '../classifier/classifier';

const MATON_API_KEY = process.env.MATON_API_KEY;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202608';
const MATON_GATEWAY_URL = process.env.MATON_GATEWAY_URL || 'https://gateway.maton.ai/linkedin';

export interface IngestionOptions {
  keywords: string[];
  maxPagesPerKeyword?: number;
  pageSize?: number;
  delayBetweenRequestsMs?: number;
}

export async function runIngestion(options: IngestionOptions) {
  if (!MATON_API_KEY) {
    throw new Error('MATON_API_KEY no está configurada en .env');
  }

  // 1. Asegurar esquema y catálogo de tecnologías en SQLite
  initDatabase();
  const techMap = new Map<string, number>();
  for (const t of getAllTechnologies()) {
    techMap.set(t.slug, t.id);
  }

  // Preparar declaraciones SQL optimizadas
  const insertJobStmt = db.prepare(`
    INSERT INTO jobs (
      external_job_id, title, company, location, country,
      apply_method, url, company_url, published_at, published_date,
      first_seen_at, last_seen_at, description, is_active
    ) VALUES (?, ?, ?, ?, 'CO', ?, ?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(external_job_id) DO UPDATE SET
      last_seen_at = excluded.last_seen_at,
      is_active = 1
    RETURNING id
  `);

  const linkTechStmt = db.prepare(`
    INSERT OR IGNORE INTO job_technologies (job_id, technology_id)
    VALUES (?, ?)
  `);

  let totalFetched = 0;
  let totalNew = 0;
  let totalExisting = 0;
  const nowIso = new Date().toISOString();

  console.log('🚀 Iniciando Pipeline de Ingestión y Normalización...');
  console.log(`Palabras clave a consultar: ${options.keywords.join(', ')}`);
  console.log(`Páginas máx por palabra clave: ${options.maxPagesPerKeyword || 1}`);
  console.log(`Tamaño de página: ${options.pageSize || 10}\n`);

  for (const keyword of options.keywords) {
    console.log(`\n===============================================================`);
    console.log(`📡 Ingestando: "${keyword}" en Colombia...`);
    console.log(`===============================================================`);

    const maxPages = options.maxPagesPerKeyword || 1;
    const pageSize = options.pageSize || 10;

    for (let page = 0; page < maxPages; page++) {
      const start = page * pageSize;
      const url = new URL(`${MATON_GATEWAY_URL}/rest/jobLibrary`);
      url.searchParams.set('q', 'criteria');
      url.searchParams.set('keyword', keyword);
      url.searchParams.set('countries', 'urn:li:country:co');
      url.searchParams.set('start', start.toString());
      url.searchParams.set('count', pageSize.toString());

      console.log(`[Página ${page + 1}/${maxPages}] Offset ${start} -> Solicitando...`);

      try {
        const res = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${MATON_API_KEY.trim()}`,
            'LinkedIn-Version': LINKEDIN_VERSION,
            'Accept': 'application/json',
          },
        });

        if (!res.ok) {
          const errText = await res.text();
          console.error(`❌ Error en respuesta HTTP ${res.status}: ${errText.slice(0, 200)}`);
          break;
        }

        const data: any = await res.json();
        const elements: any[] = data.elements || [];
        const totalAvailable = data.paging?.total ?? 'N/A';

        console.log(`  ✓ Recibidos: ${elements.length} registros (Total disponible en LinkedIn: ${totalAvailable})`);

        if (elements.length === 0) {
          console.log('  Sin más resultados para esta búsqueda.');
          break;
        }

        for (const item of elements) {
          totalFetched++;
          const details = item.jobDetails || {};
          const urlMatch = item.jobPostingUrl?.match(/\/(\d+)(?:\?|$)/);
          const externalId = urlMatch ? urlMatch[1] : String(details.jobTitle + details.organizationName);

          const pubTimestamp = details.jobListTimeInMilliseconds;
          const pubDateObj = pubTimestamp ? new Date(pubTimestamp) : new Date();
          const publishedAt = pubDateObj.toISOString();
          const publishedDate = publishedAt.slice(0, 10); // YYYY-MM-DD

          // Verificar si ya existía antes de insertar
          const existing = db.prepare('SELECT id FROM jobs WHERE external_job_id = ?').get(externalId) as any;

          const row = insertJobStmt.get(
            externalId,
            details.jobTitle || 'Sin título',
            details.organizationName || 'Confidencial',
            details.jobLocation || 'Colombia',
            details.jobApplyMethod || 'N/A',
            item.jobPostingUrl || '',
            details.organizationUrl || '',
            publishedAt,
            publishedDate,
            nowIso,
            nowIso,
            details.jobDescription || ''
          ) as { id: number };

          const jobId = row.id;

          if (existing) {
            totalExisting++;
          } else {
            totalNew++;
          }

          // Clasificar tecnologías y roles
          const matches = classifyJobText(details.jobTitle || '', details.jobDescription || '');
          for (const match of matches) {
            const techId = techMap.get(match.slug);
            if (techId) {
              linkTechStmt.run(jobId, techId);
            }
          }
        }

        // Si ya obtuvimos todos los registros disponibles
        if (start + elements.length >= data.paging?.total) {
          break;
        }

        // Pequeña pausa de cortesía
        if (options.delayBetweenRequestsMs) {
          await new Promise((resolve) => setTimeout(resolve, options.delayBetweenRequestsMs));
        }
      } catch (err: any) {
        console.error(`❌ Error en petición: ${err.message}`);
        break;
      }
    }
  }

  console.log('\n✨ ===============================================================');
  console.log('   RESUMEN FINAL DE LA INGESTIÓN');
  console.log('===============================================================');
  console.log(`📥 Total ofertas procesadas en la sesión: ${totalFetched}`);
  console.log(`🆕 Nuevas vacantes únicas añadidas a la BD: ${totalNew}`);
  console.log(`🔄 Vacantes existentes actualizadas (vistas de nuevo): ${totalExisting}`);

  // Estadísticas actuales en la base de datos
  const totalInDb = db.prepare('SELECT COUNT(*) as count FROM jobs').get() as { count: number };
  console.log(`💾 Total vacantes almacenadas en observatory.db: ${totalInDb.count}\n`);

  console.log('📊 Distribución actual de vacantes por tecnología en SQLite:');
  const techCounts = db.prepare(`
    SELECT t.name, t.category, COUNT(jt.job_id) as job_count
    FROM technologies t
    LEFT JOIN job_technologies jt ON t.id = jt.technology_id
    GROUP BY t.id
    ORDER BY job_count DESC, t.name ASC
  `).all() as Array<{ name: string; category: string; job_count: number }>;

  for (const tc of techCounts) {
    if (tc.job_count > 0) {
      console.log(`  - ${tc.name.padEnd(18)} [${tc.category.padEnd(8)}]: ${tc.job_count} vacantes`);
    }
  }
}
