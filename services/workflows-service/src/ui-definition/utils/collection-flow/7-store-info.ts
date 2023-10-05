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
                  "required": [
                    "websiteUrls",
                    "dba",
                    "products",
                    "established",
                    "hasMobileApp",
                    "hasActiveWebsite"
                  ],
                  "properties": {
                    "websiteUrls": {
                      "type": "string",
                      "not": { "enum": [""] }
                    },
                    "dba": {
                      "type": "string",
                      "not": { "enum": [""] }
                    },
                    "products": {
                      "type": "string",
                      "not": { "enum": [""] }
                    },
                    "established": {
                      "type": "string",
                      "pattern": "^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/[0-9]{4}$"
                    },
                    "hasMobileApp": {
                      "type": "boolean"
                    },
                    "hasActiveWebsite": {
                      "type": "boolean"
                    },
                    "mobileAppName": {
                      "type": "string",
                      "if": {
                        "properties": { "hasMobileApp": { "enum": [true] } }
                      },
                      "then": { "not": { "enum": [""] } },
                      "else": { "enum": [""] }
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


const hasMobileAppVisibilityRule = {
  '==': [{ var: 'entity.data.additionalInfo.store.mobileAppName' }, true],
};

export const StoreInfoPage = {
  type: 'page',
  number: 7,
  stateName: 'store_info',
  name: 'Store Info',
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
              value: 'Store Info',
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
                'bank-sub-branch-input',
                'account-currency-input',
              ],
            },
          },
          elements: [
            {
              name: 'store-website-urls-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.websiteUrls',
              options: {
                jsonFormDefinition: {
                  type: 'string'
                },
                label: 'Website URLS (divide with comma if more than one)',
                hint: 'www.example.cn',
              },
            },
            {
              name: 'store-dba-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.dba',
              options: {
                jsonFormDefinition: {
                  type: 'string'
                },
                label: 'DBA (Descriptor)',
                hint: 'Barclays',
              },
            },
            {
              name: 'store-industry-input',
              type: 'json-form:dropdown',
              valueDestination: 'entity.data.additionalInfo.store.industry',
              options: {
                label: 'Industry',
                hint: 'Food & Beverage',
                jsonFormDefinition: {
                  type: 'string',
                  oneOf: [
                    { const: 'Food & Beverage', title: 'Food & Beverage' },
                    { const: 'Retail', title: 'Retail' },
                    { const: 'Travel', title: 'Travel' },
                    { const: 'Entertainment', title: 'Entertainment' },
                    { const: 'Education', title: 'Education' },
                    { const: 'Healthcare', title: 'Healthcare' },
                    { const: 'Professional Services', title: 'Professional Services' },
                    { const: 'Other', title: 'Other' },
                  ]
                },
              },
            },
            {
              name: 'store-products-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.products',
              options: {
                jsonFormDefinition: {
                  type: 'string'
                },
                classNames: ['min-width-40px'],
                label: 'Products (divide with comma if more than one)',
                hint: 'Smart Watches, Wireless Earbuds, Portable Chargers.',
              },
            },
            {
              name: 'store-established-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.established',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DateInput',
                  'ui:label': true,
                },
                label: 'Established Date',
                hint: 'DD/MM/YYYY',
              },
            },
            {
              name: 'store-has-mobile-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.store.hasMobileApp',
              options: {
                jsonFormDefinition: {
                  type: 'boolean'
                },
                label: 'I have mobile application',
              },
            },
            {
              name: 'store-mobile-app-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.mobileAppName',
              visibleOn: [hasMobileAppVisibilityRule],
              options: {
                jsonFormDefinition: {
                  type: 'string'
                },
                label: 'App Name',
                hint: 'App Name',
              },
            },
            {
              name: 'active-store-website-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.store.hasActiveWebsite',
              options: {
                jsonFormDefinition: {
                  type: 'boolean'
                },
                label: "I declare that the website's business activity does not require a license",
              },
            },
            {
              name: 'active-store-website-checkbox',
              type: 'json-form:label',
              options: {
                jsonFormDefinition: {
                  type: 'boolean'
                },
                label: "I declare that the website's business activity does not require a license",
                classNames: ['text-color-grey', 'padding-top-10'],
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
        eventName: 'PREVIOUS'
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }]
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
