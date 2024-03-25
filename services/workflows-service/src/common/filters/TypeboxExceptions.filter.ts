import { ArgumentsHost, Catch, HttpException } from '@nestjs/common';
import { BaseExceptionFilter, HttpAdapterHost } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { HttpStatusCode } from 'axios';
import { TypeboxValidationException } from 'nestjs-typebox';
import { Request, Response } from 'express';
import { ValidationError } from '@/errors';
import { ValueError } from '@sinclair/typebox/errors';

@Catch(TypeboxValidationException)
export class TypeboxValidationExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService, applicationRef?: HttpAdapterHost) {
    super(applicationRef?.httpAdapter);
  }

  private logError(request: Request<unknown>, error: HttpException) {
    const status = error.getStatus();
    const message = `Outgoing response - Failure - Client Error:`;
    const errorRes = error.getResponse();

    this.logger.error(message, {
      name: error.name,
      status,
      error: errorRes,
      message: error.message,
      responseTime: Date.now() - request.startTime,
    });
  }

  catch(exception: TypeboxValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const exceptionResponse = exception.getResponse();
    const error = ValidationError.fromTypeboxError(
      (
        exceptionResponse as {
          errors: ValueError[];
        }
      ).errors,
    );

    this.logError(request, error);

    response
      .status(exception.getStatus())
      .setHeader('Content-Type', 'application/json')
      .json({
        errorCode: String(HttpStatusCode[exception.getStatus()]),
        message: error.message,
        statusCode: exception.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        errors: error.getErrors(),
      });
  }
}
