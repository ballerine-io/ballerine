import dayjs from 'dayjs';
import { beforeEach, describe, expect, it } from 'vitest';
import { ICommonValidator, IValidationSchema, TBaseValidators } from '../../types';
import { pastDateValidator } from './past-date-validator';

describe('pastDateValidator', () => {
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
    expect(() => pastDateValidator(invalidDate, params, mockSchema)).toThrow('Invalid date.');
  });

  it('should throw an error if the date is not in the past', () => {
    // Arrange
    const futureDate = dayjs().add(1, 'day').format('YYYY-MM-DD');

    // Act & Assert
    expect(() => pastDateValidator(futureDate, params, mockSchema)).toThrow('Custom error message');
  });

  it('should throw an error with default message if the date is not in the past and no custom message is provided', () => {
    // Arrange
    const futureDate = dayjs().add(1, 'day').format('YYYY-MM-DD');
    params.message = undefined;

    // Act & Assert
    expect(() => pastDateValidator(futureDate, params, mockSchema)).toThrow(
      'Date must be in the past.',
    );
  });

  it('should return true if the date is in the past', () => {
    // Arrange
    const pastDate = dayjs().subtract(1, 'day').format('YYYY-MM-DD');

    // Act
    const result = pastDateValidator(pastDate, params, mockSchema);

    // Assert
    expect(result).toBe(true);
  });

  it('current date should be accepted', () => {
    // Arrange
    const currentDate = dayjs().format('YYYY-MM-DD');

    // Act
    const result = pastDateValidator(currentDate, params, mockSchema);

    // Assert
    expect(result).toBe(true);
  });
});
