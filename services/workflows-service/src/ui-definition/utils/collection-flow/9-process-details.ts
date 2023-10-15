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
                  properties: {
                    processingDetails: {
                      type: 'object',
                      required: [
                        'monthlySalesVolume',
                        'monthlyTransactions',
                        'averageTicketAmount',
                      ],
                      // errorMessage: {
                      //   minLength: {
                      //     monthlySalesVolume: 'Monthly Sales Volume is required.',
                      //     monthlyTransactions: 'Monthly Transactions are required.',
                      //     averageTicketAmount: 'Average Ticket Amount is required.',
                      //     mainCategory: 'Main Category is required.',
                      //     businessModel: 'Business Model is required.',
                      //   }
                      // },
                      // errorMessage: {
                      //   minLength: {
                      //     monthlySalesVolume: 'Monthly Sales Volume is required.',
                      //     monthlyTransactions: 'Monthly Transactions are required.',
                      //     averageTicketAmount: 'Average Ticket Amount is required.',
                      //     mainCategory: 'Main Category is required.',
                      //     businessModel: 'Business Model is required.',
                      //     isSpikeInSales: 'Is Spike In Sales is required.',
                      //     spikeSalesAverageVolume: 'Spike Sales Average Volume is required.',
                      //     spikeTransactionNumber: 'Spike Transaction Number is required.',
                      //     spikeOfVolumeInRegion: 'Spike Of Volume In Region is required.',
                      //   }
                      // },
                      properties: {
                        monthlySalesVolume: { type: 'number', minimum: 1 },
                        monthlyTransactions: { type: 'number', minimum: 1 },
                        averageTicketAmount: { type: 'number', minimum: 1 },
                        mainCategory: { type: 'array', items: { type: 'string' }, default: [] },
                        businessModel: {
                          type: 'array',
                          items: {
                            type: 'string',
                          },
                          default: [],
                        },
                        isSpikeInSales: { type: 'boolean', default: false },
                        spikeSalesAverageVolume: { type: 'number', minimum: 1 },
                        spikeTransactionNumber: { type: 'number', minimum: 1 },
                        spikeOfVolumeInRegion: { type: 'string', minLength: 1 },
                      },
                      errorMessage: 'This field is required.',
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
                          'spikeSalesAverageVolume',
                          'spikeOfVolumeInRegion',
                          'spikeTransactionNumber',
                        ],
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

const notSpikeInSaleVisibility = {
  '!==': [{ var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales' }, true],
};

const isCustomBusinessModel = {
  in: ['Other', { var: 'entity.data.additionalInfo.store.processingDetails.businessModel' }],
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
              required: [
                'spike-sales-volume-input',
                'split-of-volume-in-region',
                'spike-sales-transaction-number-input',
              ],
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
            {
              name: 'spike-split-of-volume-in-region',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.spikeOfVolumeInRegion',
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
          type: 'json-form',
          name: 'split-volume-region-form',
          visibleOn: [
            {
              type: 'json-logic',
              value: notSpikeInSaleVisibility,
            },
          ],
          elements: [
            {
              name: 'spike-split-of-volume-in-region',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.spikeOfVolumeInRegion',
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
                  'ui:field': 'CheckboxList',
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
