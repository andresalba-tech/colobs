import { RequestContext, HttpResponse } from '../router.js';
import { VisitorService } from '../../application/services/visitor.service.js';

export class VisitorController {
  constructor(
    private readonly visitorService: VisitorService,
    private readonly adminApiKey: string
  ) {}

  recordEvent = (ctx: RequestContext): HttpResponse => {
    const result = this.visitorService.recordEvent(ctx.body || {});
    return {
      statusCode: 201,
      body: result,
    };
  };

  recordContact = (ctx: RequestContext): HttpResponse => {
    const result = this.visitorService.recordContact(ctx.body || {});
    return {
      statusCode: 201,
      body: result,
    };
  };

  getVisitorReport = (ctx: RequestContext): HttpResponse => {
    const authHeader = ctx.headers.authorization;
    const providedToken =
      ctx.searchParams.get('token') ||
      ctx.searchParams.get('key') ||
      (authHeader ? authHeader.replace(/^Bearer\s+/i, '') : null) ||
      (ctx.headers['x-admin-token'] as string);

    if (!this.visitorService.isAuthorizedAdmin(providedToken, this.adminApiKey)) {
      return {
        statusCode: 401,
        body: {
          error: 'No autorizado',
          message:
            'Se requiere una clave válida para acceder al informe de analíticas. Use ?key=tu_clave o header Authorization: Bearer tu_clave',
        },
      };
    }

    const report = this.visitorService.getAnalyticsReport();
    return {
      statusCode: 200,
      body: report,
    };
  };
}
