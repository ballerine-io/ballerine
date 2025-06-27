import { describe, expect, it } from 'vitest';
import { ICommonValidator, IValidationSchema, TBaseValidators } from '../../types';
import { requiredValueValidator } from './required-validator';
import { IRequiredValueValidatorParams } from './types';

describe('requiredValueValidator', () => {
  const params = {
    value: { required: true },
  };

  const mockSchema: IValidationSchema<TBaseValidators, IRequiredValueValidatorParams> = {
    id: 'test',
    validators: [],
    metadata: {},
    getThisContext: () => ({}),
  };

  const customParams = {
    value: { required: true },
    message: 'Custom required message',
  };

  it('should not throw error when value is provided', () => {
    expect(() =>
      requiredValueValidator('test', params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should not throw error when value is zero', () => {
    expect(() =>
      requiredValueValidator(0, params as ICommonValidator<any>, mockSchema),
    ).not.toThrow();
  });

  it('should throw error when value is undefined', () => {
    expect(() =>
      requiredValueValidator(undefined, params as ICommonValidator<any>, mockSchema),
    ).toThrow('Required value.');
  });

  it('should throw error when value is null', () => {
    expect(() => requiredValueValidator(null, params as ICommonValidator<any>, mockSchema)).toThrow(
      'Required value.',
    );
  });

  it('should throw error when value is empty string', () => {
    expect(() => requiredValueValidator('', params as ICommonValidator<any>, mockSchema)).toThrow(
      'Required value.',
    );
  });

  it('should handle custom error message', () => {
    expect(() =>
      requiredValueValidator('', customParams as ICommonValidator<any>, mockSchema),
    ).toThrow('Custom required message');
  });
});
