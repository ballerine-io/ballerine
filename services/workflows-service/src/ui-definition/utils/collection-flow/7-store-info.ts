const validationSchema = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            additionalInfo: {
              type: 'object',
              properties: {
                store: {
                  type: 'object',
                  properties: {
                    websiteUrls: {
                      type: 'string',
                      not: { enum: [''] },
                      errorMessage: 'Website URL(s) should not be empty.',
                    },
                    dba: {
                      type: 'string',
                      not: { enum: [''] },
                      errorMessage: 'Doing Business As (DBA) should not be empty.',
                    },
                    products: {
                      type: 'string',
                      not: { enum: [''] },
                      errorMessage: 'Products information should not be empty.',
                    },
                    established: {
                      type: 'string',
                      errorMessage: 'Establishment date should be a valid string.',
                    },
                    hasMobileApp: {
                      type: 'boolean',
                      errorMessage: 'Has Mobile App should be either true or false.',
                    },
                    mobileAppName: {
                      type: 'string',
                      if: {
                        properties: { hasMobileApp: { enum: [true] } },
                      },
                      then: {
                        not: { enum: [''] },
                        errorMessage: 'Mobile App Name should not be empty.',
                      },
                      else: {
                        enum: [''],
                        errorMessage: 'Mobile App Name should be empty if no mobile app exists.',
                      },
                    },
                  },
                  required: ['websiteUrls', 'dba', 'products', 'established', 'hasMobileApp'],
                  errorMessage: {
                    required: {
                      websiteUrls: 'Website URL(s) is required.',
                      dba: 'Doing Business As (DBA) is required.',
                      products: 'Products information is required.',
                      established: 'Establishment date is required.',
                      hasMobileApp: 'Information on mobile app availability is required.',
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

const hasMobileAppVisibilityRule = {
  '==': [{ var: 'entity.data.additionalInfo.store.hasMobileApp' }, true],
};

export const StoreInfoPage = {
  type: 'page',
  number: 7,
  stateName: 'store_info',
  name: 'Store Info',
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
                text: 'Store Info',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'store-website-urls-input',
                'store-dba-input',
                'store-industry-input',
                'store-products-input',
                'store-established-input',
                'store-has-mobile-checkbox'
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
                  type: 'string',
                },
                label: 'Website URLs (divide with comma if more than one)',
                hint: 'www.example.cn',
              },
            },
            {
              name: 'store-dba-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.dba',
              options: {
                jsonFormDefinition: {
                  type: 'string',
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
                  ],
                },
              },
            },
            {
              name: 'store-products-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.products',
              options: {
                jsonFormDefinition: {
                  type: 'string',
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
                  type: 'boolean',
                },
                label: 'I have mobile application',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['store-mobile-app-name-input']
            }
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: hasMobileAppVisibilityRule,
            },
          ],
          elements: [
            {
              name: 'store-mobile-app-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.mobileAppName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'App Name',
                hint: 'App Name',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['active-store-website-checkbox']
            }
          },
          elements: [
            {
              name: 'active-store-website-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.store.hasActiveWebsite',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                },
                label: "I declare that the website's business activity does not require a license",
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
            text: 'Previous',
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
              value: validationSchema,
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
