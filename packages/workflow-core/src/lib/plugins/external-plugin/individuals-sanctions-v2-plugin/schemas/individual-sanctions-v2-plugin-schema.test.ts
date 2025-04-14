import { describe, expect, it } from 'vitest';
import { IndividualsSanctionsV2PluginPayloadSchema } from './individual-sanctions-v2-plugin-schema';

describe('IndividualsSanctionsV2PluginPayloadSchema', () => {
  describe('kycInformation', () => {
    describe('when kycInformation is an object and dateOfBirth is present at root level', () => {
      it('should pass validation', () => {
        const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1980-01-01',
        });

        expect(result).toEqual({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '1980-01-01',
        });
      });
    });

    describe('when kycInformation is an object and dateOfBirth is present at additionalInfo level', () => {
      it('should pass validation', () => {
        const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse({
          firstName: 'John',
          lastName: 'Doe',
          additionalInfo: {
            dateOfBirth: '1980-01-01',
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

    describe('when kycInformation is an array', () => {
      describe('when dateOfBirth is present at root level of each object in the array', () => {
        it('should pass validation', () => {
          const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse([
            {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1980-01-01',
            },
          ]);

          expect(result).toEqual([
            {
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1980-01-01',
            },
          ]);
        });

        describe('when dateOfBirth is present at additionalInfo level of each object in the array', () => {
          it('should pass validation', () => {
            const result = IndividualsSanctionsV2PluginPayloadSchema.shape.kycInformation.parse([
              {
                firstName: 'John',
                lastName: 'Doe',
                additionalInfo: {
                  dateOfBirth: '1980-01-01',
                },
              },
            ]);

            expect(result).toEqual([
              {
                firstName: 'John',
                lastName: 'Doe',
                additionalInfo: {
                  dateOfBirth: '1980-01-01',
                },
              },
            ]);
          });
        });
      });
    });
  });
});
