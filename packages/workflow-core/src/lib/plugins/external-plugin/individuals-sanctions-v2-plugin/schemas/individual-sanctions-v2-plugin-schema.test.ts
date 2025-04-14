import { describe, expect, it } from 'vitest';
import { IndividualsSanctionsV2PluginPayloadSchema } from './individual-sanctions-v2-plugin-schema';

describe('IndividualsSanctionsV2PluginPayloadSchema', () => {
  describe('kycInformation', () => {
    it('should pass validation with dateOfBirth at root level of object', () => {
      const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        additionalInfo: {
          mainRepresentative: {
            ballerineEntityId: 'ballerineEntityId',
          },
        },
      });

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1980-01-01',
        additionalInfo: {},
      });
    });

    it('should pass validation with dateOfBirth at additionalInfo level of object', () => {
      const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse({
        firstName: 'John',
        lastName: 'Doe',
        additionalInfo: {
          dateOfBirth: '1980-01-01',
          mainRepresentative: {
            ballerineEntityId: 'ballerineEntityId',
          },
        },
      });

      expect(result).toEqual({
        firstName: 'John',
        lastName: 'Doe',
        additionalInfo: {
          dateOfBirth: '1980-01-01',
        },
      });
    });
  });
});
