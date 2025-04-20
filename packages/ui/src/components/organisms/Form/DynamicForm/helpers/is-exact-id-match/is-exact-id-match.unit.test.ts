import { isExactIdMatch } from './is-exact-id-match';
import { describe, expect, it } from 'vitest';

describe('isExactIdMatch', () => {
  describe('when ids match exactly', () => {
    it('should return true', () => {
      // Arrange
      const id = 'test-id';
      const priorityFieldId = 'test-id';

      // Act
      const result = isExactIdMatch(id, priorityFieldId);

      // Assert
      expect(result).toBe(true);
    });
  });

  describe('when ids do not match', () => {
    it('should return false for completely different ids', () => {
      // Arrange
      const id = 'test-id';
      const priorityFieldId = 'different-id';

      // Act
      const result = isExactIdMatch(id, priorityFieldId);

      // Assert
      expect(result).toBe(false);
    });

    it('should be case sensitive', () => {
      // Arrange
      const id = 'Test-ID';
      const priorityFieldId = 'test-id';

      // Act
      const result = isExactIdMatch(id, priorityFieldId);

      // Assert
      expect(result).toBe(false);
    });

    it('should not match partial ids', () => {
      // Arrange
      const id = 'test-id-extended';
      const priorityFieldId = 'test-id';

      // Act
      const result = isExactIdMatch(id, priorityFieldId);

      // Assert
      expect(result).toBe(false);
    });
  });
});
