import { describe, expect, it } from 'vitest';
import { ICommonValidator } from '../../types';
import { maxLengthValidator } from './max-length-validator';

describe('maxLengthValidator', () => {
  const params = {
    value: { maxLength: 5 },
  };

  it('should not throw error when string length is equal to maxLength', () => {
    expect(() => maxLengthValidator('12345', params as ICommonValidator<any>)).not.toThrow();
  });

  it('should not throw error when string length is less than maxLength', () => {
    expect(() => maxLengthValidator('1234', params as ICommonValidator<any>)).not.toThrow();
  });

  it('should throw error when string length exceeds maxLength', () => {
    expect(() => maxLengthValidator('123456', params as ICommonValidator<any>)).toThrow(
      'Maximum length is 5.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { maxLength: 5 },
      message: 'Text cannot be longer than {maxLength} characters',
    };

    expect(() => maxLengthValidator('123456', customParams as ICommonValidator<any>)).toThrow(
      'Text cannot be longer than 5 characters',
    );
  });

  it('should handle empty string', () => {
    expect(() => maxLengthValidator('', params as ICommonValidator<any>)).not.toThrow();
  });

  it('should handle undefined value', () => {
    expect(() =>
      maxLengthValidator(undefined as any, params as ICommonValidator<any>),
    ).not.toThrow();
  });
});
