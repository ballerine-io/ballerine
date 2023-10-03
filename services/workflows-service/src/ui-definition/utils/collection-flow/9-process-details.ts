const availableOnButtonRule = {
  and: [
    { '!=': [{ var: 'entity.data.additionalInfo.store.websiteUrls' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.dba' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.products' }, ''] },
    {
      regex: [
        { var: 'entity.data.additionalInfo.store.established' },
        '^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$',
      ],
    },
    { '!=': [{ var: 'entity.data.additionalInfo.store.dba' }, ''] },
    {
      if: [
        { var: 'entity.data.additionalInfo.store.hasMobileApp' },
        { '!=': [{ var: 'entity.data.additionalInfo.store.mobileAppName' }, ''] },
        { '==': [{ var: 'entity.data.additionalInfo.store.mobileAppName' }, ''] },
      ],
    },
  ],
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
