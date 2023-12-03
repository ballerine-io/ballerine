import { currencyCodes } from '../schema-utils/currency-codes';

const validationSchema = {
  type: 'object',
  required: ['entity'],
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
              default: {},
              properties: {
                bank: {
                  type: 'object',
                  default: {},
                  required: [
                    'holderName',
                    'holderFullAddress',
                    'accountNumber',
                    'swiftCode',
                    'bankName',
                    'bankAddress',
                    'currency',
                  ],
                  properties: {
                    holderName: {
                      type: 'string',
                      minLength: 5,
                      maxLength: 50,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.holderName',
                        maxLength: 'errorMessage.maxLength.holderName',
                      },
                    },
                    holderFullAddress: {
                      type: 'string',
                      minLength: 10,
                      maxLength: 200,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.holderFullAddress',
                        maxLength: 'errorMessage.maxLength.holderFullAddress',
                      },
                    },
                    accountNumber: {
                      type: 'string',
                      minLength: 6,
                      maxLength: 34,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.accountNumber',
                        maxLength: 'errorMessage.maxLength.accountNumber',
                      },
                    },
                    iban: {
                      type: 'string',
                      minLength: 15,
                      maxLength: 34,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.iban',
                        maxLength: 'errorMessage.maxLength.iban',
                      },
                    },
                    swiftCode: {
                      type: 'string',
                      minLength: 8,
                      maxLength: 11,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.swiftCode',
                        maxLength: 'errorMessage.maxLength.swiftCode',
                      },
                    },
                    routeNumber: {
                      type: 'number',
                      minLength: 8,
                      maxLength: 10,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.routeNumber',
                        maxLength: 'errorMessage.maxLength.routeNumber',
                      },
                    },
                    bankName: {
                      type: 'string',
                      minLength: 3,
                      maxLength: 100,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.bankName',
                        maxLength: 'errorMessage.maxLength.bankName',
                      },
                    },
                    bankCode: {
                      type: 'number',
                      minLength: 2,
                      maxLength: 13,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.bankCode',
                        maxLength: 'errorMessage.maxLength.bankCode',
                      },
                    },
                    bankAddress: {
                      type: 'string',
                      minLength: 10,
                      maxLength: 200,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.bankAddress',
                        maxLength: 'errorMessage.maxLength.bankAddress',
                      },
                    },
                    subBranch: {
                      type: 'string',
                      pattern: '^[0-9]+$',
                      errorMessage: {
                        pattern: 'errorMessage.pattern.subBranch',
                      },
                    },
                    currency: {
                      type: 'string',
                      errorMessage: {
                        minLength: 'errorMessage.minLength.currency',
                      },
                    },
                  },
                  errorMessage: {
                    required: {
                      holderName: 'errorMessage.required.holderName',
                      holderFullAddress: 'errorMessage.required.holderFullAddress',
                      accountNumber: 'errorMessage.required.accountNumber',
                      swiftCode: 'errorMessage.required.swiftCode',
                      bankName: 'errorMessage.required.bankName',
                      bankAddress: 'errorMessage.required.bankAddress',
                      currency: 'errorMessage.required.currency',
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
};
export const BankingDetailsPage = {
  type: 'page',
  number: 6,
  stateName: 'banking_details',
  name: 'text.bankingDetails',
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
                text: 'text.bankingDetails',
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
                },
                label: 'text.holderName.label',
                hint: 'text.holderName.hint',
              },
            },
            {
              name: 'resident-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.holderFullAddress',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.holderFullAddress.label',
                hint: 'text.holderFullAddress.hint',
              },
            },
            {
              name: 'account-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.accountNumber',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.accountNumber.label',
                hint: 'text.accountNumber.hint',
              },
            },
            {
              name: 'iban-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.iban',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.iban.label',
                hint: 'text.iban.hint',
              },
            },
            {
              name: 'swift-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.swiftCode',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.swiftCode.label',
                hint: 'text.swiftCode.hint',
              },
            },
            {
              name: 'route-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.routeNumber',
              options: {
                jsonFormDefinition: {
                  type: 'integer',
                },
                label: 'text.routeNumber.label',
                hint: 'text.routeNumber.hint',
              },
            },
            {
              name: 'bank-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.bankName.label',
                hint: 'text.bankName.hint',
              },
            },
            {
              name: 'bank-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankCode',
              options: {
                jsonFormDefinition: {
                  type: 'integer',
                },
                label: 'text.bankCode.label',
                hint: 'text.bankCode.hint',
              },
            },
            {
              name: 'bank-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.bankAddress',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.bankAddress.label',
                hint: 'text.bankAddress.hint',
              },
            },
            {
              name: 'bank-sub-branch-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.bank.subBranch',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.subBranch.label',
                hint: 'text.subBranch.hint',
              },
            },
            {
              name: 'account-currency-input',
              type: 'currency-picker',
              valueDestination: 'entity.data.additionalInfo.bank.currency',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  oneOf: [
                    { title: '', const: '' },
                    ...currencyCodes.map(code => ({
                      title: code.code.toUpperCase(),
                      const: code.code,
                    })),
                  ],
                },
                label: 'text.currency.label',
                hint: 'text.choose',
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
