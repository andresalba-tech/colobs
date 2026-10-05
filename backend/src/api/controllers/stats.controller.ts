import { RequestContext, HttpResponse } from '../router.js';
import { StatsService } from '../../application/services/stats.service.js';

export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  getHealth = (_ctx: RequestContext): HttpResponse => {
    const health = this.statsService.getHealth();
    return {
      statusCode: 200,
      body: health,
    };
  };

  getStats = (_ctx: RequestContext): HttpResponse => {
    const stats = this.statsService.getGeneralStats();
    return {
      statusCode: 200,
      body: stats,
    };
  };
}
