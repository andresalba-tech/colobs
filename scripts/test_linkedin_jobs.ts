import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const MATON_API_KEY = process.env.MATON_API_KEY;
const LINKEDIN_VERSION = process.env.LINKEDIN_VERSION || '202506';
const MATON_GATEWAY_URL = process.env.MATON_GATEWAY_URL || 'https://gateway.maton.ai/linkedin';

interface QueryOptions {
  endpoint?: string;
  keyword: string;
  country?: string;
  start?: number;
  count?: number;
  extraParams?: Record<string, string>;
  filenameSuffix?: string;
}

async function queryLinkedIn(options: QueryOptions) {
  if (!MATON_API_KEY) {
    console.error('❌ ERROR: MATON_API_KEY no encontrada en variables de entorno.');
    process.exit(1);
  }

  const endpointPath = options.endpoint || '/rest/adLibrary';
  const url = new URL(`${MATON_GATEWAY_URL}${endpointPath}`);

  url.searchParams.set('q', 'criteria');
  if (options.keyword) {
    url.searchParams.set('keyword', options.keyword);
  }
  if (options.country) {
    // LinkedIn API commonly uses countries or country codes
    url.searchParams.set('country', options.country);
  }
  if (options.count !== undefined) {
    url.searchParams.set('count', options.count.toString());
  }
  if (options.start !== undefined) {
    url.searchParams.set('start', options.start.toString());
  }

  if (options.extraParams) {
    for (const [key, val] of Object.entries(options.extraParams)) {
      url.searchParams.set(key, val);
    }
  }

  console.log(`\n==================================================`);
  console.log(`🔎 Ejecutando consulta: "${options.keyword}" [País: ${options.country || 'N/A'}]`);
  console.log(`🌐 URL: ${url.toString()}`);
  console.log(`==================================================`);

  const headers: Record<string, string> = {
    'Authorization': `Bearer ${MATON_API_KEY.trim()}`,
    'LinkedIn-Version': LINKEDIN_VERSION,
    'X-RestLi-Protocol-Version': '2.0.0',
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

  // Guardar respuesta cruda en data/samples/
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

  // Inspección de estructura y campos
  inspectResponse(parsedJson);

  return parsedJson;
}

function inspectResponse(data: any) {
  console.log('\n--- 📋 Inspección de Campos y Estructura ---');
  if (typeof data !== 'object' || data === null) {
    console.log('Tipo de dato raíz:', typeof data);
    return;
  }

  const rootKeys = Object.keys(data);
  console.log('Claves principales en la respuesta raíz:', rootKeys);

  // Buscar elementos / lista de vacantes
  const elements = data.elements || data.data || data.items || (Array.isArray(data) ? data : null);

  if (Array.isArray(elements)) {
    console.log(`\nCantidad de elementos devueltos: ${elements.length}`);
    if (elements.length > 0) {
      console.log('\nCampos del primer elemento retornado:');
      const sample = elements[0];
      for (const [key, value] of Object.entries(sample)) {
        const valType = Array.isArray(value) ? 'array' : typeof value;
        const preview = typeof value === 'object' ? JSON.stringify(value).slice(0, 80) : String(value).slice(0, 80);
        console.log(`  - ${key} (${valType}): ${preview}`);
      }

      console.log('\nPrimer elemento completo (muestra formateada):');
      console.dir(sample, { depth: 3, colors: true });
    }
  } else {
    console.log('\nNo se detectó un array directo "elements", inspeccionando objeto completo:');
    console.dir(data, { depth: 2, colors: true });
  }

  // Paginación
  if (data.paging) {
    console.log('\n📌 Metadatos de paginación encontrados:');
    console.dir(data.paging, { depth: null, colors: true });
  }
}

async function runTestSequence() {
  console.log('🚀 Iniciando secuencia de validación técnica de la Fase 1...\n');

  // Paso 5: Buscar "Software" en Colombia
  console.log('\n>>> PASO 5: Búsqueda genérica: "Software" en Colombia');
  await queryLinkedIn({
    keyword: 'Software',
    country: 'CO',
    count: 10,
    filenameSuffix: 'step5_software_co',
  });

  // Paso 6: Buscar "React" en Colombia
  console.log('\n>>> PASO 6: Búsqueda específica: "React" en Colombia');
  await queryLinkedIn({
    keyword: 'React',
    country: 'CO',
    count: 10,
    filenameSuffix: 'step6_react_co',
  });

  // Paso 7: Consultar rango de 2026
  console.log('\n>>> PASO 7: Prueba con filtros de fecha / histórico 2026');
  await queryLinkedIn({
    keyword: 'Software',
    country: 'CO',
    extraParams: {
      // parámetros de fecha según API de LinkedIn
      'dateRange.start.year': '2026',
      'dateRange.start.month': '1',
      'dateRange.start.day': '1',
    },
    count: 10,
    filenameSuffix: 'step7_software_2026',
  });

  // Paso 8: Probar paginación
  console.log('\n>>> PASO 8: Prueba de paginación (start: 10, count: 10)');
  await queryLinkedIn({
    keyword: 'React',
    country: 'CO',
    start: 10,
    count: 10,
    filenameSuffix: 'step8_react_pagination',
  });

  console.log('\n🏁 Secuencia de pruebas finalizada.');
}

// Permitir ejecutar consulta específica vía CLI o secuencia completa
const args = process.argv.slice(2);
if (args.length > 0) {
  const keywordArg = args[0];
  const countryArg = args[1] || 'CO';
  queryLinkedIn({ keyword: keywordArg, country: countryArg });
} else {
  runTestSequence();
}
