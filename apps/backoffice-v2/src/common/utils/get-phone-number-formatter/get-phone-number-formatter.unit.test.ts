import { describe, it, expect } from 'vitest';
import { getPhoneNumberFormatter } from './get-phone-number-formatter';

describe('getPhoneNumberFormatter', () => {
  describe('when an email is passed', () => {
    it('should return undefined', () => {
      // Arrange
      const value = 'test+123321@gmail.com';

      // Act
      const result = getPhoneNumberFormatter(value);

      // Assert
      expect(result).toBeUndefined();
    });
  });

  describe('when a phone number with a country code is passed', () => {
    it('should return a formatter', () => {
      // Arrange
      const value = '+9720526253312';

      // Act
      const result = getPhoneNumberFormatter(value);

      // Assert
      expect(result).toBeDefined();
    });
  });

  describe('when a hyphenated phone number is passed', () => {
    it('should return a formatter', () => {
      // Arrange
      const value = '+972-052-625-3312';

      // Act
      const result = getPhoneNumberFormatter(value);

      // Assert
      expect(result).toBeDefined();
    });
  });
});
