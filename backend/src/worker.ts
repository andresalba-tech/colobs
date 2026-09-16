interface Env {
  colobs_db: any;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/health' && request.method === 'GET') {
      const row = await env.colobs_db
        .prepare('SELECT COUNT(*) AS count FROM jobs')
        .first();

      return Response.json({
        status: 'ok',
        jobsStored: row?.count ?? 0,
        timestamp: new Date().toISOString(),
      });
    }

    if (url.pathname === '/api/series' && request.method === 'GET') {
        const result = await env.colobs_db
            .prepare(`
            SELECT id, name, slug, category
            FROM technologies
            ORDER BY name ASC
            `)
            .all();

        return Response.json({
            series: result.results,
        });
    }

    return Response.json(
      { error: 'Endpoint no encontrado' },
      { status: 404 }
    );
  },
};