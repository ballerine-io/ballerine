import { FormatValueValidator } from '@/components/providers/Validator/value-validators/format.value.validator';

describe('Format Value Validator', () => {
  describe('validation will fail', () => {
    test('when value does not match format', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });

    test('when unsupported format is provided', () => {
      //@ts-ignore
      const validator = new FormatValueValidator({ format: 'unsupported', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('Format unsupported is not supported.');
    });
  });

  describe('validation will pass', () => {
    test('when value matches format', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error' });

      expect(() => validator.validate('example@gmail.com')).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new FormatValueValidator({ format: 'email' });

      expect(() => validator.validate('abc')).toThrowError('Invalid format.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });

    test('should interpolate {format} with the provided value', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error {format}' });

      expect(() => validator.validate('abc')).toThrowError('error email');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new FormatValueValidator({ format: 'email', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });
  });
});
