import { DocumentService } from './document.service';

describe('DocumentService', () => {
  let documentService: DocumentService;

  beforeEach(() => {
    // @ts-expect-error - We only need the service for unit testing parseDocumentsFromUISchema
    documentService = new DocumentService();
  });

  describe('parseDocumentsFromUISchema', () => {
    describe('Business Documents', () => {
      it('should parse business documents with root documents destination', () => {
        // Arrange
        const uiSchema = [
          {
            id: 'bank-information-bank-statement-document',
            element: 'documentfield',
            params: {
              template: {
                id: 'bank-statement-document',
                type: 'bank_statement',
                category: 'financial_information',
                issuer: { country: 'ZZ' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);
        console.log(result);

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toBeDefined();

        if (businessDoc) {
          expect(businessDoc).toEqual({
            entityType: 'business',
            type: 'bank_statement',
            templateId: 'bank-statement-document',
            category: 'financial_information',
            issuingCountry: 'ZZ',
            issuingVersion: '1',
            version: '1',
          });
        }
      });

      it('should parse business documents with explicit business destination', () => {
        // Arrange
        const uiSchema = [
          {
            id: 'proof-of-address-document',
            element: 'documentfield',
            params: {
              template: {
                id: 'proof-of-address-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'ZZ' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'business.documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toBeDefined();

        if (businessDoc) {
          expect(businessDoc).toEqual({
            entityType: 'business',
            type: 'general_document',
            templateId: 'proof-of-address-document',
            category: 'proof_of_address',
            issuingCountry: 'ZZ',
            issuingVersion: '1',
            version: '1',
          });
        }
      });
    });

    describe('UBO Documents', () => {
      it('should parse UBO documents with array index in path', () => {
        // Arrange
        const uiSchema = [
          {
            id: 'company-ownership-ubos-proof-of-address-document-input',
            element: 'documentfield',
            params: {
              template: {
                id: 'proof-of-address-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'ZZ' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'entity.data.additionalInfo.ubos[$0].documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.individuals.ubos).toHaveLength(1);
        const uboDoc = result.individuals.ubos[0];
        expect(uboDoc).toBeDefined();

        if (uboDoc) {
          expect(uboDoc).toEqual({
            entityType: 'ubo',
            type: 'general_document',
            templateId: 'proof-of-address-document',
            category: 'proof_of_address',
            issuingCountry: 'ZZ',
            issuingVersion: '1',
            version: '1',
          });
        }
      });

      it('should handle multiple UBO documents for different UBOs', () => {
        // Arrange
        const uiSchema = [
          {
            element: 'documentfield',
            params: {
              template: {
                id: 'proof-of-address-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'US' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'entity.data.additionalInfo.ubos[$0].documents',
          },
          {
            element: 'documentfield',
            params: {
              template: {
                id: 'proof-of-address-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'UK' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'entity.data.additionalInfo.ubos[$1].documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.individuals.ubos).toHaveLength(2);
        const firstUbo = result.individuals.ubos[0];
        const secondUbo = result.individuals.ubos[1];

        expect(firstUbo).toBeDefined();
        expect(secondUbo).toBeDefined();

        if (firstUbo && secondUbo) {
          expect(firstUbo.issuingCountry).toBe('US');
          expect(secondUbo.issuingCountry).toBe('UK');
        }
      });
    });

    describe('Complex Document Scenarios', () => {
      it('should handle documents with conditional visibility', () => {
        // Arrange
        const uiSchema = [
          {
            id: 'security-questions-page-pci-document',
            element: 'documentfield',
            hidden: [
              {
                value: { '!': { var: 'entity.data.additionalInfo.companyIsPCICompliant' } },
                engine: 'json-logic',
              },
            ],
            params: {
              template: {
                id: 'pci-certification-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'ZZ' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toBeDefined();

        if (businessDoc) {
          expect(businessDoc.templateId).toBe('pci-certification-document');
        }
      });

      it('should handle documents with validation rules', () => {
        // Arrange
        const uiSchema = [
          {
            element: 'documentfield',
            validate: [
              {
                type: 'document',
                value: {
                  id: 'proof-of-address-document',
                  pageNumber: 0,
                  pageProperty: 'ballerineFileId',
                },
                considerRequired: true,
              },
            ],
            params: {
              template: {
                id: 'proof-of-address-document',
                type: 'general_document',
                category: 'proof_of_address',
                issuer: { country: 'ZZ' },
                issuingVersion: 1,
                version: '1',
              },
            },
            valueDestination: 'documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toBeDefined();

        if (businessDoc) {
          expect(businessDoc.templateId).toBe('proof-of-address-document');
        }
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty UI schema array', () => {
        // Arrange
        const uiSchema: Array<Record<string, any>> = [];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result).toEqual({
          business: [],
          individuals: {
            ubos: [],
            directors: [],
          },
        });
      });

      it('should handle deeply nested document fields', () => {
        // Arrange
        const uiSchema = [
          {
            element: 'container',
            children: [
              {
                element: 'container',
                elements: [
                  {
                    element: 'documentfield',
                    params: {
                      template: {
                        id: 'nested-doc',
                        type: 'general_document',
                        category: 'proof_of_address',
                        issuer: { country: 'ZZ' },
                        issuingVersion: 1,
                        version: '1',
                      },
                    },
                    valueDestination: 'documents',
                  },
                ],
              },
            ],
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toBeDefined();

        if (businessDoc) {
          expect(businessDoc.templateId).toBe('nested-doc');
        }
      });

      it('should ignore document fields without template params', () => {
        // Arrange
        const uiSchema = [
          {
            element: 'documentfield',
            params: {},
            valueDestination: 'documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(0);
      });

      it('should handle malformed template data', () => {
        // Arrange
        const uiSchema = [
          {
            element: 'documentfield',
            params: {
              template: {
                id: 'malformed-doc',
                // Missing required fields
              },
            },
            valueDestination: 'documents',
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema);

        // Assert
        expect(result.business).toHaveLength(0);
      });
    });
  });
});
