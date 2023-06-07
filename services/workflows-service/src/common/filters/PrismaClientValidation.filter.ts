import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(PrismaClientValidationFilter.name);

  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    // Exception message of this error could not be sent to client for security reasons.
    // Message exposes internals of application which end-user should not know about.
    // Writting details to logs which could be parsed in future.
    this.logger.error(`Prisma validation failed.\n ${exception.message}`);

    response.status(HttpStatus.BAD_REQUEST);

    response.json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed.Details written to logs.',
    });
  }
}
