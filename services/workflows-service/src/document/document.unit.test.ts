import { IUIDefinitionPage } from '@/common/ui-definition-parse-utils/types';
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
        const uiSchema: IUIDefinitionPage[] = [
          {
            stateName: 'test',
            elements: [
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
            ],
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, {});

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toEqual({
          type: 'bank_statement',
          templateId: 'bank-statement-document',
          category: 'financial_information',
          issuingCountry: 'ZZ',
          issuingVersion: '1',
          version: '1',
          ballerineEntityId: undefined,
          entityType: 'business',
        });
      });

      it('should parse business documents with explicit business destination', () => {
        // Arrange
        const uiSchema: IUIDefinitionPage[] = [
          {
            stateName: 'test',
            elements: [
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
            ],
          },
        ];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, {});

        // Assert
        expect(result.business).toHaveLength(1);
        const businessDoc = result.business[0];
        expect(businessDoc).toEqual({
          type: 'general_document',
          templateId: 'proof-of-address-document',
          category: 'proof_of_address',
          issuingCountry: 'ZZ',
          issuingVersion: '1',
          version: '1',
          ballerineEntityId: undefined,
          entityType: 'business',
        });
      });
    });

    describe('Individual Documents', () => {
      it('should parse UBO documents', () => {
        // Arrange
        const uiSchema: IUIDefinitionPage[] = [
          {
            stateName: 'test',
            elements: [
              {
                id: 'test-id-123',
                element: 'entityfieldgroup',
                params: {
                  type: 'ubo',
                },
                valueDestination: 'entity.data.additionalInfo.ubos',
                children: [
                  {
                    id: 'test-id-1234',
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
                ],
              },
            ],
          },
        ];

        const context = {
          entity: {
            data: {
              additionalInfo: {
                ubos: [
                  {
                    ballerineEntityId: 'ubo-123',
                  },
                ],
              },
            },
          },
        };

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, context);

        // Assert
        expect(result.individuals.ubos).toHaveLength(1);
        const uboDoc = result.individuals.ubos[0];
        expect(uboDoc).toEqual({
          type: 'general_document',
          templateId: 'proof-of-address-document',
          category: 'proof_of_address',
          issuingCountry: 'ZZ',
          issuingVersion: '1',
          version: '1',
          ballerineEntityId: 'ubo-123',
          entityType: 'ubo',
        });
      });

      it('should parse director documents', () => {
        // Arrange
        const uiSchema: IUIDefinitionPage[] = [
          {
            stateName: 'test',
            elements: [
              {
                id: 'test-id-123',
                element: 'entityfieldgroup',
                params: {
                  type: 'director',
                },
                valueDestination: 'entity.data.additionalInfo.directors',
                children: [
                  {
                    id: 'test-id',
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
                    valueDestination: 'entity.data.additionalInfo.directors[$0].documents',
                  },
                ],
              },
            ],
          },
        ];

        const context = {
          entity: {
            data: {
              additionalInfo: {
                directors: [
                  {
                    ballerineEntityId: 'director-123',
                  },
                ],
              },
            },
          },
        };

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, context);

        // Assert
        expect(result.individuals.directors).toHaveLength(1);
        const directorDoc = result.individuals.directors[0];
        expect(directorDoc).toEqual({
          type: 'general_document',
          templateId: 'proof-of-address-document',
          category: 'proof_of_address',
          issuingCountry: 'ZZ',
          issuingVersion: '1',
          version: '1',
          ballerineEntityId: 'director-123',
          entityType: 'director',
        });
      });
    });

    describe('Edge Cases', () => {
      it('should handle empty UI schema array', () => {
        // Arrange
        const uiSchema: IUIDefinitionPage[] = [];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, {});

        // Assert
        expect(result).toEqual({
          business: [],
          individuals: {
            ubos: [],
            directors: [],
          },
        });
      });

      it('should ignore document fields without template params', () => {
        // Arrange
        const uiSchema = [
          {
            stateName: 'test',
            elements: [
              {
                element: 'documentfield',
                params: {},
                valueDestination: 'documents',
              },
            ],
          },
        ] as IUIDefinitionPage[];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, {});

        // Assert
        expect(result.business).toHaveLength(0);
        expect(result.individuals.ubos).toHaveLength(0);
        expect(result.individuals.directors).toHaveLength(0);
      });

      it('should handle malformed template data', () => {
        // Arrange
        const uiSchema = [
          {
            elements: [
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
            ],
          },
        ] as IUIDefinitionPage[];

        // Act
        const result = documentService['parseDocumentsFromUISchema'](uiSchema, {});

        // Assert
        expect(result.business).toHaveLength(0);
        expect(result.individuals.ubos).toHaveLength(0);
        expect(result.individuals.directors).toHaveLength(0);
      });
    });
  });
});
