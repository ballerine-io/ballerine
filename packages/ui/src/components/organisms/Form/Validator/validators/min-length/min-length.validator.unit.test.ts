import { describe, expect, it } from 'vitest';
import { ICommonValidator, IValidationSchema, TBaseValidators } from '../../types';
import { minLengthValidator } from './min-length-validator';

describe('minLengthValidator', () => {
  const params = {
    value: { minLength: 4 },
  };

  const mockSchema: IValidationSchema<TBaseValidators, any> = {
    id: 'test',
    validators: [],
    metadata: {},
    getThisContext: () => ({}),
  };

  it('should not throw error when string length is equal to minLength', () => {
    expect(() =>
      minLengthValidator('test', params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should not throw error when string length is greater than minLength', () => {
    expect(() =>
      minLengthValidator('testing', params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should throw error when string length is less than minLength', () => {
    expect(() => minLengthValidator('te', params as ICommonValidator<any>, mockSchema)).toThrow(
      'Minimum length is 4.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { minLength: 4 },
      message: 'Custom message: {minLength}',
    };

    expect(() =>
      minLengthValidator('te', customParams as ICommonValidator<any>, mockSchema),
    ).toThrow('Custom message: 4');
  });

  it('should handle empty string', () => {
    expect(() => minLengthValidator('', params as ICommonValidator<any>, mockSchema)).toThrow(
      'Minimum length is 4.',
    );
  });

  it('should return true for undefined value', () => {
    expect(minLengthValidator(undefined as any, params as ICommonValidator<any>, mockSchema)).toBe(
      true,
    );
  });
});
