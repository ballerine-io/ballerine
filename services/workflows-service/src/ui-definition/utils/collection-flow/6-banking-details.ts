import { currencyCodes } from '../schema-utils/currency-codes';

const availableOnButtonRule = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          required: ['additionalInfo'],
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['bank'],
              properties: {
                bank: {
                  type: 'object',
                  required: [
                    'holderName',
                    'holderFullAddress',
                    'accountNumber',
                    'iban',
                    'swiftCode',
                    'bankName',
                    'bankAddress',
                    'subBranch',
                  ],
                  properties: {
                    holderName: {
                      type: 'string',
                      minLength: 5,
                    },
                    holderFullAddress: {
                      type: 'string',
                      minLength: 8,
                    },
                    accountNumber: {
                      type: 'string',
                      minLength: 6,
                      maxLength: 15,
                    },
                    iban: {
                      type: 'string',
                      minLength: 15,
                    },
                    swiftCode: {
                      type: 'string',
                      minLength: 8,
                    },
                    bankName: {
                      type: 'string',
                      minLength: 3,
                    },
                    bankAddress: {
                      type: 'string',
                      minLength: 10,
                    },
                    subBranch: {
                      type: 'string',
                      pattern: '^[0-9]+$',
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
export const BankingDetailsPage = {
  type: 'page',
  number: 6,
  stateName: 'banking_details',
  name: 'Banking Details',
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
                text: 'Banking Details',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'card-holder-name-input',
                'resident-address-input',
                'account-number-input',
                'iban-input',
                'swift-code-input',
                'bank-name-input',
                'bank-address-input',
                'account-currency-input',
              ],
            },
          },
          elements: [
            {
              name: 'card-holder-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Cardholder Name',
                hint: 'John W. Doe',
              },
            },
            {
              name: 'resident-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderFullAddress',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Resident Address',
                hint: 'Fla 5A, Tower 2, The Peak, 123 Queens Road, Hong Kong',
              },
            },
            {
              name: 'account-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.accountNumber',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Account Number',
                hint: '0123456789',
              },
            },
            {
              name: 'iban-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.iban',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'IBAN',
                hint: 'HK00HKB01234567890123',
              },
            },
            {
              name: 'swift-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.swiftCode',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Swift Code',
                hint: 'BBBBCCDDXXX',
              },
            },
            {
              name: 'bank-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Bank Name',
                hint: 'Honk Kong Bank',
              },
            },
            {
              name: 'bank-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankAddress',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Bank Address',
                hint: "456 King's Road, North Point, Hong Kong",
              },
            },
            {
              name: 'bank-sub-branch-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.subBranch',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Sub-Branch Number',
                hint: '0012',
              },
            },
            {
              name: 'account-currency-input',
              type: 'currency-picker',
              valueDestination: 'entity.data.additionalInfo.bank.currency',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                  oneOf: [
                    { title: '', const: '' },
                    ...currencyCodes.map(code => ({
                      title: code.code.toUpperCase(),
                      const: code.code,
                    })),
                  ],
                },
                label: 'Account Currency',
                hint: 'CNY',
              },
            },
          ],
        },
        {
          name: 'previous-page-button',
          type: 'json-form:button',
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'PREVIOUS',
          },
        },
        {
          name: 'next-page-button',
          type: 'json-form:button',
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'Continue',
          },
          availableOn: [
            {
              type: 'json-schema',
              value: availableOnButtonRule,
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
        eventName: 'PREVIOUS',
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }],
      },
    },
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
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
