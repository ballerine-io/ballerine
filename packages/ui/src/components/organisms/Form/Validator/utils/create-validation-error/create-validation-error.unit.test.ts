import { describe, expect, it } from 'vitest';
import { createValidationError } from './create-validation-error';

describe('createValidationError', () => {
  it('should create validation error with formatted id', () => {
    const params = {
      id: 'test',
      invalidValue: 'invalid',
      message: 'error message',
      stack: [1, 2],
    };

    const result = createValidationError(params);

    expect(result).toEqual({
      id: 'test-1-2',
      originId: 'test',
      invalidValue: 'invalid',
      message: ['error message'],
    });
  });

  it('should handle empty stack', () => {
    const params = {
      id: 'test',
      invalidValue: 123,
      message: 'error message',
      stack: [],
    };

    const result = createValidationError(params);

    expect(result).toEqual({
      id: 'test',
      originId: 'test',
      invalidValue: 123,
      message: ['error message'],
    });
  });

  it('should handle single stack value', () => {
    const params = {
      id: 'test',
      invalidValue: null,
      message: 'error message',
      stack: [1],
    };

    const result = createValidationError(params);

    expect(result).toEqual({
      id: 'test-1',
      originId: 'test',
      invalidValue: null,
      message: ['error message'],
    });
  });
});
