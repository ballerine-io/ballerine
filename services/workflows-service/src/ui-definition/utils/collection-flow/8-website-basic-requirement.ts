const availableOnButtonRule = {
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
                  properties: {
                    website: {
                      type: 'object',
                      required: [
                        'mainWebsite',
                        'contactDetails',
                        'returnPolicyUrl',
                        'shippingPolicyUrl',
                        'aboutUsUrl',
                        'productQuantity',
                        'productDescription',
                        'productPrice',
                        'websiteLanguage',
                      ],
                      properties: {
                        mainWebsite: { type: 'string', not: { enum: [''] } },
                        contactDetails: { type: 'string', not: { enum: [''] } },
                        returnPolicyUrl: { type: 'string', not: { enum: [''] } },
                        shippingPolicyUrl: { type: 'string', not: { enum: [''] } },
                        aboutUsUrl: { type: 'string', not: { enum: [''] } },
                        productQuantity: { type: 'number', not: { enum: [''] } },
                        productPrice: { type: 'number', not: { enum: [''] } },
                        productDescription: { type: 'string', not: { enum: [''] } },
                        websiteLanguage: { type: 'string', not: { enum: [''] } },
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
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'stepper',
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              options: {
                text: 'Website Basic Requirement',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
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
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'Website Language',
                hint: 'English',
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
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
