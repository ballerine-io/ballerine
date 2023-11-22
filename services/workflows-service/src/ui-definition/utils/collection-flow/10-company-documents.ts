const validationSchema = [
  {
    documentId: 'document-certificates-of-incorporation',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-business-registration-certificate',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-corporate-tax-certificate',
    destination: 'pages[0].ballerineFileId',
  },
  {
    documentId: 'document-certificate-of-good-standing',
    destination: 'pages[0].ballerineFileId',
  },
  {
    documentId: 'document-certificate-of-directors-and-shareholders',
    destination: 'pages[0].ballerineFileId',
  },
  {
    documentId: 'document-picture-of-company-seal',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-website-pictures-domain-certificate',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-website-pictures-website-business',
    destination: 'pages[0].ballerineFileId',
    required: {
      type: 'json-logic',
      value: {
        '==': [{ var: 'entity.data.additionalInfo.store.hasActiveWebsite' }, true, false],
      },
    },
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-transaction-data-last-months',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
];

`entity.data.additionalInfo.hasConfirmed`;

const jsonValidationSchema = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      required: ['data'],
      default: {},
      properties: {
        data: {
          type: 'object',
          required: ['additionalInfo'],
          default: {},
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['hasConfirmed'],
              properties: {
                hasConfirmed: {
                  type: 'boolean',
                  default: false,
                  const: true,
                  errorMessage: {
                    const: 'This field is required.',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const CompanyDocuments = {
  type: 'page',
  number: 10,
  stateName: 'company_documents',
  name: 'Company Documents',
  pageValidation: [
    {
      type: 'destination-engine',
      value: validationSchema,
    },
    {
      type: 'json-schema',
      value: jsonValidationSchema,
    },
  ],
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
                text: 'Company Documents',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'Merchant Company Documents',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'document-certificates-of-incorporation',
                'document-business-registration-certificate',
                'document-picture-of-company-seal',
              ],
            },
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
                  id: 'document-certificates-of-incorporation',
                  category: 'proof_of_registration',
                  type: 'certificate_of_incorporation',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
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
                  id: 'document-business-registration-certificate',
                  category: 'proof_of_registration',
                  type: 'business_registration_certificate',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-corporate-tax-certificate',
              type: 'document',
              valueDestination: 'documents[2].pages[0].ballerineFileId',
              options: {
                label: 'Corporate Tax Certificate',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-corporate-tax-certificate',
                  category: 'financial_information',
                  type: 'corporate_tax_certificate',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
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
                  id: 'document-certificate-of-good-standing',
                  category: 'proof_of_good_standing',
                  type: 'certificate_of_good_standing',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
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
                  id: 'document-certificate-of-directors-and-shareholders',
                  category: 'proof_of_ownership',
                  type: 'certificate_of_directors_and_shareholders',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
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
                  id: 'document-picture-of-company-seal',
                  category: 'proof_of_identity',
                  type: 'company_seal',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
          ],
        },
        {
          type: 'h3',
          name: 'website-documents-title',
          options: {
            text: 'Website documents',
          },
        },
        {
          type: 'json-form',
          name: 'website-documents-form-p1',
          options: {
            jsonFormDefinition: {
              required: ['document-website-pictures-domain-certificate'],
            },
          },
          elements: [
            {
              name: 'document-website-pictures-domain-certificate',
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
                  id: 'document-website-pictures-domain-certificate',
                  category: 'proof_of_domain_ownership',
                  type: 'domain_purchase_record',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          name: 'website-documents-form-p2',
          options: {
            jsonFormDefinition: {
              required: ['document-website-pictures-website-business'],
            },
          },
          elements: [
            {
              name: 'document-website-pictures-website-business',
              type: 'document',
              valueDestination: 'documents[7].pages[0].ballerineFileId',
              options: {
                label: 'Business activity license for website’s business',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-website-pictures-website-business',
                  category: 'proof_of_business_compliance',
                  type: 'permitted_sales_license',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
          ],
          visibleOn: [
            {
              type: 'json-logic',
              value: {
                '==': [{ var: 'entity.data.additionalInfo.store.hasActiveWebsite' }, false, true],
              },
            },
          ],
        },
        {
          type: 'h3',
          name: 'office-pictures-title',
          options: {
            text: 'Office Pictures',
          },
        },
        {
          type: 'json-form',
          name: 'office-pictures-form',
          options: {},
          elements: [
            {
              name: 'document-office-front-door-pictures-1',
              type: 'document',
              valueDestination: 'documents[8].pages[0].ballerineFileId',
              options: {
                label: 'Front door photo showing the company name',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-office-front-door-pictures-1',
                  category: 'proof_of_location',
                  type: 'front_door_photo',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-office-interior-pictures-2',
              type: 'document',
              valueDestination: 'documents[9].pages[0].ballerineFileId',
              options: {
                label: 'Photo showing interior of the office - #1',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-office-interior-pictures-2',
                  category: 'proof_of_location',
                  type: 'interior_office_photo',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-office-interior-pictures-3',
              type: 'document',
              valueDestination: 'documents[10].pages[0].ballerineFileId',
              options: {
                label: 'Photo showing interior of the office - #2',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-office-interior-pictures-3',
                  category: 'proof_of_location',
                  type: 'interior_office_photo',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
          ],
        },
        {
          type: 'h3',
          name: 'financial-docs-title',
          options: {
            text: 'Financial Documents',
          },
        },
        {
          type: 'json-form',
          name: 'docs-form-2',
          options: {
            jsonFormDefinition: {
              required: ['document-transaction-data-last-months'],
            },
          },
          elements: [
            {
              name: 'document-transaction-data-last-months',
              type: 'document',
              valueDestination: 'documents[11].pages[0].ballerineFileId',
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
                  id: 'document-transaction-data-last-months',
                  category: 'financial_information',
                  type: 'transaction_data_last_3_6_months',
                  issuer: {
                    country: 'ZZ',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
          ],
        },
        {
          type: 'h3',
          name: 'accuracy-title',
          options: {
            text: 'Declaration of Accuracy and Authenticity',
          },
        },
        {
          type: 'description',
          name: 'accuracy-description',
          options: {
            descriptionRaw:
              'By checking the checkbox below I/we hereby declare that the information which was submitted in the attached Merchant application is truthful and genuine in regards to my/our business, legal status and registration, business practices and all other submitted information.',
          },
        },
        {
          type: 'json-form',
          name: 'confirmation-form',
          options: {},
          elements: [
            {
              type: 'checkbox',
              name: 'documents-confirmation-checkbox',
              valueDestination: 'entity.data.additionalInfo.hasConfirmed',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                  default: false,
                },
                label: 'I confirm',
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'description',
          options: {
            descriptionRaw:
              "By clicking 'Next', an email containing an identity verification link will be sent to the shareholders listed.",
          },
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
              type: 'submit-button',
              options: {
                uiDefinition: {
                  classNames: ['align-right', 'padding-top-10'],
                },
                text: 'Finish',
              },
              availableOn: [
                {
                  type: 'destination-engine',
                  value: validationSchema,
                },
                {
                  type: 'jmespath',
                  value: '!contains(uiState.elements.*.isLoading,`true`)',
                },
                {
                  type: 'json-logic',
                  value: {
                    '==': [{ var: 'entity.data.additionalInfo.hasConfirmed' }, true, false],
                  },
                },
                {
                  type: 'json-logic',
                  value: { '!==': [{ var: 'uiState.isLoading' }, true, false] },
                },
              ],
            },
          ],
        },
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
            type: 'destination-engine',
            value: validationSchema,
          },
          {
            type: 'json-logic',
            value: {
              '==': [{ var: 'entity.data.additionalInfo.hasConfirmed' }, true, false],
            },
          },
        ],
      },
    },
    {
      type: 'definitionPlugin',
      params: { pluginName: 'sync_workflow_runtime', debounce: 50 },
      dispatchOn: {
        uiEvents: [
          { event: 'onChange', uiElementName: 'document-certificates-of-incorporation' },
          { event: 'onChange', uiElementName: 'document-business-registration-certificate' },
          { event: 'onChange', uiElementName: 'document-picture-of-company-seal' },
          { event: 'onChange', uiElementName: 'document-corporate-tax-certificate' },
          { event: 'onChange', uiElementName: 'document-certificate-of-good-standing' },
          {
            event: 'onChange',
            uiElementName: 'document-certificate-of-directors-and-shareholders',
          },
          { event: 'onChange', uiElementName: 'document-picture-of-company-seal' },
          { event: 'onChange', uiElementName: 'document-website-pictures-domain-certificate' },
          { event: 'onChange', uiElementName: 'document-website-pictures-website-business' },
          { event: 'onChange', uiElementName: 'document-office-front-door-pictures-1' },
          { event: 'onChange', uiElementName: 'document-office-interior-pictures-2' },
          { event: 'onChange', uiElementName: 'document-office-interior-pictures-3' },
          { event: 'onChange', uiElementName: 'document-transaction-data-last-months' },
        ],
      },
    },
  ],
};
