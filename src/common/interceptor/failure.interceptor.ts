import {
  CallHandler,
  Catch,
  ExecutionContext,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';

@Catch()
export class FailureInterceptor implements NestInterceptor {
  private readonly logger = new Logger(FailureInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return next.handle().pipe(
      tap(() => {
        this.logger.debug(`Response: ${response.statusCode}`);
        if (response.statusCode >= 400) {
          this.logger.error(`Request: ${this.stringifyRequest(request)}`);
        }
      }),
    );
  }

  stringifyRequest(request: Request) {
    const url = request.url;
    const method = request.method;
    const headers = JSON.stringify(request.headers);
    const body = JSON.stringify(request.body);
    const params = JSON.stringify(request.params);
    const query = JSON.stringify(request.query);
    return `url: ${url}, method: ${method}, headers: ${headers}, body: ${body}, params: ${params}, query: ${query}`;
  }
}
