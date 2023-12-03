import { env } from '@/env';
import { isObject } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { inspect } from 'util';
import { ArgumentsHost, Catch, HttpException, InternalServerErrorException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { HttpStatusCode } from 'axios';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    return this._handleHttpErrorResponse(exception, request, response);
  }

  private _handleHttpErrorResponse(exception: unknown, request: Request, response: Response) {
    const serverError = this.getHttpException(exception);

    if (this._logErrorIfRelevant(serverError.getStatus())) {
      this.logError(request, serverError);
    }

    response
      .status(serverError.getStatus())
      .setHeader('Content-Type', 'application/json')
      .json({
        errorCode: String(HttpStatusCode[serverError.getStatus()]),
        message: serverError.message,
        statusCode: serverError.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
      });
  }

  private getHttpException(exception: unknown) {
    let serverError;
    if (this.isHttpException(exception)) {
      // Nest http error handler
      serverError = exception;
    } else {
      serverError = new InternalServerErrorException({
        cause: inspect(exception),
      });
    }
    return serverError;
  }

  isHttpException(error: unknown): error is HttpException {
    return (
      isObject(error) &&
      'status' in error &&
      typeof (error as HttpException).getStatus() === 'number'
    );
  }

  private _logErrorIfRelevant(status: number) {
    // Dont log 401/403 errors or log every error if debug
    return (status >= 400 && ![401, 403].includes(status)) || env.LOG_LEVEL === 'debug';
  }

  private logError(request: Request<unknown>, error: HttpException) {
    const status = error.getStatus();
    const message = this.composeLogMesesageForStatus(status);

    const errorRes = error.getResponse() as HttpException | undefined;

    this.logger.error(message, {
      name: error.name,
      status,
      error: inspect(errorRes),
      message: error.message,
      responseTime: Date.now() - request.startTime,
    });
  }

  private composeLogMesesageForStatus(status: number) {
    let message = `Outgoing response - Failure`;

    if (status >= 400 && status < 500) {
      message = message + ' - Client Error:';
    } else if (status >= 500) {
      message = message + ' - Server Error:';
    }
    return message;
  }
}
