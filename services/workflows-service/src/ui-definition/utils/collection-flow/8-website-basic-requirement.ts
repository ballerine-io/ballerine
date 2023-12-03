import { singleUrlPattern } from '../schema-utils/regex';

const validationSchema = {
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
                  required: ['website'],
                  default: {},
                  properties: {
                    website: {
                      type: 'object',
                      default: {},
                      required: [
                        'mainWebsite',
                        'contactDetails',
                        'productQuantity',
                        'productDescription',
                        'productPrice',
                      ],
                      properties: {
                        mainWebsite: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.mainWebsite',
                            pattern: 'errorMessage.pattern.mainWebsite',
                          },
                        },
                        contactDetails: {
                          type: 'string',
                          errorMessage: 'errorMessage.error.contactDetails',
                        },
                        returnPolicyUrl: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.returnPolicyUrl',
                            pattern: 'errorMessage.pattern.returnPolicyUrl',
                          },
                        },
                        shippingPolicyUrl: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.shippingPolicyUrl',
                            pattern: 'errorMessage.pattern.shippingPolicyUrl',
                          },
                        },
                        aboutUsUrl: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.aboutUsUrl',
                            pattern: 'errorMessage.pattern.aboutUsUrl',
                          },
                        },
                        termsOfUseUrl: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.termsOfUseUrl',
                            pattern: 'errorMessage.pattern.termsOfUseUrl',
                          },
                        },
                        privacyPolicyUrl: {
                          type: 'string',
                          pattern: singleUrlPattern,
                          minLength: 1,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.privacyPolicyUrl',
                            pattern: 'errorMessage.pattern.privacyPolicyUrl',
                          },
                        },
                        productQuantity: {
                          type: 'number',
                          errorMessage: 'errorMessage.error.productQuantity',
                        },
                        productPrice: {
                          type: 'number',
                          errorMessage: 'errorMessage.error.productPrice',
                        },
                        productDescription: {
                          type: 'string',
                          errorMessage: 'errorMessage.error.productDescription',
                        },
                        websiteLanguage: {
                          type: 'string',
                          errorMessage: 'errorMessage.error.websiteLanguage',
                        },
                      },
                      errorMessage: {
                        required: {
                          mainWebsite: 'errorMessage.required.mainWebsite',
                          contactDetails: 'errorMessage.required.contactDetails',
                          productQuantity: 'errorMessage.required.productQuantity',
                          productDescription: 'errorMessage.required.productDescription',
                          productPrice: 'errorMessage.required.productPrice',
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

export const WebsiteBasicRequirement = {
  type: 'page',
  number: 8,
  stateName: 'website_basic_requirement',
  name: 'text.websiteBasicRequirement',
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
                text: 'text.websiteBasicRequirement',
              },
            },
            {
              type: 'description',
              name: 'heading-description',
              options: {
                descriptionRaw: 'text.websiteBasicRequirementDescription',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'main-company-website-input',
                'contact-details-input',
                'operation-entities-name-input',
                'contact-details-input',
                'product-quantity-input',
                'product-description-input',
                'product-price-input',
              ],
            },
          },
          elements: [
            {
              type: 'json-form:hint',
              options: {
                label: 'text.websiteBasicRequirementHint',
              },
            },
            {
              name: 'main-company-website-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.mainWebsite',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.mainWebsite.label',
                hint: 'text.mainWebsite.hint',
                description: 'text.mainWebsite.description',
              },
            },
            {
              name: 'contact-details-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.contactDetails',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.contactDetails.label',
                hint: 'text.contactDetails.hint',
              },
            },
            {
              name: 'return-policy-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.returnPolicyUrl',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.returnPolicyUrl.label',
                hint: 'text.returnPolicyUrl.hint',
              },
            },
            {
              name: 'shipping-policy-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.shippingPolicyUrl',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.shippingPolicyUrl.label',
                hint: 'text.shippingPolicyUrl.hint',
              },
            },
            {
              name: 'about-us-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.aboutUsUrl',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.aboutUsUrl.label',
                hint: 'text.aboutUsUrl.hint',
              },
            },
            {
              name: 'terms-of-us-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.termsOfUseUrl',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.termsOfUseUrl.label',
                hint: 'text.termsOfUseUrl.hint',
              },
            },
            {
              name: 'privacy-policy-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.privacyPolicyUrl',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.privacyPolicyUrl.label',
                hint: 'text.privacyPolicyUrl.hint',
              },
            },
            {
              name: 'product-quantity-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productQuantity',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'text.productQuantity.label',
                hint: 'text.productQuantity.hint',
              },
            },
            {
              name: 'product-description-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productDescription',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:widget': 'textarea',
                },
                label: 'text.productDescription.label',
                hint: 'text.productDescription.hint',
                classNames: ['min-width-40px'],
              },
            },
            {
              name: 'product-price-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productPrice',
              options: {
                label: 'text.productPrice.label',
                hint: 'text.productPrice.hint',
                jsonFormDefinition: {
                  type: 'number',
                },
              },
            },
            {
              name: 'website-language-input',
              type: 'json-form:dropdown',
              valueDestination: 'entity.data.additionalInfo.store.website.websiteLanguage',
              options: {
                hint: 'text.choose',
                label: 'text.websiteLanguage.label',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:placeholder': 'text.choose',
                  'ui:field': 'LocalePicker',
                  'ui:label': true,
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
