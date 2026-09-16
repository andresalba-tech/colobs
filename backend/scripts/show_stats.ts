import { db, initDatabase } from '../src/db/database';

initDatabase();

console.log('\n======================================================');
console.log('   🇨🇴 OBSERVATORIO TECH COLOMBIA - REPORTE DE ANALÍTICAS');
console.log('======================================================\n');

// 1. Resumen General del Mercado
const totalJobs = (db.prepare('SELECT COUNT(*) as c FROM jobs').get() as any)?.c || 0;
const totalCompanies = (db.prepare('SELECT COUNT(DISTINCT company) as c FROM jobs').get() as any)?.c || 0;
const dateRange = db.prepare('SELECT MIN(published_date) as min_d, MAX(published_date) as max_d FROM jobs').get() as any;

console.log('📊 RESUMEN DEL MERCADO LABORAL:');
console.log(`   • Vacantes únicas analizadas: ${totalJobs.toLocaleString()}`);
console.log(`   • Empresas contratando:       ${totalCompanies.toLocaleString()}`);
console.log(`   • Rango histórico de fechas:  ${dateRange?.min_d}  a  ${dateRange?.max_d}\n`);

// 2. Top 10 Tecnologías más demandadas
console.log('🏆 TOP 10 TECNOLOGÍAS MÁS DEMANDADAS EN COLOMBIA:');
const topTech = db.prepare(`
  SELECT t.name, t.category, COUNT(jt.job_id) as total
  FROM technologies t
  JOIN job_technologies jt ON t.id = jt.technology_id
  GROUP BY t.id
  ORDER BY total DESC
  LIMIT 10
`).all() as Array<{ name: string; category: string; total: number }>;

topTech.forEach((t, i) => {
  const bar = '█'.repeat(Math.round((t.total / (topTech[0]?.total || 1)) * 20));
  console.log(`   ${(i + 1).toString().padStart(2)}. ${t.name.padEnd(16)} [${t.category.padEnd(12)}] : ${t.total.toString().padStart(4)} vacantes  ${bar}`);
});

// 3. Distribución por Categoría
console.log('\n📁 DISTRIBUCIÓN POR CATEGORÍA TECNOLÓGICA:');
const categories = db.prepare(`
  SELECT t.category, COUNT(DISTINCT jt.job_id) as total
  FROM technologies t
  JOIN job_technologies jt ON t.id = jt.technology_id
  GROUP BY t.category
  ORDER BY total DESC
`).all() as Array<{ category: string; total: number }>;

categories.forEach((c) => {
  console.log(`   • ${c.category.padEnd(16)}: ${c.total} vacantes`);
});

// 4. Analíticas de Visitantes y Consultas
console.log('\n👥 ANALÍTICAS DE INTERACCIÓN DE USUARIOS (TELEMETRÍA):');
const totalEvents = (db.prepare('SELECT COUNT(*) as c FROM visitor_events').get() as any)?.c || 0;
const totalContacts = (db.prepare('SELECT COUNT(*) as c FROM visitor_contacts').get() as any)?.c || 0;

console.log(`   • Consultas registradas en la web: ${totalEvents}`);
console.log(`   • Contactos B2B recibidos:         ${totalContacts}`);

if (totalEvents > 0) {
  console.log('\n   🔍 Comparativas más consultadas por los visitantes:');
  const topComparisons = db.prepare(`
    SELECT series_selected, period_selected, COUNT(*) as count
    FROM visitor_events
    WHERE event_type = 'comparison_view' AND series_selected != ''
    GROUP BY series_selected, period_selected
    ORDER BY count DESC
    LIMIT 5
  `).all() as Array<{ series_selected: string; period_selected: string; count: number }>;

  topComparisons.forEach((comp, idx) => {
    console.log(`     ${idx + 1}. [${comp.series_selected}] (${comp.period_selected} días) - ${comp.count} veces`);
  });
}

console.log('\n======================================================\n');
