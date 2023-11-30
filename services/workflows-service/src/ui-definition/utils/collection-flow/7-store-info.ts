import { multipleUrlsPattern } from '../schema-utils/regex';

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
                        mobileAppName: 'errorMessages.required.mobileAppName',
                      },
                    },
                  },
                  properties: {
                    websiteUrls: {
                      type: 'string',
                      pattern: multipleUrlsPattern,
                      minLength: 1,
                      errorMessage: {
                        minLength: 'errorMessages.required.websiteUrls',
                        pattern: 'errorMessages.pattern.websiteUrls',
                      },
                    },
                    dba: {
                      type: 'string',
                      not: { enum: [''] },
                      errorMessage: 'errorMessages.required.dba',
                    },
                    products: {
                      type: 'string',
                      not: { enum: [''] },
                      errorMessage: 'errorMessages.required.products',
                    },
                    established: {
                      type: 'string',
                      errorMessage: 'errorMessages.required.established',
                    },
                    hasMobileApp: {
                      type: 'boolean',
                      errorMessage: 'errorMessages.required.hasMobileApp',
                      default: false,
                    },
                    mobileAppName: {
                      type: 'string',
                    },
                    industry: {
                      type: 'string',
                      minLength: 1,
                      errorMessage: {
                        minLength: 'errorMessages.minLength.industry',
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
                      websiteUrls: 'errorMessage.required.websiteUrls',
                      dba: 'errorMessage.required.dba',
                      products: 'errorMessage.required.products',
                      established: 'errorMessage.required.established',
                      hasMobileApp: 'errorMessage.required.hasMobileApp',
                      industry: 'errorMessages.required.industry',
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
  name: 'text.storeInfo',
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
                text: 'text.storeInfo',
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
                label: 'text.websiteUrls.label',
                hint: 'text.websiteUrls.hint',
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
                label: 'text.dba.label',
                hint: 'text.dba.hint',
              },
            },
            {
              name: 'store-industry-input',
              type: 'json-form:dropdown',
              valueDestination: 'entity.data.additionalInfo.store.industry',
              options: {
                label: 'text.industry',
                hint: 'text.choose',
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
                label: 'text.products.label',
                hint: 'text.products.hint',
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
                label: 'text.established.label',
                hint: 'text.dateHint',
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
                label: 'text.hasMobileApp.label',
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
                label: 'text.mobileAppName',
                hint: 'text.mobileAppName',
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
                label: 'text.hasActiveWebsite',
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
            descriptionRaw: 'text.storeInfoDescription',
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
