import { describe, expect, it } from 'vitest';
import { isMatchAsWildcard } from './is-match-as-wildcard';

describe('isMatchAsWildcard', () => {
  describe('when the priority field id ends with a wildcard', () => {
    describe('when the id matches the wildcard pattern', () => {
      it('should return true', () => {
        // Arrange
        const id = 'test-id';
        const priorityFieldId = 'test-id-*';

        // Act
        const result = isMatchAsWildcard(id, priorityFieldId);

        // Assert
        expect(result).toBe(true);
      });
    });

    describe('when the id does not match the wildcard pattern', () => {
      it('should return false', () => {
        // Arrange
        const id = 'test-id';
        const priorityFieldId = 'different-id-*';

        // Act
        const result = isMatchAsWildcard(id, priorityFieldId);

        // Assert
        expect(result).toBe(false);
      });
    });
  });

  describe('when the priority field id does not end with a wildcard', () => {
    it('should return false', () => {
      // Arrange
      const id = 'test-id';
      const priorityFieldId = 'test-id';

      // Act
      const result = isMatchAsWildcard(id, priorityFieldId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
