const availableOnButtonRule = {
  "type": "object",
  "properties": {
    "entity": {
      "type": "object",
      "required": ["data"],
      "properties": {
        "data": {
          "type": "object",
          "required": ["additionalInfo"],
          "properties": {
            "additionalInfo": {
              "type": "object",
              "required": ["store"],
              "properties": {
                "store": {
                  "type": "object",
                  "required": ["processingDetails"],
                  "properties": {
                    "processingDetails": {
                      "type": "object",
                      "properties": {
                        "monthlySalesVolume": { "type": ["number", "null"] },
                        "monthlyTransactions": { "type": ["number", "null"] },
                        "estimatedMonthlySalesClipsPay": { "type": ["number", "null"] },
                        "estimatedMonthlyTransactionsClipsPay": { "type": ["number", "null"] },
                        "averageTicketSales": { "type": ["number", "null"] },
                        "maximumTicketSales": { "type": ["number", "null"] },
                        "mainCategory": { "type": ["string", "null"] },
                        "businessModel": { "type": ["string", "null"] },
                        "isSpikeInSales": { "type": ["boolean", "null"] },
                        "spikeSalesAverageVolume": { "type": ["number", "null"] },
                        "spikeTransactionNumber": { "type": ["number", "null"] },
                        "spikeOfVolumeInRegion": { "type": ["string", "null"] }
                      },
                      "oneOf": [
                        {
                          "required": [
                            "monthlySalesVolume",
                            "monthlyTransactions",
                            "estimatedMonthlySalesClipsPay",
                            "estimatedMonthlyTransactionsClipsPay",
                            "averageTicketSales",
                            "maximumTicketSales",
                            "spikeSalesAverageVolume",
                            "spikeTransactionNumber",
                            "spikeOfVolumeInRegion",
                            "mainCategory",
                            "businessModel"
                          ]
                        },
                        {
                          "required": [
                            "monthlySalesVolume",
                            "monthlyTransactions",
                            "estimatedMonthlySalesClipsPay",
                            "estimatedMonthlyTransactionsClipsPay",
                            "averageTicketSales",
                            "maximumTicketSales",
                            "mainCategory",
                            "businessModel"
                          ]
                        }
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "required": ["entity"]
};

const isSpikeInSaleVisibility = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.isSpikeInSales' }, true],
};

const isCustomBusinessModel = {
  '==': [{ var: 'entity.data.additionalInfo.store.processingDetails.mainCategory' }, 'Other'],
}

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
              options: {
                text: 'Processing Details'
              }
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
              options: {
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
              options: {
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
              options: {
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
                'entity.data.additionalInfo.store.processingDetails.averageTicketSales',
              options: {
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
              options: {
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
              required: [
                'spike-sales-volume-input',
                'spike-sales-transaction-number-input',
                'split-of-volume-in-region',
              ],
            },
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: isSpikeInSaleVisibility
            }
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
                label: 'Split of volume by regions in %',
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
                      title: 'B2C', const: 'B2C',
                    },
                    {
                      title: 'B2B', const: 'B2B',
                    },
                    {
                      title: 'C2C', const: 'C2C',
                    },
                    {
                      title: 'Other', const: 'Other',
                    }
                  ]
                },
                label: 'Main Category',
                hint: 'B2C',
              },
            }
          ],
        },
        {
          type: 'json-form',
          visibleOn: [{
            type: 'json-logic',
            value: isCustomBusinessModel
          }],
          elements: [
            {
              name: 'business-model-input',
              valueDestination: 'entity.data.additionalInfo.store.processingDetails.businessModel',
              options: {
                jsonFormDefition: {
                  type: 'string',
                  oneOf: [
                    {
                      title: 'Membership', const: 'Membership',
                    },
                    {
                      title: 'Direct Purchase', const: 'Direct Purchase',
                    },
                    {
                      title: 'Other', const: 'Other',
                    },
                  ]
                },
              }
            }
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
        eventName: 'PREVIOUS'
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
