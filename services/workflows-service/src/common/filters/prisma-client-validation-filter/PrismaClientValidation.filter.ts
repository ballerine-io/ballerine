import { PrismaValidationExceptionParser } from './utils/PrismaValidationExceptionParser';
import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '@prisma/client';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { PrismaValidationExceptionParseResult } from '@/common/filters/prisma-client-validation-filter/utils/types';
import { InvalidArgumentParser } from '@/common/filters/prisma-client-validation-filter/utils/parsers/invalid-argument-parser/invalid-argument.parser';
import { UnknownArgumentParser } from '@/common/filters/prisma-client-validation-filter/utils/parsers/unknown-argument-parser/unknown-argument-parser';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

@Catch(Prisma.PrismaClientValidationError)
export class PrismaClientValidationFilter extends BaseExceptionFilter {
  constructor(private readonly logger: AppLoggerService) {
    super();
  }

  catch(exception: PrismaClientValidationError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();

    this.logger.error(`Prisma validation failed.\n ${exception.message}`);

    response.status(HttpStatus.BAD_REQUEST);

    response.json({
      statusCode: HttpStatus.BAD_REQUEST,
      message: 'Validation failed.',
      result: this.parseException(exception),
    });
  }

  private parseException(
    exception: PrismaClientValidationError,
  ): PrismaValidationExceptionParseResult {
    const parser = new PrismaValidationExceptionParser(
      [InvalidArgumentParser, UnknownArgumentParser],
      exception,
    );

    return parser.parse();
  }
}
