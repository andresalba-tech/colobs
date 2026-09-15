import { runIngestion } from '../src/ingestion/ingest';

async function main() {
  const keywords = [
    'React',
    'Python',
    'Java',
    'Node.js',
    'AI Engineer',
    'Full Stack',
    'Frontend',
    'Software',
  ];

  // Iniciar lote con 2 páginas (hasta 20 vacantes por tecnología para verificación inicial rápida)
  await runIngestion({
    keywords,
    maxPagesPerKeyword: 2,
    pageSize: 10,
    delayBetweenRequestsMs: 300,
  });
}

main().catch((err) => {
  console.error('Error fatal en ingestión:', err);
  process.exit(1);
});
