import { RequiredValueValidator } from '@/components/providers/Validator/value-validators/required.value-validator';

describe('Required Value Validator', () => {
  describe('validation will fail', () => {
    test('when value is undefined', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate(undefined as any)).toThrowError('error');
    });

    test('when value is empty string', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate('')).toThrowError('error');
    });

    test('when value is null', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate(null as any)).toThrowError('error');
    });
  });

  describe('validation will pass', () => {
    test('when value is not empty string', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate('value')).not.toThrow();
    });

    test('when value is not null', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate(0)).not.toThrow();
    });

    test('when value is not undefined', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate(false)).not.toThrow();
    });
  });

  describe('validator error messages', () => {
    test('should return default error message when message is not provided', () => {
      const validator = new RequiredValueValidator({ required: true });

      expect(() => validator.validate('')).toThrowError('Value is required.');
    });

    test('should return custom error message when message is provided', () => {
      const validator = new RequiredValueValidator({ message: 'error', required: true });

      expect(() => validator.validate('')).toThrowError('error');
    });
  });
});
