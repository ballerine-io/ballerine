import { multipleUrlsPattern } from '../../../../../../src/ui-definition/utils/schema-utils/regex';

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
                  required: ['websiteUrls', 'industry'],
                  errorMessage: {
                    required: {
                      websiteUrls: 'errorMessage.required.websiteUrls',
                      industry: 'errorMessage.required.industry',
                    },
                  },
                  properties: {
                    websiteUrls: {
                      type: 'string',
                      pattern: multipleUrlsPattern,
                      minLength: 1,
                      errorMessage: {
                        minLength: 'errorMessage.required.websiteUrls',
                        pattern: 'errorMessage.pattern.websiteUrls',
                      },
                    },
                    industry: {
                      type: 'string',
                      minLength: 1,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.industry',
                      },
                    },
                    processingDetails: {
                      type: 'object',
                      default: {},
                      required: ['annualSalesVolume', 'businessModel'],
                      errorMessage: {
                        required: {
                          annualSalesVolume: 'errorMessage.required.annualSalesVolume',
                          businessModel: 'errorMessage.required.businessModel',
                        },
                      },
                      properties: {
                        annualSalesVolume: {
                          type: 'number',
                          minimum: 1,
                          errorMessage: 'errorMessage.error.annualSalesVolume',
                        },
                        businessModel: {
                          type: 'array',
                          items: { type: 'string' },
                          minItems: 1,
                          errorMessage: 'errorMessage.error.businessModel',
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
  required: ['entity'],
};

const isCustomBusinessModel = {
  in: ['Other', { var: 'entity.data.additionalInfo.store.processingDetails.businessModel' }],
};

export const CompanyActivityPage = {
  type: 'page',
  number: 4,
  stateName: 'company_activity',
  name: 'text.companyActivity',
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
                text: 'text.companyActivity',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['store-industry-input'],
            },
          },
          elements: [
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
          ],
        },
        {
          type: 'h3',
          options: {
            text: 'text.businessModel',
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
                      title: 'text.membership',
                      value: 'Membership',
                    },
                    {
                      title: 'text.directPurchase',
                      value: 'Direct Purchase',
                    },
                    {
                      title: 'text.other',
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
                label: 'text.businessModel',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['annual-sales-volume-input', 'store-website-urls-input'],
            },
          },
          elements: [
            {
              name: 'annual-sales-volume-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.store.processingDetails.annualSalesVolume',
              options: {
                label: 'text.annualSalesVolume.label',
                hint: 'text.annualSalesVolume.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
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
