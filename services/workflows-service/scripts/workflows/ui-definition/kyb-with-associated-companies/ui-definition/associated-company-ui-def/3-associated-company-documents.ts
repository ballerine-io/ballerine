const validationSchema = [
  {
    documentId: 'certificate-of-incorporation',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'errorMessage.error.requiredField',
  },
  {
    documentId: 'business-utility-bill',
    destination: 'pages[0].ballerineFileId',
    required: true,
    errorMessage: 'errorMessage.error.requiredField',
  },
];

export const AssociatedCompanyDocumentsPage = {
  type: 'page',
  number: 3,
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
              required: ['document-certificate-of-incorporation', 'document-business-utility-bill'],
            },
          },
          elements: [
            {
              name: 'document-certificate-of-incorporation',
              type: 'document',
              valueDestination: 'documents[0].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.certificateOfIncorporation.label',
                description: 'text.documents.certificateOfIncorporation.description',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'certificate-of-incorporation',
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
              name: 'document-business-utility-bill',
              type: 'document',
              valueDestination: 'documents[1].pages[0].ballerineFileId',
              options: {
                label: 'text.documents.businessUtilityBill.label',
                description: 'text.documents.businessUtilityBill.description',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DocumentInput',
                },
                documentData: {
                  id: 'business-utility-bill',
                  category: 'proof_of_ownership',
                  type: 'business_utility_bill',
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
            uiElementName: 'document-certificate-of-incorporation',
          },
          {
            event: 'onChange',
            uiElementName: 'document-business-utility-bill',
          },
        ],
      },
    },
  ],
};
