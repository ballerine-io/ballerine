import { singleUrlPattern } from '../../../../src/ui-definition/utils/schema-utils/regex';

const validationSchema = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          required: ['additionalInfo'],
          properties: {
            additionalInfo: {
              type: 'object',
              default: {},
              required: [
                'industry',
                'businessModel',
                'companyWebsite',
                'annualVolume',
                'transactionValue',
              ],
              properties: {
                industry: {
                  type: 'string',
                },
                businessModel: {
                  type: 'string',
                },
                companyWebsite: {
                  type: 'string',
                  pattern: singleUrlPattern,
                  errorMessage: {
                    pattern: 'Company website must be a valid url.',
                  },
                },
                annualVolume: {
                  type: 'number',
                },
                transactionValue: {
                  type: 'number',
                },
              },
              errorMessage: {
                required: {
                  industry: 'Industry is required.',
                  businessModel: 'Business Model is required.',
                  companyWebsite: 'Company Website is required.',
                  annualVolume: 'Annual volume is required.',
                  transactionValue: 'Transaction Value is required.',
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};
export const CompanyActivityPage = {
  type: 'page',
  number: 4,
  stateName: 'company_activity',
  name: 'Company Activity',
  pageValidation: [
    {
      type: 'json-schema',
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
                text: 'Company Activity',
              },
            },
          ],
        },
        {
          name: 'company-activity-inputs-group',
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'industry-input',
                'business-model-input',
                'company-website-input',
                'annual-volume-amount-input',
                'transaction-value-input',
              ],
            },
          },
          elements: [
            {
              name: 'industry-input',
              type: 'dropdown',
              valueDestination: 'entity.data.additionalInfo.industry',
              options: {
                label: 'Industry',
                hint: 'Food & Beverages',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'IndustriesPicker',
                },
              },
            },
            {
              name: 'business-model-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.businessModel',
              options: {
                label: 'Business Model',
                hint: 'Please provide as much Information as possible about your products or services.',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:widget': 'textarea',
                },
              },
            },
            {
              name: 'company-website-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.companyWebsite',
              options: {
                label: 'Company Website',
                hint: 'www.example.co.uk',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'annual-volume-amount-input',
              type: 'number-field',
              valueDestination: 'entity.data.additionalInfo.annualVolume',
              options: {
                label: 'Estimate Annual Volume (USD)',
                hint: '€500,000',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'transaction-value-input',
              type: 'number-field',
              valueDestination: 'entity.data.additionalInfo.transactionValue',
              options: {
                label: 'Average Transaction Value (USD)',
                hint: '€10,00',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
          ],
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
                text: 'Continue',
              },
              availableOn: [
                {
                  type: 'json-schema',
                  value: validationSchema,
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
            type: 'json-schema',
            value: validationSchema,
          },
        ],
      },
    },
  ],
};
