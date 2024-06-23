import { ZodError } from 'zod';

export class OperationNotFoundError extends Error {
  constructor(operation: string) {
    super(`Unknown operation ${operation}`);
    this.name = OperationNotFoundError.name;
  }
}

export class DataValueNotFoundError extends Error {
  constructor(key: string) {
    super(`Field ${key} is missing or null`);
    this.name = DataValueNotFoundError.name;
  }
}

export class MissingKeyError extends Error {
  constructor(key: string) {
    super(`Rule is missing the '${key}' field`);
    this.name = 'MissingKeyError';
  }
}

export class ValidationFailedError extends Error {
  errors:
    | {
        message: string;
        path: string;
      }[]
    | undefined;

  constructor(key: string, operation: string, error?: ZodError) {
    super(`Validation failed for ${key} with operation ${operation}`);
    this.name = 'ValidationFailedError';

    this.errors = error?.errors.map(zodIssue => ({
      message: zodIssue.message,
      path: zodIssue.path.join('.'),
    }));
  }
}

export type EngineErrors =
  | OperationNotFoundError
  | DataValueNotFoundError
  | MissingKeyError
  | ValidationFailedError
  | Error;
