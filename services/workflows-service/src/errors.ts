import * as common from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { ErrorObject } from 'ajv';
import { ZodError } from 'zod';
import { ValidationError as ClassValidatorValidationError } from 'class-validator';
import { ValueError } from '@sinclair/typebox/errors';
import { camelCase } from 'lodash';

const normalizeValidationPath = (path: string) =>
  path
    // Remove first slash and replace the rest with '.'
    .replace('/', '')
    .replace(/\//g, '.')
    .split('.')
    .map(path => camelCase(path))
    .join('.');

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
    const errors = error.map(({ instancePath, message }) => {
      const normalizedPath = normalizeValidationPath(instancePath);

      return {
        message: `${normalizedPath} - ${message}.`,
        path: normalizedPath,
      };
    });

    return new ValidationError(errors);
  }

  static fromZodError(error: ZodError) {
    const errors = error.errors.map(zodIssue => ({
      message: zodIssue.message,
      path: zodIssue.path.join('.'), // Backwards compatibility - Legacy code message excepts array
    }));

    return new ValidationError(errors);
  }

  static fromClassValidator(error: ClassValidatorValidationError[]) {
    return new ValidationError(
      error.map(({ property, constraints = {} }) => ({
        message: `${Object.values(constraints).join(', ')}.`,
        path: property,
      })),
    );
  }

  static fromTypeboxError(error: ValueError[]) {
    const errors = error.map(({ path, message }) => {
      const normalizedPath = normalizeValidationPath(path);

      return {
        message: `${normalizedPath} - ${message}.`,
        path: normalizedPath,
      };
    });

    return new ValidationError(errors);
  }
}
