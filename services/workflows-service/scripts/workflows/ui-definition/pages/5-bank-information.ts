import { currencyCodes } from '../../utils/currency-codes';

const validationSchema = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      default: {},
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          default: {},
          required: ['additionalInfo'],
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['bankInformation'],
              default: {},
              properties: {
                bankInformation: {
                  type: 'object',
                  default: {},
                  errorMessage: {
                    required: {
                      country: 'Bank Country is required.',
                      name: 'Bank Name is required',
                      holderName: 'Account Holder Name is required.',
                      accountNumber: 'Account Number is required.',
                      currencyCode: 'Account Currency is required.',
                    },
                  },
                  required: ['country', 'name', 'holderName', 'accountNumber', 'currencyCode'],
                  properties: {
                    country: {
                      type: 'string',
                    },
                    name: {
                      type: 'string',
                    },
                    holderName: {
                      type: 'string',
                    },
                    accountNumber: {
                      type: 'string',
                    },
                    currencyCode: {
                      type: 'string',
                    },
                  },
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

export const BankInformationPage = {
  type: 'page',
  number: 5,
  stateName: 'bank_information',
  name: 'Bank Information',
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
                text: 'Bank Information',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'bank-country-input',
                'bank-name-input',
                'account-holder-name-input',
                'account-number-input',
                'account-currency-input',
              ],
            },
          },
          elements: [
            {
              name: 'bank-country-input',
              type: 'dropdown',
              valueDestination: 'entity.data.additionalInfo.bankInformation.country',
              options: {
                label: 'Bank Country',
                hint: 'United Kingdom',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                },
              },
            },
            {
              name: 'bank-name-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.bankInformation.name',
              options: {
                label: 'Bank Name',
                hint: 'Barclays',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'account-holder-name-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.bankInformation.holderName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'Account Holder Name',
                hint: 'OpenAI Technologies, Inc.',
              },
            },
            {
              name: 'account-number-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.bankInformation.accountNumber',
              options: {
                label: 'Account Number',
                hint: '20456720',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'account-currency-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.bankInformation.currencyCode',
              options: {
                label: 'Account Currency',
                hint: 'GBP',
                jsonFormDefinition: {
                  type: 'string',
                  oneOf: currencyCodes.map(code => ({
                    const: code.code,
                    title: code.code,
                  })),
                },
              },
            },
          ],
        },
        {
          name: 'contact-controls-container',
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
