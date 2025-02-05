import { describe, expect, it } from 'vitest';
import { TEntityFieldGroupType } from '../EntityFieldGroup';
import { getEntityGroupValueDestination } from './get-entity-group-value-destination';

describe('getEntityGroupValueDestination', () => {
  it('should return correct destination path for director type', () => {
    // Arrange
    const type: TEntityFieldGroupType = 'director';
    const expectedPath = 'entity.data.additionalInfo.directors';

    // Act
    const result = getEntityGroupValueDestination(type);

    // Assert
    expect(result).toBe(expectedPath);
  });

  it('should return correct destination path for ubo type', () => {
    // Arrange
    const type: TEntityFieldGroupType = 'ubo';
    const expectedPath = 'entity.data.additionalInfo.ubos';

    // Act
    const result = getEntityGroupValueDestination(type);

    // Assert
    expect(result).toBe(expectedPath);
  });

  it('should throw error for invalid entity group type', () => {
    // Arrange
    const invalidType = 'invalid' as TEntityFieldGroupType;

    // Act & Assert
    expect(() => getEntityGroupValueDestination(invalidType)).toThrow(
      'Invalid entity group type: invalid',
    );
  });
});
