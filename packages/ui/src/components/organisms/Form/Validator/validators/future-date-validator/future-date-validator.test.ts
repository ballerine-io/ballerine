import dayjs from 'dayjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ICommonValidator, IValidationSchema, TBaseValidators } from '../../types';
import { futureDateValidator } from './future-date-validator';

describe('futureDateValidator', () => {
  let params: ICommonValidator<unknown, TBaseValidators>;
  let mockSchema: IValidationSchema<TBaseValidators, any>;

  beforeEach(() => {
    params = { message: 'Custom error message' } as unknown as ICommonValidator<
      unknown,
      TBaseValidators
    >;
    mockSchema = {
      id: 'test',
      validators: [],
      metadata: {},
      getThisContext: () => ({}),
    };
  });

  it('should throw an error if the date is invalid', () => {
    // Arrange
    const invalidDate = 'not-a-date';

    // Act & Assert
    expect(() => futureDateValidator(invalidDate, params, mockSchema)).toThrow('Invalid date.');
  });

  it('should throw an error if the date is not in the future', () => {
    // Arrange
    const pastDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    // Act & Assert
    expect(() => futureDateValidator(pastDate, params, mockSchema)).toThrow('Custom error message');
  });

  it('should throw an error with default message if the date is not in the future and no custom message is provided', () => {
    // Arrange
    const pastDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');
    params.message = undefined;

    // Act & Assert
    expect(() => futureDateValidator(pastDate, params, mockSchema)).toThrow(
      'Date must be in the future.',
    );
  });

  it('should return true if the date is in the future', () => {
    // Arrange
    const futureDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

    // Act
    const result = futureDateValidator(futureDate, params, mockSchema);

    // Assert
    expect(result).toBe(true);
  });

  it('current date should be accepted', () => {
    // Arrange
    const currentDate = dayjs().format('YYYY-MM-DD');

    // Act
    const result = futureDateValidator(currentDate, params, mockSchema);

    // Assert
    expect(result).toBe(true);
  });
});
