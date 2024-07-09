import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { AjvValidationException } from 'ballerine-nestjs-typebox';
import { ValidationError } from '@/errors';
import { HttpStatusCode } from 'axios';

@Catch(AjvValidationException)
export class AjvValidationExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    super();
  }

  catch(error: unknown, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const request = context.getRequest();
    const response = context.getResponse();

    const checkIsErrorWithResponse = (
      error: unknown,
    ): error is {
      response: {
        errors: Parameters<(typeof ValidationError)['fromAjvError']>[0];
        message: string;
      };
    } => {
      return typeof error === 'object' && error !== null && 'response' in error;
    };

    const errorResponse = checkIsErrorWithResponse(error) ? error.response : undefined;

    const validationError = ValidationError.fromAjvError(errorResponse?.errors ?? []);

    response
      .status(HttpStatus.BAD_REQUEST)
      .setHeader('Content-Type', 'application/json')
      .json({
        errorCode: HttpStatusCode[HttpStatus.BAD_REQUEST],
        message: errorResponse?.message ?? 'Validation error',
        statusCode: HttpStatus.BAD_REQUEST,
        timestamp: new Date().toISOString(),
        path: request.url,
        errors: validationError.getErrors(),
      });
  }
}
