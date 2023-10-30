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
                        minLength: 'Holder name should be at least 5 characters long.',
                        maxLength: 'Holder name should not exceed 50 characters.',
                      },
                    },
                    holderFullAddress: {
                      type: 'string',
                      minLength: 10,
                      maxLength: 200,
                      errorMessage: {
                        minLength: 'Holder full address should be at least 10 characters long.',
                        maxLength: 'Holder full address should not exceed 200 characters.',
                      },
                    },
                    accountNumber: {
                      type: 'string',
                      minLength: 6,
                      maxLength: 34,
                      errorMessage: {
                        minLength: 'Account number should be at least 6 characters long.',
                        maxLength: 'Account number should not exceed 34 characters.',
                      },
                    },
                    iban: {
                      type: 'string',
                      minLength: 15,
                      maxLength: 34,
                      errorMessage: {
                        minLength: 'IBAN should be at least 15 characters long.',
                        maxLength: 'IBAN should not exceed 34 characters.',
                      },
                    },
                    swiftCode: {
                      type: 'string',
                      minLength: 8,
                      maxLength: 11,
                      errorMessage: {
                        minLength: 'SWIFT code should be at least 8 characters long.',
                        maxLength: 'SWIFT code should not exceed 11 characters.',
                      },
                    },
                    routeNumber: {
                      type: 'number',
                      minLength: 8,
                      maxLength: 10,
                      errorMessage: {
                        minLength: 'Route Number should be at least 8 characters long.',
                        maxLength: 'Route Number should not exceed 10 characters.',
                      },
                    },
                    bankName: {
                      type: 'string',
                      minLength: 3,
                      maxLength: 100,
                      errorMessage: {
                        minLength: 'Bank name should be at least 3 characters long.',
                        maxLength: 'Bank name should not exceed 100 characters.',
                      },
                    },
                    bankCode: {
                      type: 'number',
                      minLength: 2,
                      maxLength: 13,
                      errorMessage: {
                        minLength: 'Bank Code should be at least 2 characters long.',
                        maxLength: 'Bank Code should not exceed 13 characters.',
                      },
                    },
                    bankAddress: {
                      type: 'string',
                      minLength: 10,
                      maxLength: 200,
                      errorMessage: {
                        minLength: 'Bank address should be at least 10 characters long.',
                        maxLength: 'Bank address should not exceed 200 characters.',
                      },
                    },
                    subBranch: {
                      type: 'string',
                      pattern: '^[0-9]+$',
                      errorMessage: {
                        pattern: 'Sub-branch should contain only numbers.',
                      },
                    },
                    currency: {
                      type: 'string',
                      errorMessage: {
                        minLength: 'Account currency is required',
                      },
                    },
                  },
                  errorMessage: {
                    required: {
                      holderName: 'Holder name is required.',
                      holderFullAddress: 'Holder full address is required.',
                      accountNumber: 'Account number is required.',
                      swiftCode: 'SWIFT code is required.',
                      bankName: 'Bank name is required.',
                      bankAddress: 'Bank address is required.',
                      currency: 'Account currency is required',
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
  name: 'Banking Details',
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
                },
                label: 'SWIFT Code',
                hint: 'BBBBCCDDXXX',
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
                label: 'Route Number',
                hint: '123456789',
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
                label: 'Bank Name',
                hint: 'Honk Kong Bank',
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
                label: 'Bank Code',
                hint: '1234',
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
                  oneOf: [
                    { title: '', const: '' },
                    ...currencyCodes.map(code => ({
                      title: code.code.toUpperCase(),
                      const: code.code,
                    })),
                  ],
                },
                label: 'Account Currency',
                hint: 'Choose',
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
