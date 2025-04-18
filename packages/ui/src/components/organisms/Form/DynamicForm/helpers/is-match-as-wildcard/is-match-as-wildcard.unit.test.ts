import { describe, expect, it } from 'vitest';
import { isMatchAsWildcard } from './is-match-as-wildcard';

describe('isMatchAsWildcard', () => {
  it('should return true when the id matches the wildcard id', () => {
    // Arrange
    const id = 'test-id';
    const priorityFieldId = 'test-id-*';

    // Act
    const result = isMatchAsWildcard(id, priorityFieldId);

    // Assert
    expect(result).toBe(true);
  });

  it('should return false when the id does not match the wildcard id', () => {
    // Arrange
    const id = 'test-id';
    const priorityFieldId = 'different-id-*';

    // Act
    const result = isMatchAsWildcard(id, priorityFieldId);

    // Assert
    expect(result).toBe(false);
  });

  it('should return false when the priority field id does not end with a wildcard', () => {
    // Arrange
    const id = 'test-id';
    const priorityFieldId = 'test-id';

    // Act
    const result = isMatchAsWildcard(id, priorityFieldId);

    // Assert
    expect(result).toBe(false);
  });
});
