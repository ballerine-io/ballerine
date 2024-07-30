import { MinLengthValueValidator } from '@/components/providers/Validator/value-validators/min-length.value.validator';

describe('MinLength Value Validator', () => {
  describe('validation will fail', () => {
    test('when value is undefined', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate(undefined as any)).toThrowError('error');
    });

    test('when value is below minimum length', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate('1234')).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value is above minimum length', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate('12345')).not.toThrow();
    });

    test('when value is equal to minimum length', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate('12345')).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new MinLengthValueValidator({ minLength: 5 });

      expect(() => validator.validate('1234')).toThrowError('Minimum length is 5.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate('1234')).toThrowError('error');
    });

    test('should interpolate {minLength} with the provided value', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error {minLength}' });

      expect(() => validator.validate('1234')).toThrowError('error 5');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new MinLengthValueValidator({ minLength: 5, message: 'error' });

      expect(() => validator.validate('1234')).toThrowError('error');
    });
  });
});
