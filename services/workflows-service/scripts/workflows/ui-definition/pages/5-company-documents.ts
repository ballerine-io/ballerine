const validationSchema = [
  {
    documentId: 'document-bank-statement',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-company-structure',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-certificate-of-registration',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
  {
    documentId: 'document-proof-of-address',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'This field is required',
  },
];

export const CompanyDocumentsPage = {
  type: 'page',
  number: 7,
  stateName: 'company_documents',
  name: 'Company Documents',
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
                label: 'Bank Statement',
                description: 'Not older than 6 months.',
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
                label: 'Company structure (directors & legal representatives)',
                description: 'Notarized document',
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
                label: 'Certificate of Registration',
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
                label: 'Company Utility Bill as Proof of Address',
                description: 'Not older than 6 months.',
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
                    '==': [
                      { var: 'entity.data.additionalInfo.hasConfirmed' },
                      true,
                      false,
                    ],
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
