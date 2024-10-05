import { MinimumValueValidator } from '@/components/providers/Validator/value-validators/minimum.value.validator';

describe('MinimumValueValidator', () => {
  describe('validation will fail', () => {
    test('when value is undefined', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(undefined as any)).toThrowError('error');
    });

    test('when value is below minimum', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(4)).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value is above minimum', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(5)).not.toThrow();
    });

    test('when value is equal to minimum', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(5)).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new MinimumValueValidator({ minimum: 5 });

      expect(() => validator.validate(4)).toThrowError('Minimum value is 5.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(4)).toThrowError('error');
    });

    test('should interpolate {minimum} with the provided value', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error {minimum}' });

      expect(() => validator.validate(4)).toThrowError('error 5');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new MinimumValueValidator({ minimum: 5, message: 'error' });

      expect(() => validator.validate(4)).toThrowError('error');
    });
  });
});
