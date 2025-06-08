import { describe, expect, it } from 'vitest';
import { ICommonValidator, IValidationSchema, TBaseValidators } from '../../types';
import { minimumValueValidator } from './minimum-value-validator';

describe('minimumValueValidator', () => {
  const params = {
    value: { minimum: 5 },
  };

  const mockSchema: IValidationSchema<TBaseValidators, any> = {
    id: 'test',
    validators: [],
    metadata: {},
    getThisContext: () => ({}),
  };

  it('should not throw error when value is equal to minimum', () => {
    expect(() =>
      minimumValueValidator(5, params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should not throw error when value is greater than minimum', () => {
    expect(() =>
      minimumValueValidator(10, params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should throw error when value is less than minimum', () => {
    expect(() => minimumValueValidator(3, params as ICommonValidator<any>, mockSchema)).toThrow(
      'Minimum value is 5.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { minimum: 5 },
      message: 'Custom message: min {minimum}',
    };

    expect(() =>
      minimumValueValidator(3, customParams as ICommonValidator<any>, mockSchema),
    ).toThrow('Custom message: min 5');
  });

  it('should handle decimal values', () => {
    expect(() => minimumValueValidator(4.9, params as ICommonValidator<any>, mockSchema)).toThrow(
      'Minimum value is 5.',
    );
    expect(() =>
      minimumValueValidator(5.1, params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should return true for non-number values', () => {
    expect(minimumValueValidator('test' as any, params as ICommonValidator<any>, mockSchema)).toBe(
      true,
    );
    expect(
      minimumValueValidator(undefined as any, params as ICommonValidator<any>, mockSchema),
    ).toBe(true);
    expect(minimumValueValidator(null as any, params as ICommonValidator<any>, mockSchema)).toBe(
      true,
    );
  });
});
