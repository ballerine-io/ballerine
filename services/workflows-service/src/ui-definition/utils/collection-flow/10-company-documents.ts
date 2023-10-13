const validationSchema = {
  type: 'object',
  required: ['documents'],
  properties: {
    documents: {
      type: 'array',
      minItems: 10,
      items: {
        type: 'object',
        required: ['pages'],
        properties: {
          pages: {
            type: 'array',
            items: {
              type: 'object',
              required: ['ballerineFileId'],
              properties: {
                ballerineFileId: {
                  type: 'string',
                  minLength: 1
                }
              }
            }
          }
        }
      }
    }
  }
};


export const CompanyDocuments = {
  type: 'page',
  number: 10,
  stateName: 'company_documents',
  name: 'Company Documents',
  pageValidator: {
    type: 'json-schema',
    value: validationSchema,
  },
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              options: {
                text: 'Company Documents'
              },
            },
            {
              type: 'h3',
              options: {
                text: 'Merchant Company Documents'
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
          },
          elements: [
            {
              name: 'document-certificates-of-incorporation',
              type: 'document',
              valueDestination: 'documents[0].pages[0].ballerineFileId',
              options: {
                label: 'Certificate of Incorporation',
                description: 'Not older than 6 months.',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'registration_document',
                  type: 'certificate_of_incorporation',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 0,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-business-registration-certificate',
              type: 'document',
              valueDestination: 'documents[1].pages[0].ballerineFileId',
              options: {
                label: 'Business Registration Certificate',
                description: 'Notarized document',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'registration_document',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 1,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-corporate-tax-certificate',
              type: 'document',
              valueDestination: 'documents[2].pages[0].ballerineFileId',
              options: {
                label: 'Business Registration Certificate',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'corporate_tax_certificate',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 2,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-certificate-of-good-standing',
              type: 'document',
              valueDestination: 'documents[3].pages[0].ballerineFileId',
              options: {
                label: 'Certificate of Good Standing',
                description: 'If the company is older than 12 months',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'certificate_of_good_standing',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 3,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-certificate-of-directors-and-shareholders',
              type: 'document',
              valueDestination: 'documents[4].pages[0].ballerineFileId',
              options: {
                label: 'Certificate of Directors & Shareholders',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'certificate_of_directors_and_shareholders',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 4,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-picture-of-company-seal',
              type: 'document',
              valueDestination: 'documents[5].pages[0].ballerineFileId',
              options: {
                label: 'Picture of the company seal',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'picture_of_company_seal',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 5,
                  documentPage: 0,
                },
              },
            },
            {
              type: 'json-form',
              elements: [
                {
                  name: 'confirmation-checkbox',
                  type: 'checkbox',
                  valueDestination: 'entity.data.additionalInfo.signature.isConfirmed',
                  options: {
                    label: 'I Confirm',
                    jsonFormDefinition: {
                      type: 'boolean',
                    },
                  },
                },
              ],
            },
            {
              type: 'description',
              label:
                "By click 'Next', an email containing an identity verification link will be sent to shareholders listed.",
            },
          ],
        },
        {
          type: 'h3',
          name: 'office-pictures-title',
          options: {
            text: 'Office Pictures'
          }
        },
        {
          type: 'json-form',
          name: 'office-pictures-form',
          options: {},
          elements: [
            {
              name: 'document-website-pictures',
              type: 'document',
              valueDestination: 'documents[6].pages[0].ballerineFileId',
              options: {
                label: 'Domain purchase record/certificate',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'website_picture',
                  type: 'business_registration',
                },
                mappingParams: {
                  documentIndex: 6,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-office-front-door-pictures',
              type: 'document',
              valueDestination: 'documents[7].pages[0].ballerineFileId',
              options: {
                label: 'Front door photo showing the company name',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'office_picture_front_door',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 7,
                  documentPage: 0,
                },
              },
            },
            {
              name: 'document-office-interior-pictures',
              type: 'document',
              valueDestination: 'documents[8].pages[0].ballerineFileId',
              options: {
                label: 'Photo showing interior of the office',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'office_interior_picture',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 8,
                  documentPage: 0,
                },
              },
            },
          ]
        },
        {
          type: 'h3',
          name: 'financial-docs-title',
          options: {
            text: 'Financial Documents'
          }
        },
        {
          type: 'json-form',
          name: 'docs-form-2',
          options: {},
          elements: [
            {
              name: 'document-transaction-data-last-months',
              type: 'document',
              valueDestination: 'documents[9].pages[0].ballerineFileId',
              options: {
                label: 'Transaction data for the last 3-6 months',
                description: 'All electric documents must be complete and legible.',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  category: 'office_transactions_last_months',
                  type: 'business_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                },
                mappingParams: {
                  documentIndex: 9,
                  documentPage: 0,
                },
              },
            },
          ]
        },
        {
          type: 'h3',
          name: 'accuracy-title',
          options: {
            text: 'Declaration of Accuracy and Authenticity'
          }
        },
        {
          type: 'description',
          name: 'accuracy-description',
          options: {
            descriptionRaw: 'By checking the checkbox below I/we hereby declare that the information which was submitted in the attached Merchant application is truthful and genuine in regards to my/our business, legal status and registration, business practices and all other submitted information.'
          }
        },
        {
          type: 'json-form',
          name: 'confirmation-form',
          options: {},
          elements: [
            {
              type: 'checkbox',
              name: 'documents-confirmation-checkbox',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.hasConfirmed',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                  default: false,
                },
                label: 'I confirm',
                uiSchema: {
                  'ui:label': false,
                },
              }
            }
          ]
        },
        {
          name: 'controls-container',
          type: 'container',
          options: {
            align: 'right',
          },
          elements: [
            {
              name: 'next-page-button',
              type: 'json-form:button',
              options: {
                uiDefinition: {
                  classNames: ['align-right', 'padding-top-10'],
                },
                text: 'Finish',
              },
              availableOn: [
                {
                  type: 'json-schema',
                  value: validationSchema,
                },
                {
                  type: 'jmespath',
                  value: '!contains(uiState.elements.*.isLoading,`true`)'
                },
                {
                  type: 'json-logic',
                  value: {'==': [{var: 'entity.data.additionalInfo.mainRepresentative.hasConfirmed'}, true, false]}
                }
              ],
            },
          ]
        }
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      params: {
        eventName: 'NEXT',
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-logic',
            value: validationSchema,
          },
        ],
      },
    },
  ],
};
