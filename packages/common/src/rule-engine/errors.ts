import { ZodError } from 'zod';

export class OperatorNotFoundError extends Error {
  constructor(operator: string) {
    super(`Unknown operator ${operator}`);
    this.name = OperatorNotFoundError.name;
  }
}

export class DataValueNotFoundError extends Error {
  constructor(key: string) {
    super(`Field ${key} is missing or null`);
    this.name = DataValueNotFoundError.name;
  }
}

export class ValidationFailedError extends Error {
  errors: { message: string; path: string }[] | undefined;
  constructor(key: string, message: string, error?: ZodError) {
    const errors = error?.errors.map(zodIssue => ({
      message: zodIssue.message,
      path: zodIssue.path.join('.'),
    }));

    super(
      `Validation failed for '${key}', message: ${message}, ${
        errors ? `error: ${JSON.stringify(error, null, 2)}` : '  '
      }`,
    );
    this.name = 'ValidationFailedError';
    this.errors = errors;
  }
}

export type EngineErrors =
  | OperatorNotFoundError
  | DataValueNotFoundError
  | ValidationFailedError
  | Error;
