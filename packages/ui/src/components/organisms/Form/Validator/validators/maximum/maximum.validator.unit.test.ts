import { describe, expect, it } from 'vitest';
import { ICommonValidator } from '../../types';
import { maximumValueValidator } from './maximum-validator';

describe('maximumValueValidator', () => {
  const params = {
    value: { maximum: 10 },
  };

  it('should not throw error when value is equal to maximum', () => {
    expect(() => maximumValueValidator(10, params as ICommonValidator<any>)).not.toThrow();
  });

  it('should not throw error when value is less than maximum', () => {
    expect(() => maximumValueValidator(9, params as ICommonValidator<any>)).not.toThrow();
  });

  it('should throw error when value exceeds maximum', () => {
    expect(() => maximumValueValidator(11, params as ICommonValidator<any>)).toThrow(
      'Maximum value is 10.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { maximum: 10 },
      message: 'Value cannot be greater than {maximum}',
    };

    expect(() => maximumValueValidator(11, customParams as ICommonValidator<any>)).toThrow(
      'Value cannot be greater than 10',
    );
  });

  it('should handle decimal values', () => {
    expect(() => maximumValueValidator(10.1, params as ICommonValidator<any>)).toThrow(
      'Maximum value is 10.',
    );
    expect(() => maximumValueValidator(9.9, params as ICommonValidator<any>)).not.toThrow();
  });

  it('should return true for non-number values', () => {
    expect(maximumValueValidator('test' as any, params as ICommonValidator<any>)).toBe(true);
    expect(maximumValueValidator(undefined as any, params as ICommonValidator<any>)).toBe(true);
    expect(maximumValueValidator(null as any, params as ICommonValidator<any>)).toBe(true);
  });
});
