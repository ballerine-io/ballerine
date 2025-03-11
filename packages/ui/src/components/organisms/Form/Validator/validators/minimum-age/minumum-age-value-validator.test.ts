import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ICommonValidator } from '../../types';
import { formatErrorMessage } from '../../utils/format-error-message/format-error-message';
import { minimumAgeValueValidator } from './minimum-age-value-validator';
import { IMinimumAgeValidatorParams } from './types';

// Mock formatErrorMessage only
vi.mock('../../utils/format-error-message/format-error-message');

describe('minimumAgeValueValidator', () => {
  // Use a fixed date for testing
  const testDate = new Date(2023, 0, 1); // January 1, 2023

  beforeEach(() => {
    vi.resetAllMocks();

    // Mock formatErrorMessage
    vi.mocked(formatErrorMessage).mockImplementation((message, key, value) =>
      message.replace(`{${key}}`, value),
    );

    // Use a fixed date for testing
    vi.useFakeTimers();
    vi.setSystemTime(testDate);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should throw error if date is invalid', () => {
    // Arrange
    const invalidDate = null;
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act & Assert
    expect(() => minimumAgeValueValidator(invalidDate as any, params)).toThrow('Invalid date.');
  });

  it('should throw error if minimum age is not specified', () => {
    // Arrange
    const date = '2000-01-01';
    const params = {
      type: 'minimumAge' as any,
      value: {},
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act & Assert
    expect(() => minimumAgeValueValidator(date, params)).toThrow('Minimum age is not specified.');
  });

  it('should throw error if age is less than minimum age', () => {
    // Arrange
    const birthDate = '2010-01-01'; // 13 years old based on test date (2023-01-01)
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
      message: 'Minimum age is {minimumAge}.',
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    vi.mocked(formatErrorMessage).mockReturnValueOnce('Minimum age is 18.');

    // Act & Assert
    expect(() => minimumAgeValueValidator(birthDate, params)).toThrow('Minimum age is 18.');
    expect(formatErrorMessage).toHaveBeenCalledWith(
      'Minimum age is {minimumAge}.',
      'minimumAge',
      '18',
    );
  });

  it('should not throw error if age is equal to minimum age', () => {
    // Arrange
    const birthDate = '2005-01-01'; // 18 years old based on test date (2023-01-01)
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act & Assert
    expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
  });

  it('should not throw error if age is greater than minimum age', () => {
    // Arrange
    const birthDate = '2000-01-01'; // 23 years old based on test date (2023-01-01)
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act & Assert
    expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
  });

  it('should correctly calculate age when birth month is after current month', () => {
    // Arrange
    const birthDate = '2005-06-01'; // 17 years old based on test date (2023-01-01)
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    vi.mocked(formatErrorMessage).mockReturnValueOnce('Minimum age is 18.');

    // Act & Assert
    expect(() => minimumAgeValueValidator(birthDate, params)).toThrow('Minimum age is 18.');
  });

  it('should use custom error message if provided', () => {
    // Arrange
    const birthDate = '2010-01-01'; // 13 years old based on test date (2023-01-01)
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
      message: 'You must be at least {minimumAge} years old.',
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    vi.mocked(formatErrorMessage).mockReturnValueOnce('You must be at least 18 years old.');

    // Act & Assert
    expect(() => minimumAgeValueValidator(birthDate, params)).toThrow(
      'You must be at least 18 years old.',
    );
    expect(formatErrorMessage).toHaveBeenCalledWith(
      'You must be at least {minimumAge} years old.',
      'minimumAge',
      '18',
    );
  });
});
