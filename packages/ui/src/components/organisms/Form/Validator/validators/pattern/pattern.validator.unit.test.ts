import { describe, expect, it } from 'vitest';
import { ICommonValidator } from '../../types';
import { patternValueValidator } from './pattern-validator';

describe('patternValueValidator', () => {
  const params = {
    value: { pattern: '^[A-Z]+$' },
  };

  it('should not throw error when value matches pattern', () => {
    expect(() => patternValueValidator('ABC', params as ICommonValidator<any>)).not.toThrow();
  });

  it('should throw error when value does not match pattern', () => {
    expect(() => patternValueValidator('abc', params as ICommonValidator<any>)).toThrow(
      'Value must match ^[A-Z]+$.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { pattern: '^[A-Z]+$' },
      message: 'Custom message: {pattern}',
    };

    expect(() => patternValueValidator('abc', customParams as ICommonValidator<any>)).toThrow(
      'Custom message: ^[A-Z]+$',
    );
  });

  it('should handle empty string', () => {
    expect(() => patternValueValidator('', params as ICommonValidator<any>)).toThrow(
      'Value must match ^[A-Z]+$.',
    );
  });

  it('should return true for non-string values', () => {
    expect(patternValueValidator(undefined as any, params as ICommonValidator<any>)).toBe(true);
    expect(patternValueValidator(null as any, params as ICommonValidator<any>)).toBe(true);
    expect(patternValueValidator(123 as any, params as ICommonValidator<any>)).toBe(true);
  });
});
