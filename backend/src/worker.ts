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

    if (url.pathname === '/api/timeline' && request.method === 'GET') {
        const seriesParam = url.searchParams.get('series') || 'react,python,java';
        const metric = (url.searchParams.get('metric') as 'new' | 'active') || 'new';
        const days = parseInt(url.searchParams.get('days') || '30', 10);

        const slugs = seriesParam
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 3);

        if (slugs.length === 0) {
            return Response.json({ series: [], metric, days, data: [] });
        }

        const maxDateRow = await env.colobs_db
            .prepare('SELECT MAX(published_date) AS max_date FROM jobs')
            .first<{ max_date: string | null }>();

        const maxDateStr =
            maxDateRow?.max_date || new Date().toISOString().slice(0, 10);

        const maxDate = new Date(`${maxDateStr}T00:00:00Z`);

        const stepDays = days > 180 ? 5 : days > 90 ? 2 : 1;

        const intervals: Array<{
            labelDate: string;
            startDate: string;
            endDate: string;
        }> = [];

        for (let i = days; i >= 0; i -= stepDays) {
            const endOffset = i;
            const startOffset = Math.min(days, i + stepDays - 1);

            const dEnd = new Date(
            maxDate.getTime() - endOffset * 24 * 60 * 60 * 1000
            );

            const dStart = new Date(
            maxDate.getTime() - startOffset * 24 * 60 * 60 * 1000
            );

            intervals.push({
            labelDate: dEnd.toISOString().slice(0, 10),
            startDate: dStart.toISOString().slice(0, 10),
            endDate: dEnd.toISOString().slice(0, 10),
            });
        }

        const techMap = new Map<string, number>();

        for (const slug of slugs) {
            const tech = await env.colobs_db
            .prepare('SELECT id FROM technologies WHERE slug = ?')
            .bind(slug)
            .first<{ id: number }>();

            if (tech) {
            techMap.set(slug, tech.id);
            }
        }

        const data: Array<Record<string, string | number>> = [];

        for (const interval of intervals) {
            const point: Record<string, string | number> = {
            date: interval.labelDate,
            };

            for (const [slug, techId] of techMap.entries()) {
                if (metric === 'active') {
                    const row = await env.colobs_db
                    .prepare(`
                        SELECT COUNT(DISTINCT j.id) AS count
                        FROM jobs j
                        JOIN job_technologies jt ON j.id = jt.job_id
                        WHERE jt.technology_id = ?
                        AND j.published_date <= ?
                        AND j.is_active = 1
                    `)
                    .bind(techId, interval.endDate)
                    .first<{ count: number }>();

                    point[slug] = row?.count ?? 0;
                } else {
                    const row = await env.colobs_db
                    .prepare(`
                        SELECT COUNT(DISTINCT j.id) AS count
                        FROM jobs j
                        JOIN job_technologies jt ON j.id = jt.job_id
                        WHERE jt.technology_id = ?
                        AND j.published_date >= ?
                        AND j.published_date <= ?
                    `)
                    .bind(techId, interval.startDate, interval.endDate)
                    .first<{ count: number }>();

                    point[slug] = row?.count ?? 0;
                }
            }

            data.push(point);
        }

        return Response.json({
            series: slugs,
            metric,
            days,
            data,
        });
        }

    if (url.pathname === '/api/summary' && request.method === 'GET') {
        const seriesParam = url.searchParams.get('series') || 'react,python,java';
        const days = parseInt(url.searchParams.get('days') || '30', 10);

        const slugs = seriesParam
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
            .slice(0, 3);

        const summaries = [];

        for (const slug of slugs) {
            const tech = await env.colobs_db
            .prepare(`
                SELECT id, name, slug, category
                FROM technologies
                WHERE slug = ?
            `)
            .bind(slug)
            .first<{
                id: number;
                name: string;
                slug: string;
                category: string;
            }>();

            if (!tech) continue;

            const totalActiveRow = await env.colobs_db
            .prepare(`
                SELECT COUNT(DISTINCT j.id) AS count
                FROM jobs j
                JOIN job_technologies jt ON j.id = jt.job_id
                WHERE jt.technology_id = ?
                AND j.is_active = 1
            `)
            .bind(tech.id)
            .first<{ count: number }>();

            const currentPeriodRow = await env.colobs_db
            .prepare(`
                SELECT COUNT(DISTINCT j.id) AS count
                FROM jobs j
                JOIN job_technologies jt ON j.id = jt.job_id
                WHERE jt.technology_id = ?
                AND j.published_date >= date(
                    (SELECT MAX(published_date) FROM jobs),
                    '-' || ? || ' days'
                )
            `)
            .bind(tech.id, days)
            .first<{ count: number }>();

            const previousPeriodRow = await env.colobs_db
            .prepare(`
                SELECT COUNT(DISTINCT j.id) AS count
                FROM jobs j
                JOIN job_technologies jt ON j.id = jt.job_id
                WHERE jt.technology_id = ?
                AND j.published_date < date(
                    (SELECT MAX(published_date) FROM jobs),
                    '-' || ? || ' days'
                )
                AND j.published_date >= date(
                    (SELECT MAX(published_date) FROM jobs),
                    '-' || (? * 2) || ' days'
                )
            `)
            .bind(tech.id, days, days)
            .first<{ count: number }>();

            const totalActive = totalActiveRow?.count ?? 0;
            const currentPeriodNew = currentPeriodRow?.count ?? 0;
            const previousPeriodNew = previousPeriodRow?.count ?? 0;

            let changePercent = 0;

            if (previousPeriodNew > 0) {
            changePercent =
                Math.round(
                ((currentPeriodNew - previousPeriodNew) / previousPeriodNew) *
                    1000
                ) / 10;
            } else if (currentPeriodNew > 0) {
            changePercent = 100;
            }

            summaries.push({
            slug: tech.slug,
            name: tech.name,
            category: tech.category,
            totalActive,
            newInPeriod: currentPeriodNew,
            changePercent,
            });
        }

        return Response.json({ summaries });
        }

    return Response.json(
      { error: 'Endpoint no encontrado' },
      { status: 404 }
    );
  },
};