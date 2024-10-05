import { PatternValueValidator } from '@/components/providers/Validator/value-validators/pattern.value.validator';

describe('Pattern Value Validator', () => {
  describe('validation will fail', () => {
    test('when value does not match pattern', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$', message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value matches pattern', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$', message: 'error' });

      expect(() => validator.validate('123')).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$' });

      expect(() => validator.validate('abc')).toThrowError('Value must match ^[0-9]+$.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });

    test('should interpolate {pattern} with the provided value', () => {
      const validator = new PatternValueValidator({
        pattern: '^[0-9]+$',
        message: 'error {pattern}',
      });

      expect(() => validator.validate('abc')).toThrowError('error ^[0-9]+$');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new PatternValueValidator({ pattern: '^[0-9]+$', message: 'error' });

      expect(() => validator.validate('abc')).toThrowError('error');
    });
  });
});
