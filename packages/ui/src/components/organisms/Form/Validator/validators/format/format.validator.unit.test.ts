import { describe, expect, it } from 'vitest';
import { ICommonValidator } from '../../types';
import { formatValidator } from './format-validator';

describe('formatValidator', () => {
  describe('email format', () => {
    const params = {
      value: { format: 'email' },
    };

    it('should not throw error for valid email', () => {
      expect(() =>
        formatValidator('test@example.com', params as ICommonValidator<any>),
      ).not.toThrow();
    });

    it('should return true for valid email', () => {
      expect(formatValidator('test@example.com', params as ICommonValidator<any>)).toBe(true);
    });

    it('should throw error for invalid email', () => {
      expect(() => formatValidator('invalid-email', params as ICommonValidator<any>)).toThrow(
        'Invalid email format.',
      );
    });

    it('should throw error for empty string', () => {
      expect(() => formatValidator('', params as ICommonValidator<any>)).toThrow(
        'Invalid email format.',
      );
    });

    it('should return true for non-string value', () => {
      expect(formatValidator(123, params as ICommonValidator<any>)).toBe(true);
    });
  });

  describe('unsupported format', () => {
    const params = {
      value: { format: 'phone' },
    };

    it('should throw error for unsupported format', () => {
      expect(() => formatValidator('123-456-7890', params as ICommonValidator<any>)).toThrow(
        'Format validator phone is not supported.',
      );
    });
  });
});
