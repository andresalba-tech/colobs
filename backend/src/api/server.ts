import http from 'node:http';
import { URL, fileURLToPath } from 'node:url';
import { db, initDatabase } from '../db/database';
import { getAvailableSeries, getTimelineData, getSeriesCardSummary } from './analytics';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

// Inicializar BD
initDatabase();

export const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const reqUrl = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
  const pathname = reqUrl.pathname;

  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  try {
    // 1. Health check
    if (pathname === '/api/health' && req.method === 'GET') {
      const jobCount = (db.prepare('SELECT COUNT(*) as count FROM jobs').get() as any)?.count || 0;
      res.writeHead(200);
      res.end(JSON.stringify({ status: 'ok', jobsStored: jobCount, timestamp: new Date().toISOString() }));
      return;
    }

    // 2. Lista de tecnologías disponibles
    if (pathname === '/api/series' && req.method === 'GET') {
      const series = getAvailableSeries();
      res.writeHead(200);
      res.end(JSON.stringify({ series }));
      return;
    }

    // 3. Serie temporal para Recharts
    if (pathname === '/api/timeline' && req.method === 'GET') {
      const seriesParam = reqUrl.searchParams.get('series') || 'react,python,java';
      const metric = (reqUrl.searchParams.get('metric') as 'new' | 'active') || 'new';
      const days = parseInt(reqUrl.searchParams.get('days') || '30', 10);

      const slugs = seriesParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
      const data = getTimelineData(slugs, metric, days);

      res.writeHead(200);
      res.end(JSON.stringify({ series: slugs, metric, days, data }));
      return;
    }

    // 4. Resumen de tarjetas
    if (pathname === '/api/summary' && req.method === 'GET') {
      const seriesParam = reqUrl.searchParams.get('series') || 'react,python,java';
      const days = parseInt(reqUrl.searchParams.get('days') || '30', 10);

      const slugs = seriesParam.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 3);
      const summaries = slugs.map((slug) => getSeriesCardSummary(slug, days)).filter(Boolean);

      res.writeHead(200);
      res.end(JSON.stringify({ summaries }));
      return;
    }

    // 5. Registro de eventos anónimos de analítica propia
    if (pathname === '/api/events' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body || '{}');

      const stmt = db.prepare(`
        INSERT INTO visitor_events (event_type, series_selected, period_selected, created_at)
        VALUES (?, ?, ?, ?)
      `);
      stmt.run(data.event_type || 'comparison_view', data.series || '', data.period || '', new Date().toISOString());

      res.writeHead(201);
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // 6. Contacto voluntario
    if (pathname === '/api/contact' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) body += chunk;
      const data = JSON.parse(body || '{}');

      const stmt = db.prepare(`
        INSERT INTO visitor_contacts (name, company, role, email, phone, country, comment, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(
        data.name || 'Anónimo',
        data.company || '',
        data.role || '',
        data.email || '',
        data.phone || '',
        data.country || 'Colombia',
        data.comment || '',
        new Date().toISOString()
      );

      res.writeHead(201);
      res.end(JSON.stringify({ success: true, message: 'Contacto registrado correctamente' }));
      return;
    }

    // 404
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Endpoint no encontrado' }));
  } catch (error: any) {
    res.writeHead(500);
    res.end(JSON.stringify({ error: error.message || 'Error interno del servidor' }));
  }
});

// Arrancar el servidor si este script es el punto de entrada directo
const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isDirectRun) {
  server.listen(PORT, () => {
    console.log(`🚀 Observatorio Tech Colombia - Backend API escuchando en http://localhost:${PORT}`);
  });
}
