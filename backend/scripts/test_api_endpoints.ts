import { server } from '../src/api/server';

async function testApi() {
  const port = 4001;
  server.listen(port, async () => {
    console.log(`\n=== Probando Endpoints de la API en puerto ${port} ===\n`);

    try {
      // 1. Health
      console.log('1. Probando GET /api/health ...');
      const healthRes = await fetch(`http://localhost:${port}/api/health`);
      console.log('  Status:', healthRes.status, await healthRes.json());

      // 2. Series disponibles
      console.log('\n2. Probando GET /api/series ...');
      const seriesRes = await fetch(`http://localhost:${port}/api/series`);
      const seriesData: any = await seriesRes.json();
      console.log(`  Total series disponibles: ${seriesData.series?.length}`);
      console.log('  Muestra:', seriesData.series?.slice(0, 5).map((s: any) => s.name));

      // 3. Timeline
      console.log('\n3. Probando GET /api/timeline?series=react,python,java&days=30 ...');
      const timelineRes = await fetch(`http://localhost:${port}/api/timeline?series=react,python,java&days=30`);
      const timelineData: any = await timelineRes.json();
      console.log('  Puntos temporales devueltos:', timelineData.data?.length);
      console.log('  Primer punto:', timelineData.data?.[0]);
      console.log('  Último punto:', timelineData.data?.[timelineData.data?.length - 1]);

      // 4. Summary cards
      console.log('\n4. Probando GET /api/summary?series=react,python,java ...');
      const summaryRes = await fetch(`http://localhost:${port}/api/summary?series=react,python,java`);
      const summaryData: any = await summaryRes.json();
      console.log('  Tarjetas de resumen:', JSON.stringify(summaryData.summaries, null, 2));

      console.log('\n🎉 ¡Todos los endpoints de la API respondieron exitosamente!');
    } catch (e: any) {
      console.error('Error en test de API:', e);
    } finally {
      server.close();
    }
  });
}

testApi();
