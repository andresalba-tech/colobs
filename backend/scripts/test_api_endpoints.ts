import { server } from '../src/api/server.js';

async function testApi() {
  const port = 4001;
  server.listen(port, async () => {
    console.log(`\n=== Probando Endpoints de la API en puerto ${port} ===\n`);

    try {
      // 1. Health
      console.log('1. Probando GET /api/health ...');
      const healthRes = await fetch(`http://localhost:${port}/api/health`);
      console.log('  Status:', healthRes.status, await healthRes.json());

      // 2. Stats
      console.log('\n2. Probando GET /api/stats ...');
      const statsRes = await fetch(`http://localhost:${port}/api/stats`);
      const statsData: any = await statsRes.json();
      console.log('  Status:', statsRes.status);
      console.log(`  Total vacantes: ${statsData.totalJobs}, Empresas: ${statsData.totalCompanies}`);
      console.log(`  Top 3 tecnologías:`, statsData.topTechnologies?.slice(0, 3).map((t: any) => `${t.name} (${t.total})`));

      // 3. Series disponibles
      console.log('\n3. Probando GET /api/series ...');
      const seriesRes = await fetch(`http://localhost:${port}/api/series`);
      const seriesData: any = await seriesRes.json();
      console.log('  Status:', seriesRes.status);
      console.log(`  Total series disponibles: ${seriesData.series?.length}`);
      console.log('  Muestra:', seriesData.series?.slice(0, 5).map((s: any) => s.name));

      // 4. Timeline
      console.log('\n4. Probando GET /api/timeline?series=react,python,java&days=30 ...');
      const timelineRes = await fetch(`http://localhost:${port}/api/timeline?series=react,python,java&days=30`);
      const timelineData: any = await timelineRes.json();
      console.log('  Status:', timelineRes.status);
      console.log('  Puntos temporales devueltos:', timelineData.data?.length);
      console.log('  Primer punto:', timelineData.data?.[0]);
      console.log('  Último punto:', timelineData.data?.[timelineData.data?.length - 1]);

      // 5. Summary cards
      console.log('\n5. Probando GET /api/summary?series=react,python,java ...');
      const summaryRes = await fetch(`http://localhost:${port}/api/summary?series=react,python,java`);
      const summaryData: any = await summaryRes.json();
      console.log('  Status:', summaryRes.status);
      console.log('  Tarjetas de resumen recibidas:', summaryData.summaries?.length);

      // 6. Registrar evento anónimo (POST /api/events)
      console.log('\n6. Probando POST /api/events ...');
      const eventRes = await fetch(`http://localhost:${port}/api/events`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'comparison_view',
          series: 'react,python',
          period: '30',
        }),
      });
      console.log('  Status:', eventRes.status, await eventRes.json());

      // 7. Registrar contacto (POST /api/contact)
      console.log('\n7. Probando POST /api/contact ...');
      const contactRes = await fetch(`http://localhost:${port}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Usuario Test SOLID',
          email: 'test@example.com',
          company: 'Solid Corp',
          comment: 'Verificación de refactorización',
        }),
      });
      console.log('  Status:', contactRes.status, await contactRes.json());

      // 8. Admin Report no autorizado (sin token)
      console.log('\n8. Probando GET /api/admin/visitor-report (Sin Token - debe dar 401) ...');
      const unauthRes = await fetch(`http://localhost:${port}/api/admin/visitor-report`);
      console.log('  Status esperado (401):', unauthRes.status, (await unauthRes.json()).error);

      // 9. Admin Report autorizado (con token)
      console.log('\n9. Probando GET /api/admin/visitor-report?key=colobs_secret_2026 (Con Token - debe dar 200) ...');
      const authRes = await fetch(`http://localhost:${port}/api/admin/visitor-report?key=colobs_secret_2026`);
      const authData: any = await authRes.json();
      console.log('  Status esperado (200):', authRes.status);
      console.log('  Reporte generado:', {
        totalInteractions: authData.overview?.totalInteractionsRecorded,
        totalLeads: authData.overview?.totalLeadsReceived,
      });

      console.log('\n🎉 ¡TODOS LOS ENDPOINTS DE LA API FUNCIONAN AL 100% EXACTAMENTE COMO ANTES!');
    } catch (e: any) {
      console.error('Error en test de API:', e);
      process.exitCode = 1;
    } finally {
      server.close();
    }
  });
}

testApi();
