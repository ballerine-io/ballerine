import { describe, expect, it } from 'vitest';
import { ICommonValidator } from '../../types';
import { requiredValueValidator } from './required-validator';

describe('requiredValueValidator', () => {
  const params = {
    value: { required: true },
  };

  it('should not throw error when value is provided', () => {
    expect(() => requiredValueValidator('test', params as ICommonValidator<any>)).not.toThrow();
  });

  it('should not throw error when value is zero', () => {
    expect(() => requiredValueValidator(0, params as ICommonValidator<any>)).not.toThrow();
  });

  it('should throw error when value is undefined', () => {
    expect(() => requiredValueValidator(undefined, params as ICommonValidator<any>)).toThrow(
      'Required value.',
    );
  });

  it('should throw error when value is null', () => {
    expect(() => requiredValueValidator(null, params as ICommonValidator<any>)).toThrow(
      'Required value.',
    );
  });

  it('should throw error when value is empty string', () => {
    expect(() => requiredValueValidator('', params as ICommonValidator<any>)).toThrow(
      'Required value.',
    );
  });

  it('should handle custom error message', () => {
    const customParams = {
      value: { required: true },
      message: 'Custom required message',
    };

    expect(() => requiredValueValidator('', customParams as ICommonValidator<any>)).toThrow(
      'Custom required message',
    );
  });
});
