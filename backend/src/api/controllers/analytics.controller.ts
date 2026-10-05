import { RequestContext, HttpResponse } from '../router.js';
import { AnalyticsService } from '../../application/services/analytics.service.js';

export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  getSeries = (_ctx: RequestContext): HttpResponse => {
    const series = this.analyticsService.getAvailableSeries();
    return {
      statusCode: 200,
      body: { series },
    };
  };

  getTimeline = (ctx: RequestContext): HttpResponse => {
    const seriesParam = ctx.searchParams.get('series');
    const metricParam = ctx.searchParams.get('metric');
    const daysParam = ctx.searchParams.get('days');

    const slugs = this.analyticsService.parseSlugs(seriesParam);
    const metric = (metricParam as 'new' | 'active') || 'new';
    const days = parseInt(daysParam || '30', 10);

    const data = this.analyticsService.getTimelineData(slugs, metric, days);

    return {
      statusCode: 200,
      body: { series: slugs, metric, days, data },
    };
  };

  getSummary = (ctx: RequestContext): HttpResponse => {
    const seriesParam = ctx.searchParams.get('series');
    const daysParam = ctx.searchParams.get('days');

    const slugs = this.analyticsService.parseSlugs(seriesParam);
    const days = parseInt(daysParam || '30', 10);

    const summaries = this.analyticsService.getSeriesSummaries(slugs, days);

    return {
      statusCode: 200,
      body: { summaries },
    };
  };
}
