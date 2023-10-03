const availableOnButtonRule = {
  and: [
    { var: 'entity.data' },
    { var: 'entity.data.additionalInfo' },
    { var: 'entity.data.additionalInfo.store' },
    { var: 'entity.data.additionalInfo.store.processingDetails' },
    { var: 'entity.data.additionalInfo.store.processingDetails.monthlySalesVolume' },
    { var: 'entity.data.additionalInfo.store.processingDetails.monthlyTransactions' },
    { var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlySalesClipsPay' },
    { var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlyTransactionsClipsPay' },
    { var: 'entity.data.additionalInfo.store.processingDetails.averageTicketSales' },
    { var: 'entity.data.additionalInfo.store.processingDetails.maximumTicketSales' },
    {
      if: [
        {var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales'},
        {
          and: [
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.monthlySalesVolume'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.monthlyTransactions'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlySalesClipsPay'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlyTransactionsClipsPay'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.averageTicketSales'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.maximumTicketSales'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.spikeSalesVolume'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.spikeTransactionNumber'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.spikeOfVolumeInRegion'}]}
          ]
        },
        {
          and: [
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.monthlySalesVolume'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.monthlyTransactions'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlySalesClipsPay'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.estimatedMonthlyTransactionsClipsPay'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.averageTicketSales'}]},
            {'!!': [{var: 'entity.data.additionalInfo.store.processingDetails.maximumTicketSales'}]}
          ]
        }
      ]
    }
  ]
}

const isSpikeInSaleVisibility = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales' }, true],
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
          type: 'collection-flow-head',
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              value: 'Processing Details',
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
              name: 'monthly-sales-volume-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.monthlySalesVolume',
              option: {
                label: 'Monthly Sales Volume',
                hint: '5,000',
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
              option: {
                label: 'Monthly Number Of Transactions',
                hint: '200',
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
              option: {
                label: 'Est. Monthly Sales Volume through ClipsPay',
                hint: '3,000',
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
              option: {
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
                'entity.data.additionalInfo.store.processingDetails.averageTicketSales',
              option: {
                label: 'Average Ticket Sales',
                hint: '25',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'maximum-ticket-sales-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.maximumTicketSales',
              option: {
                label: 'Maximum Ticket Sales',
                hint: '200',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'maximum-ticket-sales-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.maximumTicketSales',
              option: {
                label: 'Maximum Ticket Sales',
                hint: '200',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'spike-in-transactions-input',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales',
              option: {
                label: 'There are spikes in transactions (e.g., promotions, events, etc.)',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              type: 'json-form',
              options: {
                jsonFormDefinition: {
                  required: [
                    'spike-sales-volume-input',
                    'spike-sales-transaction-number-input',
                    'split-of-volume-in-region',
                  ],
                },
              },
              visibleOn: [isSpikeInSaleVisibility],
              elements: [
                {
                  name: 'spike-sales-volume-input',
                  type: 'json-form:text',
                  valueDestination:
                    'entity.data.additionalInfo.store.processingDetails.spikeSalesVolume',
                  option: {
                    label: 'Spike Sales Volume',
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
                  option: {
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
                  option: {
                    label: 'Split of volume by regions in %',
                    hint: '30%',
                    jsonFormDefinition: {
                      type: 'number',
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
                  type: 'array',
                  items: {
                    type: 'string',
                    enum: ['B2C', 'B2B', 'C2C', 'Other'],
                  },
                  uniqueItems: true,
                },
              },
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.mainContact',
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'button',
          uiDefinition: {
            classNames: ['align-right', 'padding-top-10'],
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          option: {
            text: 'Continue',
          },
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      event: 'next',
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-logic',
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
