import { describe, expect, it, test } from 'vitest';
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

  describe('phone format', () => {
    const params = {
      value: { format: 'phone' },
    };

    test.each([
      '12025550123', // US (kept example number format as it's for testing)
      '447911123456', // UK (valid)
      '4915112345678', // Germany (fixed length)
      '33612345678', // France (valid)
      '819012345678', // Japan (valid)
      '8613912345678', // China (fixed format)
      '61412345678', // Australia (valid)
      '919812345678', // India (fixed format)
      '525551234567', // Mexico (fixed format)
      '5511987654321', // Brazil (valid)
      '27611234567', // South Africa (fixed format)
      '6591234567', // Singapore (fixed length)
      '85291234567', // Hong Kong (fixed format)
      '971501234567', // UAE (valid)
      '201001234567', // Egypt (fixed format)
      '821012345678', // South Korea (fixed format)
      '6281234567890', // Indonesia (valid)
      '60123456789', // Malaysia (fixed format)
      '66812345678', // Thailand (fixed format)
      '31612345678', // Netherlands (valid)
      '41791234567', // Switzerland (fixed format)
      '46701234567', // Sweden (valid)
      '4791234567', // Norway (valid)
      '358401234567', // Finland (fixed format)
      '351912345678', // Portugal (valid)
      '48123456789', // Poland (valid)
      '420601234567', // Czech Republic (valid)
      '36201234567', // Hungary (valid)
      '905301234567', // Turkey (valid)
      '34612345678', // Spain (valid)
      '393312345678', // Italy (fixed format)
      '43664123456', // Austria (valid)
      '32470123456', // Belgium (valid)
      '5491123456789', // Argentina (valid)
      '56912345678', // Chile (valid)
      '573123456789', // Colombia (fixed format)
      '524491234567', // Mexico (alternative format, fixed)
      '64211234567', // New Zealand (fixed format)
      '639123456789', // Philippines (valid)
      '40712345678', // Romania (fixed format)
      '381601234567', // Serbia (valid)
      '421901234567', // Slovakia (valid)
      '38631234567', // Slovenia (valid)
      '66891234567', // Thailand (alternative format, fixed)
      '380501234567', // Ukraine (valid)
      '84912345678', // Vietnam (valid)
      '358451234567', // Finland (alternative format, fixed)
      '972501234567', // Israel (valid)
    ])('should not throw error for valid phone number from country code %s', phoneNumber => {
      expect(() => formatValidator(phoneNumber, params as ICommonValidator<any>)).not.toThrow();
    });

    it('should return true for valid phone number', () => {
      expect(formatValidator('12025550145', params as ICommonValidator<any>)).toBe(true);
    });

    test.each(['invalid-phone', '123', '12345', 'abcdefghij', '123abc456', ''])(
      'should throw error for invalid phone number: %s',
      phoneNumber => {
        expect(() => formatValidator(phoneNumber, params as ICommonValidator<any>)).toThrow(
          'Invalid phone format.',
        );
      },
    );

    it('should return true for non-string value', () => {
      expect(formatValidator(123, params as ICommonValidator<any>)).toBe(true);
    });
  });

  describe('unsupported format', () => {
    const params = {
      value: { format: 'unsupported' as any },
    };

    it('should throw error for unsupported format', () => {
      expect(() => formatValidator('test', params as ICommonValidator<any>)).toThrow(
        'Format validator unsupported is not supported.',
      );
    });
  });
});
