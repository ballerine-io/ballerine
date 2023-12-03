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
              required: ['store'],
              properties: {
                store: {
                  type: 'object',
                  required: ['processingDetails'],
                  default: {},
                  properties: {
                    processingDetails: {
                      type: 'object',
                      default: {},
                      required: [
                        'monthlySalesVolume',
                        'monthlyTransactions',
                        'averageTicketAmount',
                        'mainCategory',
                        'businessModel',
                      ],
                      errorMessage: {
                        required: {
                          monthlySalesVolume: 'errorMessage.required.monthlySalesVolume',
                          monthlyTransactions: 'errorMessage.required.monthlyTransactions',
                          averageTicketAmount: 'errorMessage.required.averageTicketAmount',
                          mainCategory: 'errorMessage.required.mainCategory',
                          businessModel: 'errorMessage.required.businessModel',
                        },
                      },
                      properties: {
                        monthlySalesVolume: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.monthlySalesVolume',
                        },
                        monthlyTransactions: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.monthlyTransactions',
                        },
                        averageTicketAmount: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.averageTicketAmount',
                        },
                        mainCategory: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 1,
                          errorMessage: 'errorMessage.error.mainCategory',
                        },
                        businessModel: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 1,
                          errorMessage: 'errorMessage.error.businessModel',
                        },
                        isSpikeInSales: { type: 'boolean', default: false },
                        spikeSalesAverageVolume: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.spikeSalesAverageVolume',
                        },
                        spikeTransactionNumber: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.spikeTransactionNumber',
                        },
                      },
                      if: {
                        properties: {
                          isSpikeInSales: {
                            const: true,
                          },
                        },
                      },
                      then: {
                        required: [
                          'monthlySalesVolume',
                          'monthlyTransactions',
                          'averageTicketAmount',
                          'isSpikeInSales',
                          'volumeInRegion',
                          'spikeTransactionNumber',
                          'mainCategory',
                          'businessModel',
                          'spikeSalesAverageVolume',
                        ],
                        errorMessage: {
                          required: {
                            monthlySalesVolume: 'errorMessage.required.monthlySalesVolume',
                            monthlyTransactions: 'errorMessage.required.monthlyTransactions',
                            averageTicketAmount: 'errorMessage.required.averageTicketAmount',
                            spikeSalesAverageVolume:
                              'errorMessage.required.spikeSalesAverageVolume',
                            spikeTransactionNumber: 'errorMessage.required.spikeTransactionNumber',
                            mainCategory: 'errorMessage.required.mainCategory',
                            businessModel: 'errorMessage.required.businessModel',
                            volumeInRegion: 'errorMessage.required.volumeInRegion',
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
      },
    },
  },
};

const isSpikeInSaleVisibility = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales' }, true],
};

const isCustomBusinessModel = {
  in: ['Other', { var: 'entity.data.additionalInfo.store.processingDetails.businessModel' }],
};
const isCustomMainCateogry = {
  in: ['Other', { var: 'entity.data.additionalInfo.store.processingDetails.mainCategory' }],
};

export const ProcessingDetails = {
  type: 'page',
  number: 9,
  stateName: 'processing_details',
  name: 'text.processingDetails',
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
                text: 'text.processingDetails',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'monthly-sales-volume-input',
                'monthly-number-transactions-input',
                'average-ticket-sales-input',
              ],
            },
          },
          elements: [
            {
              name: 'monthly-sales-volume-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.monthlySalesVolume',
              options: {
                label: 'text.monthlySalesVolume.label',
                hint: 'text.monthlySalesVolume.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'monthly-number-transactions-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.monthlyTransactions',
              options: {
                label: 'text.monthlyTransactions.label',
                hint: 'text.monthlyTransactions.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'est-monthly-sales-volume-clipspay-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.estimatedMonthlySalesClipsPay',
              options: {
                label: 'text.estimatedMonthlySalesClipsPay.label',
                hint: 'text.estimatedMonthlySalesClipsPay.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'est-monthly-transactions-clipspay-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.estimatedMonthlyTransactionsClipsPay',
              options: {
                label: 'text.estimatedMonthlyTransactionsClipsPay.label',
                hint: 'text.estimatedMonthlyTransactionsClipsPay.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'average-ticket-sales-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.averageTicketAmount',
              options: {
                label: 'text.averageTicketAmount.label',
                hint: 'text.averageTicketAmount.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'minimum-ticket-sales-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.minimumTicketAmount',
              options: {
                label: 'text.minimumTicketAmount.label',
                hint: 'text.minimumTicketAmount.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'maximum-ticket-sales-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.maximumTicketAmount',
              options: {
                label: 'text.maximumTicketAmount.label',
                hint: 'text.maximumTicketAmount.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'spike-in-transactions-input',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales',
              options: {
                label: 'text.isSpikeInSales.label',
                jsonFormDefinition: {
                  type: 'boolean',
                },
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['spike-sales-volume-input', 'spike-sales-transaction-number-input'],
            },
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: isSpikeInSaleVisibility,
            },
          ],
          elements: [
            {
              name: 'spike-sales-volume-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.spikeSalesAverageVolume',
              options: {
                label: 'text.spikeSalesAverageVolume.label',
                hint: 'text.spikeSalesAverageVolume.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'spike-sales-transaction-number-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.spikeTransactionNumber',
              options: {
                label: 'text.spikeTransactionNumber.label',
                hint: 'text.spikeTransactionNumber.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['volume-in-region'],
            },
          },
          elements: [
            {
              name: 'volume-in-region',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.volumeInRegion',
              options: {
                label: 'text.volumeInRegion.label',
                hint: 'text.volumeInRegion.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
          ],
        },
        {
          type: 'h3',
          options: {
            text: 'text.customerCategory',
          },
        },
        {
          type: 'json-form',
          options: {},
          elements: [
            {
              name: 'main-category-input',
              type: 'json-form:select',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.mainCategory',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'Multiselect',
                  options: [
                    {
                      title: 'text.b2c',
                      value: 'B2C',
                    },
                    {
                      title: 'text.b2b',
                      value: 'B2B',
                    },
                    {
                      title: 'text.c2c',
                      value: 'C2C',
                    },
                    {
                      title: 'text.other',
                      value: 'Other',
                    },
                  ],
                },
                variants: {
                  chip: {
                    wrapper: 'secondary',
                    label: 'primary',
                  },
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['other-main-category-input'],
            },
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: isCustomMainCateogry,
            },
          ],
          elements: [
            {
              name: 'other-main-category-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.otherMainCategory',
              options: {
                label: 'text.mainCategory',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
          ],
        },
        {
          type: 'h3',
          options: {
            text: 'text.websiteBusinessModel',
          },
        },
        {
          type: 'json-form',
          options: {},
          elements: [
            {
              name: 'business-model-input',
              type: 'json-form:select',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.businessModel',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CheckboxList',
                  options: [
                    {
                      title: 'text.membership',
                      value: 'Membership',
                    },
                    {
                      title: 'text.directPurchase',
                      value: 'Direct Purchase',
                    },
                    {
                      title: 'text.other',
                      value: 'Other',
                    },
                  ],
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['other-business-model-input'],
            },
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: isCustomBusinessModel,
            },
          ],
          elements: [
            {
              name: 'other-business-model-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.otherBusinessModel',
              options: {
                label: 'text.businessModel',
                jsonFormDefinition: {
                  type: 'string',
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
            value: validationSchema,
          },
        ],
      },
    },
  ],
};
