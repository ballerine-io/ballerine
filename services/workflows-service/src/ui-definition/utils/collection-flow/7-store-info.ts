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
              required: ['store'],
              default: {},
              properties: {
                store: {
                  type: 'object',
                  default: {},
                  if: {
                    properties: {
                      hasMobileApp: {
                        const: true,
                      },
                    },
                  },
                  then: {
                    required: ['mobileAppName'],
                    errorMessage: {
                      required: {
                        mobileAppName: 'Mobile App Name should not be empty.',
                      },
                    },
                  },
                  properties: {
                    websiteUrls: {
                      type: 'string',
                      pattern:
                        '^((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?(, *((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?)*$',
                      minLength: 1,
                      errorMessage: {
                        minLength: 'Website URL(s) should not be empty.',
                        pattern: 'Website URL(s) should be valid URL(s) separated by comma.',
                      },
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
                      default: false,
                    },
                    mobileAppName: {
                      type: 'string',
                    },
                    industry: {
                      type: 'string',
                      minLength: 1,
                      errorMessage: {
                        minLength: 'Industry is required.',
                      },
                    },
                  },
                  required: [
                    'websiteUrls',
                    'dba',
                    'products',
                    'established',
                    'hasMobileApp',
                    'industry',
                  ],
                  errorMessage: {
                    required: {
                      websiteUrls: 'Website URL(s) is required.',
                      dba: 'Doing Business As (DBA) is required.',
                      products: 'Products information is required.',
                      established: 'Establishment date is required.',
                      hasMobileApp: 'Information on mobile app availability is required.',
                      industry: 'Industry is required.',
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
                'store-has-mobile-checkbox',
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
                hint: 'Choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'IndustriesPicker',
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
              required: ['store-mobile-app-name-input'],
            },
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
              required: ['active-store-website-checkbox'],
            },
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
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'description',
          name: 'description-1',
          options: {
            descriptionRaw:
              "Leaving the last checkbox 'Unchecked' will require providing extra licenses documents",
          },
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
