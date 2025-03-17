import dayjs from 'dayjs';
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
    const date = dayjs(testDate).format('YYYY-MM-DD');
    const params = {
      type: 'minimumAge' as any,
      value: {},
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act & Assert
    expect(() => minimumAgeValueValidator(date, params)).toThrow('Minimum age is not specified.');
  });

  describe('Strict validation mode (default)', () => {
    it('should throw error if age is less than minimum age', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(13, 'year').format('YYYY-MM-DD'); // 13 years old
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: true },
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
      const birthDate = dayjs(testDate).subtract(18, 'year').format('YYYY-MM-DD'); // 18 years old
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: true },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
    });

    it('should not throw error if age is greater than minimum age', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(23, 'year').format('YYYY-MM-DD'); // 23 years old
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: true },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
    });

    it('should correctly calculate age when birth month is after current month', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(17, 'year').add(5, 'month').format('YYYY-MM-DD'); // 17 years and 5 months in the future
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: true },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      vi.mocked(formatErrorMessage).mockReturnValueOnce('Minimum age is 18.');

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).toThrow('Minimum age is 18.');
    });

    it('should correctly calculate age when birth day is after current day', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(18, 'year').add(14, 'day').format('YYYY-MM-DD'); // 17 years and ~11.5 months
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: true },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      vi.mocked(formatErrorMessage).mockReturnValueOnce('Minimum age is 18.');

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).toThrow('Minimum age is 18.');
    });
  });

  describe('Non-strict validation mode', () => {
    it('should throw error if birth year is less than required years from current year', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(17, 'year').format('YYYY-MM-DD'); // 17 years old
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: false },
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

    it('should not throw error if birth year is exactly required years from current year', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(18, 'year').endOf('year').format('YYYY-MM-DD'); // Last day of the year 18 years ago
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: false },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
    });

    it('should not throw error if birth year is more than required years from current year', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(19, 'year').format('YYYY-MM-DD'); // 19 years old
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: false },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
    });

    it('should ignore month and day in age calculation', () => {
      // Arrange
      const birthDate = dayjs(testDate).subtract(18, 'year').endOf('year').format('YYYY-MM-DD'); // Last day of the year 18 years ago
      const params = {
        type: 'minimumAge' as any,
        value: { minimumAge: 18, strict: false },
      } as ICommonValidator<IMinimumAgeValidatorParams>;

      // Act & Assert
      expect(() => minimumAgeValueValidator(birthDate, params)).not.toThrow();
    });
  });

  it('should use custom error message if provided', () => {
    // Arrange
    const birthDate = dayjs(testDate).subtract(13, 'year').format('YYYY-MM-DD'); // 13 years old
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

  it('should return true if age is valid', () => {
    // Arrange
    const birthDate = dayjs(testDate).subtract(23, 'year').format('YYYY-MM-DD'); // 23 years old
    const params = {
      type: 'minimumAge' as any,
      value: { minimumAge: 18 },
    } as ICommonValidator<IMinimumAgeValidatorParams>;

    // Act
    const result = minimumAgeValueValidator(birthDate, params);

    // Assert
    expect(result).toBe(true);
  });
});
