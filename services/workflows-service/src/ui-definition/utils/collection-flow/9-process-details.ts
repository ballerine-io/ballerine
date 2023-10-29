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
                          monthlySalesVolume: 'Monthly Sales Volume is required.',
                          monthlyTransactions: 'Monthly Number Of Transactions is required.',
                          averageTicketAmount: 'Average Ticket Amount is required.',
                          mainCategory: 'Customer Category is required.',
                          businessModel: 'Website Business Model is required.',
                        },
                      },
                      properties: {
                        monthlySalesVolume: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'Monthly Sales Volume must be positive.',
                        },
                        monthlyTransactions: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'Monthly Number Of Transactions must be positive.',
                        },
                        averageTicketAmount: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'Average Ticket Amount must be positive.',
                        },
                        mainCategory: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 1,
                          errorMessage: 'Customer Category is required.',
                        },
                        businessModel: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 1,
                          errorMessage: 'Business Model is required.',
                        },
                        isSpikeInSales: { type: 'boolean', default: false },
                        spikeSalesAverageVolume: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'Spike Sales Volume must be positive.',
                        },
                        spikeTransactionNumber: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'Spike Transaction Number must be positive.',
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
                            monthlySalesVolume: 'Monthly Sales Volume is required.',
                            monthlyTransactions: 'Monthly Number Of Transactions is required.',
                            averageTicketAmount: 'Average Ticket Amount is required.',
                            spikeSalesAverageVolume: 'Spike Sales Average Volume is required.',
                            spikeTransactionNumber: 'Spike Transaction Number is required.',
                            mainCategory: 'Customer Category is required.',
                            businessModel: 'Website Business Model is required.',
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
  name: 'Processing Details',
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
                text: 'Processing Details',
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
                label: 'Monthly Sales Volume (CNY)',
                hint: '5,000,000',
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
                label: 'Monthly Number Of Transactions',
                hint: '500',
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
                label: 'Est. Monthly Sales Volume through ClipsPay (CNY)',
                hint: '400,000',
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
                label: 'Est. Monthly Number of Transactions through ClipsPay',
                hint: '150',
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
                label: 'Average Ticket Amount (CNY)',
                hint: '25',
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
                label: 'Minimum Ticket Amount (CNY)',
                hint: '300',
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
                label: 'Maximum Ticket Amount (CNY)',
                hint: '2000',
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
                label: 'There are spikes in transactions (e.g., promotions, events, etc.)',
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
              required: ['spike-sales-volume-input', 'volume-in-region'],
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
                label: 'Spike Sales Average Volume',
                hint: '150,000',
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
                label: 'Spike Transaction Number',
                hint: '200',
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
              required: [],
            },
          },
          elements: [
            {
              name: 'volume-in-region',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.volumeInRegion',
              options: {
                label: 'Split of volume by regions in % (divided by comma)',
                hint: 'Asia 70%, Europe 30%',
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
            text: 'Customer Category',
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
                      title: 'B2C',
                      value: 'B2C',
                    },
                    {
                      title: 'B2B',
                      value: 'B2B',
                    },
                    {
                      title: 'C2C',
                      value: 'C2C',
                    },
                    {
                      title: 'Other',
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
                label: 'Main Category',
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
            text: 'Website Business Model',
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
                      title: 'Membership',
                      value: 'Membership',
                    },
                    {
                      title: 'Direct Purchase',
                      value: 'Direct Purchase',
                    },
                    {
                      title: 'Other',
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
                label: 'Business Model',
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
