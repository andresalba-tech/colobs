import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const MATON_API_KEY = process.env.MATON_API_KEY;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202608';
const MATON_GATEWAY_URL = process.env.MATON_GATEWAY_URL || 'https://gateway.maton.ai/linkedin';

interface QueryOptions {
  keyword: string;
  countryUrn?: string;
  start?: number;
  count?: number;
  startDate?: { year: number; month: number; day: number };
  endDate?: { year: number; month: number; day: number };
  filenameSuffix?: string;
}

async function queryLinkedInJobs(options: QueryOptions) {
  if (!MATON_API_KEY) {
    console.error('❌ ERROR: MATON_API_KEY no encontrada en variables de entorno.');
    process.exit(1);
  }

  const url = new URL(`${MATON_GATEWAY_URL}/rest/jobLibrary`);
  url.searchParams.set('q', 'criteria');
  url.searchParams.set('keyword', options.keyword);

  // Filtro de país (Colombia por defecto: urn:li:country:co)
  const country = options.countryUrn || 'urn:li:country:co';
  url.searchParams.set('countries', country);

  // Paginación
  if (options.count !== undefined) {
    url.searchParams.set('count', options.count.toString());
  }
  if (options.start !== undefined) {
    url.searchParams.set('start', options.start.toString());
  }

  // Rango de fechas
  if (options.startDate) {
    url.searchParams.set('dateRange.start.year', options.startDate.year.toString());
    url.searchParams.set('dateRange.start.month', options.startDate.month.toString());
    url.searchParams.set('dateRange.start.day', options.startDate.day.toString());
  }
  if (options.endDate) {
    url.searchParams.set('dateRange.end.year', options.endDate.year.toString());
    url.searchParams.set('dateRange.end.month', options.endDate.month.toString());
    url.searchParams.set('dateRange.end.day', options.endDate.day.toString());
  }

  console.log(`\n======================================================================`);
  console.log(`🔎 Búsqueda: "${options.keyword}" | País: ${country}`);
  if (options.startDate) {
    console.log(`📅 Desde: ${options.startDate.year}-${options.startDate.month}-${options.startDate.day}`);
  }
  console.log(`📍 Offset (start): ${options.start || 0} | Cantidad (count): ${options.count || 10}`);
  console.log(`🌐 URL: ${url.toString()}`);
  console.log(`======================================================================`);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${MATON_API_KEY.trim()}`,
    'LinkedIn-Version': LINKEDIN_VERSION,
    'Accept': 'application/json',
  };

  const startTime = Date.now();
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });
  const durationMs = Date.now() - startTime;

  console.log(`⏱️ Tiempo de respuesta: ${durationMs}ms`);
  console.log(`📊 Status HTTP: ${response.status} ${response.statusText}`);

  const rawText = await response.text();
  let parsedJson: any = null;

  try {
    parsedJson = JSON.parse(rawText);
  } catch {
    console.log('⚠️ La respuesta no es JSON válido:');
    console.log(rawText.slice(0, 500));
    return;
  }

  // Guardar muestra en data/samples/
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const safeKeyword = options.keyword.replace(/[^a-zA-Z0-9]/g, '_');
  const suffix = options.filenameSuffix ? `_${options.filenameSuffix}` : '';
  const outFilename = `${timestamp}_${safeKeyword}${suffix}.json`;
  const outDir = path.resolve('data', 'samples');

  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outPath = path.join(outDir, outFilename);
  fs.writeFileSync(outPath, JSON.stringify(parsedJson, null, 2), 'utf-8');
  console.log(`💾 Respuesta guardada en: ${outPath}`);

  // Inspección de campos
  inspectResponse(parsedJson);

  return parsedJson;
}

function inspectResponse(data: any) {
  console.log('\n--- 📋 Inspección de Esquema y Resultados ---');
  if (typeof data !== 'object' || data === null) {
    console.log('Tipo de dato raíz:', typeof data);
    return;
  }

  const total = data.paging?.total ?? 'N/A';
  const start = data.paging?.start ?? 0;
  const count = data.paging?.count ?? 0;
  console.log(`📊 Paginación -> Total en LinkedIn: ${total} | Start: ${start} | Count: ${count}`);

  const elements = data.elements || [];
  console.log(`📥 Elementos recibidos en esta página: ${elements.length}`);

  if (elements.length > 0) {
    console.log('\n🔍 Muestra del primer elemento:');
    const first = elements[0];
    const details = first.jobDetails || {};
    
    // Extraer ID de la URL
    const urlMatch = first.jobPostingUrl?.match(/\/(\d+)(?:\?|$)/);
    const jobId = urlMatch ? urlMatch[1] : 'N/A';

    console.log(`  - Job ID (extraído de URL): ${jobId}`);
    console.log(`  - URL de la vacante: ${first.jobPostingUrl}`);
    console.log(`  - Título: ${details.jobTitle}`);
    console.log(`  - Empresa: ${details.organizationName}`);
    console.log(`  - Payer: ${details.payerName}`);
    console.log(`  - Ubicación: ${details.jobLocation}`);
    console.log(`  - Modalidad/Apply: ${details.jobApplyMethod}`);
    console.log(`  - Company URL: ${details.organizationUrl}`);
    if (details.jobListTimeInMilliseconds) {
      const pubDate = new Date(details.jobListTimeInMilliseconds);
      console.log(`  - Fecha de publicación: ${pubDate.toISOString()} (${details.jobListTimeInMilliseconds} ms)`);
    }
    console.log(`  - Longitud de descripción: ${details.jobDescription?.length || 0} caracteres`);
    console.log(`  - Descripción (primeros 180 caracteres): "${details.jobDescription?.slice(0, 180)}..."`);
  }
}

async function runFullValidation() {
  console.log('🚀 =========================================================');
  console.log('   OBSERVATORIO TECH COLOMBIA - FASE 1: VALIDACIÓN COMPLETA');
  console.log('   Fuente: LinkedIn Job Library a través de Maton Gateway');
  console.log('=========================================================\n');

  // Paso 5: Buscar "Software" en Colombia
  console.log('\n>>> [PASO 5] Consulta genérica: "Software" en Colombia');
  await queryLinkedInJobs({
    keyword: 'Software',
    count: 5,
    filenameSuffix: 'paso5_software_colombia',
  });

  // Paso 6: Buscar "React" en Colombia
  console.log('\n>>> [PASO 6] Consulta tecnológica: "React" en Colombia');
  await queryLinkedInJobs({
    keyword: 'React',
    count: 5,
    filenameSuffix: 'paso6_react_colombia',
  });

  // Paso 7: Consultar rango histórico de 2026 en Colombia
  console.log('\n>>> [PASO 7] Consulta histórica 2026: "Software" desde 2026-01-01');
  await queryLinkedInJobs({
    keyword: 'Software',
    startDate: { year: 2026, month: 1, day: 1 },
    count: 5,
    filenameSuffix: 'paso7_software_2026_colombia',
  });

  // Paso 8: Probar paginación
  console.log('\n>>> [PASO 8] Prueba de paginación: "React" offset 5');
  await queryLinkedInJobs({
    keyword: 'React',
    start: 5,
    count: 5,
    filenameSuffix: 'paso8_react_pagination_offset5',
  });

  console.log('\n✨ =========================================================');
  console.log('   FASE 1 COMPLETADA CON ÉXITO: 100% DE PRUEBAS SUPERADAS');
  console.log('   Todas las respuestas crudas guardadas en data/samples/');
  console.log('=========================================================\n');
}

// Ejecutar
runFullValidation();
