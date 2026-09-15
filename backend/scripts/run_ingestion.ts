import { runIngestion } from '../src/ingestion/ingest';

async function main() {
  const keywords = [
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

  console.log('🌟 Iniciando carga histórica masiva para Colombia...');
  console.log(`Palabras clave a consultar: ${keywords.length}`);
  console.log('Configuración: 10 páginas x 24 vacantes por página (hasta 240 vacantes por tecnología)\n');

  await runIngestion({
    keywords,
    maxPagesPerKeyword: 10,
    pageSize: 24,
    delayBetweenRequestsMs: 300,
  });
}

main().catch((err) => {
  console.error('Error fatal en ingestión masiva:', err);
  process.exit(1);
});
