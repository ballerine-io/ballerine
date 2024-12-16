import { describe, expect, it } from 'vitest';
import { checkIfDateIsValid } from './check-if-date-is-valid';

describe('checkIfDateIsValid', () => {
  it('should return false for dates before year 1000', () => {
    expect(checkIfDateIsValid('0999-12-31')).toBe(false);
    expect(checkIfDateIsValid('0001-01-01')).toBe(false);
    expect(checkIfDateIsValid(new Date('0500-06-15'))).toBe(false);
  });

  it('should return true for valid dates after year 1000', () => {
    expect(checkIfDateIsValid('2023-01-01')).toBe(true);
    expect(checkIfDateIsValid('1000-01-01')).toBe(true);
    expect(checkIfDateIsValid('3000-12-31')).toBe(true);
  });

  it('should handle different input types', () => {
    const currentDate = new Date();
    expect(checkIfDateIsValid(currentDate)).toBe(true);
    expect(checkIfDateIsValid(currentDate.toISOString())).toBe(true);
    expect(checkIfDateIsValid(currentDate.getTime())).toBe(true);
  });

  it('should handle edge cases', () => {
    expect(checkIfDateIsValid('1000-01-01')).toBe(true);
    expect(checkIfDateIsValid('999-12-31')).toBe(false);
    expect(checkIfDateIsValid('9999-12-31')).toBe(true);
  });
});
