import { MaxLengthValueValidator } from '@/components/providers/Validator/value-validators/max-length.value.validator';

describe('Max Length Value Validator', () => {
  describe('validation will fail', () => {
    test('when value is undefined', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate(undefined as any)).toThrowError('error');
    });

    test('when value is above maximum length', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate('123456')).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value is below maximum length', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate('12345')).not.toThrow();
    });

    test('when value is equal to maximum length', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate('12345')).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5 });

      expect(() => validator.validate('123456')).toThrowError('Maximum length is 5.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate('123456')).toThrowError('error');
    });

    test('should interpolate {maxLength} with the provided value', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error {maxLength}' });

      expect(() => validator.validate('123456')).toThrowError('error 5');
    });

    test('error message should stay same if interlopation tag is not present', () => {
      const validator = new MaxLengthValueValidator({ maxLength: 5, message: 'error' });

      expect(() => validator.validate('123456')).toThrowError('error');
    });
  });
});
