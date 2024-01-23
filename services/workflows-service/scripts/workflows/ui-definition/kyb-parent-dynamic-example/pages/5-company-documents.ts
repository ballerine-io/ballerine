const validationSchema = [
  {
    documentId: 'document-bank-statement',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'text.documents.bankStatement.error',
  },
  {
    documentId: 'document-company-structure',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'text.documents.companyStructure.error',
  },
  {
    documentId: 'document-certificate-of-registration',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'text.documents.certificateOfRegistration.error',
  },
  {
    documentId: 'document-proof-of-address',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'text.documents.proofOfAddress.error',
  },
];

export const CompanyDocumentsPage = {
  type: 'page',
  number: 5,
  stateName: 'company_documents',
  name: 'text.companyDocuments',
  pageValidation: [
    {
      type: 'destination-engine',
      value: validationSchema,
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
                text: 'text.companyDocuments',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'text.merchantCompanyDocuments',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'document-bank-statement',
                'document-company-structure',
                'document-certificate-of-registration',
                'document-proof-of-address',
              ],
            },
          },
          elements: [
            {
              name: 'document-bank-statement',
              type: 'document',
              valueDestination: 'documents[0].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.bankStatement.label',
                description: 'text.documents.bankStatement.description',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-bank-statement',
                  category: 'proof_of_address',
                  type: 'bank_statement',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-company-structure',
              type: 'document',
              valueDestination: 'documents[1].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.companyStructure.label',
                description: 'text.documents.companyStructure.description',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-company-structure',
                  category: 'proof_of_employment',
                  type: 'payslip',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-certificate-of-registration',
              type: 'document',
              valueDestination: 'documents[2].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.certificateOfRegistration.label',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-certificate-of-registration',
                  category: 'proof_of_registration',
                  type: 'certificate_of_registration',
                  issuer: {
                    country: 'GH',
                  },
                  version: '1',
                  issuingVersion: 1,
                  properties: {},
                },
              },
            },
            {
              name: 'document-proof-of-address',
              type: 'document',
              valueDestination: 'documents[3].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.proofOfAddress.label',
                description: 'text.documents.proofOfAddress.description',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'document-proof-of-address',
                  category: 'proof_of_address',
                  type: 'water_bill',
                  issuer: {
                    country: 'GH',
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
          type: 'description',
          name: 'accuracy-description',
          options: {
            descriptionRaw: 'text.emailDescription',
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
                text: 'text.finish',
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
        ],
      },
    },
    {
      type: 'definitionPlugin',
      params: { pluginName: 'sync_workflow_runtime', debounce: 50 },
      dispatchOn: {
        uiEvents: [
          {
            event: 'onChange',
            uiElementName: 'document-bank-statement',
          },
          {
            event: 'onChange',
            uiElementName: 'document-company-structure',
          },
          {
            event: 'onChange',
            uiElementName: 'document-certificate-of-registration',
          },
          {
            event: 'onChange',
            uiElementName: 'document-proof-of-address',
          },
        ],
      },
    },
  ],
};
