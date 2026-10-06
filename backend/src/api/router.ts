import http from 'node:http';
import { URL } from 'node:url';

export interface RequestContext {
  req: http.IncomingMessage;
  res: http.ServerResponse;
  method: string;
  pathname: string;
  searchParams: URLSearchParams;
  headers: http.IncomingHttpHeaders;
  body: any;
}

export interface HttpResponse {
  statusCode: number;
  body?: any;
  headers?: Record<string, string>;
}

export type RouteHandler = (ctx: RequestContext) => Promise<HttpResponse | void> | HttpResponse | void;

export class Router {
  private routes: Map<string, RouteHandler> = new Map();

  get(path: string, handler: RouteHandler): this {
    this.routes.set(`GET:${path}`, handler);
    return this;
  }

  post(path: string, handler: RouteHandler): this {
    this.routes.set(`POST:${path}`, handler);
    return this;
  }

  private async parseBody(req: http.IncomingMessage): Promise<any> {
    const contentType = req.headers['content-type'] || '';
    let raw = '';
    for await (const chunk of req) {
      raw += chunk;
    }
    if (!raw.trim()) return {};
    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(raw);
      } catch {
        return {};
      }
    }
    return raw;
  }

  async dispatch(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
    // Standard CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-admin-token');

    // Handle OPTIONS Preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      res.end();
      return;
    }

    const host = req.headers.host || 'localhost';
    const parsedUrl = new URL(req.url || '/', `http://${host}`);
    const pathname = parsedUrl.pathname;
    const method = req.method || 'GET';

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    try {
      let body: any = {};
      if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
        body = await this.parseBody(req);
      }

      const ctx: RequestContext = {
        req,
        res,
        method,
        pathname,
        searchParams: parsedUrl.searchParams,
        headers: req.headers,
        body,
      };

      // Route lookup
      const routeKey = `${method}:${pathname}`;
      const handler = this.routes.get(routeKey);

      if (!handler) {
        this.sendResponse(res, {
          statusCode: 404,
          body: { error: 'Endpoint no encontrado' },
        });
        return;
      }

      const result = await handler(ctx);
      if (result && typeof result === 'object' && 'statusCode' in result) {
        this.sendResponse(res, result);
      }
    } catch (err: any) {
      this.sendResponse(res, {
        statusCode: 500,
        body: { error: err.message || 'Error interno del servidor' },
      });
    }
  }

  private sendResponse(res: http.ServerResponse, response: HttpResponse): void {
    if (response.headers) {
      for (const [key, val] of Object.entries(response.headers)) {
        res.setHeader(key, val);
      }
    }
    res.writeHead(response.statusCode);
    if (response.body !== undefined) {
      if (typeof response.body === 'string') {
        res.end(response.body);
      } else {
        res.end(JSON.stringify(response.body));
      }
    } else {
      res.end();
    }
  }
}
