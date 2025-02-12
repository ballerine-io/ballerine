import { describe, expect, it } from 'vitest';
import { TEntityFieldGroupType } from '../EntityFieldGroup';
import { getEntityGroupValueDestination } from './get-entity-group-value-destination';

describe('getEntityGroupValueDestination', () => {
  describe('when getting destination path for director type', () => {
    it('should return path to directors in entity additional info', () => {
      // Arrange
      const type: TEntityFieldGroupType = 'director';
      const expectedPath = 'entity.data.additionalInfo.directors';

      // When
      const result = getEntityGroupValueDestination(type);

      // Then
      expect(result).toBe(expectedPath);
    });
  });

  describe('when getting destination path for UBO type', () => {
    it('should return path to UBOs in entity additional info', () => {
      // Arrange
      const type: TEntityFieldGroupType = 'ubo';
      const expectedPath = 'entity.data.additionalInfo.ubos';

      // When
      const result = getEntityGroupValueDestination(type);

      // Then
      expect(result).toBe(expectedPath);
    });
  });

  describe('when getting destination path for invalid type', () => {
    it('should throw error with invalid type message', () => {
      // Arrange
      const invalidType = 'invalid' as TEntityFieldGroupType;
      const expectedError = 'Invalid entity group type: invalid';

      // When/Then
      expect(() => getEntityGroupValueDestination(invalidType)).toThrow(expectedError);
    });
  });
});
