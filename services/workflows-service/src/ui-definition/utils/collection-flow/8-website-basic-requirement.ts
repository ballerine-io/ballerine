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
                          pattern:
                            '^((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?$',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'Main Website should not be empty.',
                            pattern: 'Main Website should be a valid URL.',
                          },
                        },
                        contactDetails: {
                          type: 'string',
                          errorMessage: 'Contact details should not be empty.',
                        },
                        returnPolicyUrl: {
                          type: 'string',
                          pattern:
                            '^((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?$',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'Return Policy URL should not be empty.',
                            pattern: 'Return Policy URL should be a valid URL.',
                          },
                        },
                        shippingPolicyUrl: {
                          type: 'string',
                          pattern:
                            '^((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?$',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'Shipping Policy URL should not be empty.',
                            pattern: 'Shipping Policy URL should be a valid URL.',
                          },
                        },
                        aboutUsUrl: {
                          type: 'string',
                          pattern:
                            '^((https?):\\/\\/)?([a-z0-9-]+\\.)+[a-z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9#]+\\/?)?(\\?[a-zA-Z0-9_]+=[a-zA-Z0-9_]+(&[a-zA-Z0-9_]+=[a-zA-Z0-9_]+)*)?(#[a-zA-Z0-9_]+)?$',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'About Us URL should not be empty.',
                            pattern: 'About Us URL should be a valid URL.',
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
                          mainWebsite: 'Main website URL is required.',
                          contactDetails: 'Contact details are required.',
                          returnPolicyUrl: 'Return policy URL is required.',
                          shippingPolicyUrl: 'Shipping policy URL is required.',
                          aboutUsUrl: 'About us URL is required.',
                          productQuantity: 'Product quantity is required.',
                          productDescription: 'Product description is required.',
                          productPrice: 'Product price is required.',
                          websiteLanguage: 'Website language is required.',
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
                'product-quantity-url-input',
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
                label: 'Shipping Policy',
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
                label: 'About Us/Brand Intro URL',
                hint: 'www.example.com/about-us',
              },
            },
            {
              name: 'product-quantity-url-input',
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
                label: 'Reasonable Product/Service Price',
                hint: '100 USD',
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
