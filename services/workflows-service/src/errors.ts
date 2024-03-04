import * as common from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorObject } from 'ajv';
import startCase from 'lodash/startCase';
import lowerCase from 'lodash/lowerCase';
import { ZodError } from 'zod';

export class ForbiddenException extends common.ForbiddenException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class NotFoundException extends common.NotFoundException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

export class SessionExpiredException extends common.UnauthorizedException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  message!: string;
}

class DetailedValidationError {
  @ApiProperty()
  message!: string;

  @ApiProperty()
  path!: string;
}

export class ValidationError extends common.BadRequestException {
  @ApiProperty()
  statusCode!: number;
  @ApiProperty()
  static message = 'Validation error';

  @ApiProperty({ type: DetailedValidationError })
  errors!: Array<{ message: string; path: string }>;

  constructor(errors: Array<{ message: string; path: string }>) {
    super(
      {
        statusCode: common.HttpStatus.BAD_REQUEST,
        message: ValidationError.message,
        errors,
      },
      'Validation error',
    );

    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }

  static fromAjvError(error: Array<ErrorObject<string, Record<string, any>, unknown>>) {
    const errors = error.map(({ instancePath, message }) => ({
      message: `${startCase(lowerCase(instancePath)).replace('/', '.')} ${message}.`,
      path: instancePath,
    }));

    return new ValidationError(errors);
  }

  static fromZodError(error: ZodError) {
    const errors = error.errors.map(zodIssue => ({
      message: zodIssue.message,
      path: zodIssue.path.join('.'), // Backwards compatibility - Legacy code message excepts array
    }));

    return new ValidationError(errors);
  }
}
