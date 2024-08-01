import { MaximumValueValidator } from '@/components/providers/Validator/value-validators/maximum.value.validator';

describe('Maximum Value Validator', () => {
  describe('validation will fail', () => {
    test('when value is undefined', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(undefined as any)).toThrowError('error');
    });

    test('when value is above maximum', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(6)).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value is below maximum', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(4)).not.toThrow();
    });

    test('when value is equal to maximum', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(5)).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new MaximumValueValidator({ maximum: 5 });

      expect(() => validator.validate(6)).toThrowError('Maximum value is 5.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(6)).toThrowError('error');
    });

    test('should interpolate {maximum} with the provided value', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error {maximum}' });

      expect(() => validator.validate(6)).toThrowError('error 5');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new MaximumValueValidator({ maximum: 5, message: 'error' });

      expect(() => validator.validate(6)).toThrowError('error');
    });
  });
});
