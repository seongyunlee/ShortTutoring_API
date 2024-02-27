import { DBError } from '../error/db-fail.error';
import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(DBError)
export class DBExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DBExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.status;
    const message = exception.message;

    response.status(409).json({
      message: message,
      success: false,
    });
  }
}
