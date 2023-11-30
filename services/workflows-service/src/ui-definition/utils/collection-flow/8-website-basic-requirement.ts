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
                          errorMessage: 'errorMessage.required.contactDetails',
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
                          errorMessage: 'Product quantity should be a valid number.',
                        },
                        productPrice: {
                          type: 'number',
                          errorMessage: 'Product price should be a valid number.',
                        },
                        productDescription: {
                          type: 'string',
                          errorMessage: 'Product description should not be empty.',
                        },
                        websiteLanguage: {
                          type: 'string',
                          errorMessage: 'Website language should not be empty.',
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
  name: 'Website Basic Requirement',
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
                text: 'Website Basic Requirement',
              },
            },
            {
              type: 'description',
              name: 'heading-description',
              options: {
                descriptionRaw:
                  'This list is intended only as a basic pre-entry check of the<br /> websites and does not refer to specific product<br /> application requirements.',
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
                label:
                  'This list is intended only as a basic pre-entry check of the websites and does not refer to specific product application requirements.',
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
                label: "Company's Main Website Address",
                hint: 'www.example.cn',
                description: 'the same as the application Entities',
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
                label: 'Contact Details (or Return Address)',
                hint: '22, chaoyangmen, chaoyan district, beijing, china',
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
                label: 'Return / Exchange Policy URL',
                hint: 'www.example.com/return-policy',
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
                label: 'Shipping Policy URL',
                hint: 'www.example.com/shipping-policy',
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
                label: 'About Us / Brand Intro URL',
                hint: 'www.example.com/about-us',
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
                label: 'Terms of Use URL',
                hint: 'www.example.com/terms',
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
                label: 'Privacy Policy URL',
                hint: 'www.example.com/privacy',
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
                label: 'Product Quantity (not less than 5)',
                hint: '100',
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
                label: 'Adequate Product/Service Description',
                hint: 'offers a range of organic skincare products, including moisturizers, serums, and cleansers. Each product is made using natural ingredients sourced sustainably.',
                classNames: ['min-width-40px'],
              },
            },
            {
              name: 'product-price-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productPrice',
              options: {
                label: 'Reasonable Product / Service Price (USD)',
                hint: '100',
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
                hint: 'Choose',
                label: 'Website Language',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:placeholder': 'Choose',
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
