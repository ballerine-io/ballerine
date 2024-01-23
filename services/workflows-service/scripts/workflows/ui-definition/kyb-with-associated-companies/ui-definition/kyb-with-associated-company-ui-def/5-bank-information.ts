import { currencyCodes } from '../../../../../../src/ui-definition/utils/schema-utils/currency-codes';

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
                      country: 'errorMessage.required.bankCountry',
                      name: 'errorMessage.required.bankName',
                      holderName: 'errorMessage.required.holderName',
                      accountNumber: 'errorMessage.required.accountNumber',
                      currencyCode: 'errorMessage.required.currency',
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
  name: 'text.bankInformation',
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
                text: 'text.bankInformation',
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
                label: 'text.bankCountry.label',
                hint: 'text.bankCountry.hint',
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
                label: 'text.bankName.label',
                hint: 'text.bankName.hint',
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
                label: 'text.accountHolderName.label',
                hint: 'text.accountHolderName.hint',
              },
            },
            {
              name: 'account-number-input',
              type: 'text-field',
              valueDestination: 'entity.data.additionalInfo.bankInformation.accountNumber',
              options: {
                label: 'text.accountNumber.label',
                hint: 'text.accountNumber.hint',
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
                label: 'text.currency.label',
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
                text: 'text.continue',
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
