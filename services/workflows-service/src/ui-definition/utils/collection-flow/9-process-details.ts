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
                required: ['store'],
                properties: {
                  store: {
                    type: 'object',
                    required: ['processingDetails'],
                    properties: {
                      processingDetails: {
                        type: 'object',
                        properties: {
                          monthlySalesVolume: { type: ['number', 'null'] },
                          monthlyTransactions: { type: ['number', 'null'] },
                          averageTicketAmount: { type: ['number', 'null'] },
                          mainCategory: { type: ['string', 'null'] },
                          businessModel: { type: ['string', 'null'] },
                          isSpikeInSales: { type: ['boolean', 'null'] },
                          spikeSalesAverageVolume: { type: ['number', 'null'] },
                          spikeTransactionNumber: { type: ['number', 'null'] },
                          spikeOfVolumeInRegion: { type: ['string', 'null'] },
                        },
                        oneOf: [
                          {
                            required: [
                              'monthlySalesVolume',
                              'monthlyTransactions',
                              'averageTicketAmount',
                              'isSpikeInSales',
                              'spikeSalesAverageVolume',
                              'spikeTransactionNumber',
                              'spikeOfVolumeInRegion',
                              'mainCategory',
                              'businessModel',
                            ],
                            errorMessage: {
                              monthlySalesVolume: 'Monthly Sales Volume is required when spike in sales details are provided.',
                              monthlyTransactions: 'Monthly Transactions are required when spike in sales details are provided.',
                              averageTicketAmount: 'Average Ticket Amount is required when spike in sales details are provided.',
                              isSpikeInSales: 'Is Spike In Sales is required when spike in sales details are provided.',
                              spikeSalesAverageVolume: 'Spike Sales Average Volume is required when spike in sales details are provided.',
                              spikeTransactionNumber: 'Spike Transaction Number is required when spike in sales details are provided.',
                              spikeOfVolumeInRegion: 'Spike Of Volume In Region is required when spike in sales details are provided.',
                              mainCategory: 'Main Category is required when spike in sales details are provided.',
                              businessModel: 'Business Model is required when spike in sales details are provided.',
                            }
                          },
                          {
                            required: [
                              'monthlySalesVolume',
                              'monthlyTransactions',
                              'averageTicketAmount',
                              'mainCategory',
                              'businessModel',
                            ],
                            errorMessage: {
                              monthlySalesVolume: 'Monthly Sales Volume is required when no spike in sales details are provided.',
                              monthlyTransactions: 'Monthly Transactions are required when no spike in sales details are provided.',
                              averageTicketAmount: 'Average Ticket Amount is required when no spike in sales details are provided.',
                              mainCategory: 'Main Category is required when no spike in sales details are provided.',
                              businessModel: 'Business Model is required when no spike in sales details are provided.',
                            }
                          },
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
    required: ['entity'],
  };

const isSpikeInSaleVisibility = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales' }, true],
};

const isCustomBusinessModel = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.mainCategory' }, 'Other'],
};

export const ProcessingDetails = {
  type: 'page',
  number: 9,
  stateName: 'processing_details',
  name: 'Processing Details',
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
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['spike-sales-volume-input', 'split-of-volume-in-region'],
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
          type: 'h3',
          value: 'Main Contact',
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['main-category-input'],
            },
          },
          elements: [
            {
              name: 'main-category-input',
              type: 'json-form:select',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.mainCategory',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  oneOf: [
                    {
                      title: 'B2C',
                      const: 'B2C',
                    },
                    {
                      title: 'B2B',
                      const: 'B2B',
                    },
                    {
                      title: 'C2C',
                      const: 'C2C',
                    },
                    {
                      title: 'Other',
                      const: 'Other',
                    },
                  ],
                },
                label: 'Customer Category',
                hint: 'B2C',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['business-model-input'],
            },
          },
          elements: [
            {
              name: 'business-model-input',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.businessModel',
              options: {
                jsonFormDefition: {
                  type: 'string',
                  oneOf: [
                    {
                      title: 'Membership',
                      const: 'Membership',
                    },
                    {
                      title: 'Direct Purchase',
                      const: 'Direct Purchase',
                    },
                    {
                      title: 'Other',
                      const: 'Other',
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
