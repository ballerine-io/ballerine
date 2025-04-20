import { formatWildcardId } from './format-wildcard-id';

import { describe, expect, it } from 'vitest';

describe('formatWildcardId', () => {
  it('should format the id as a wildcard id', () => {
    // Arrange
    const id = 'test';

    // Act
    const wildcardId = formatWildcardId(id);

    // Assert
    expect(wildcardId).toBe('test-*');
  });

  it('should add suffix to the id', () => {
    // Arrange
    const id = 'test--';

    // Act
    const wildcardId = formatWildcardId(id);

    // Assert
    expect(wildcardId).toBe('test---*');
  });
});
