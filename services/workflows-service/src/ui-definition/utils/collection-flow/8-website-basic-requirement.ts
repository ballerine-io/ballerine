const availableOnButtonRule = {
  and: [
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.operationEntitiesName' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.contactDetails' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.returnPolicyUrl' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.shippingPolicyUrl' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.aboutUsUrl' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.productQuantityUrl' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.productDescription' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.productPrice' }, ''] },
    { '!=': [{ var: 'entity.data.additionalInfo.store.website.websiteLanguage' }, ''] },
  ],
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
          type: 'collection-flow-head',
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              value: 'Website Basic Requirement',
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
                'return-policy-url-input',
                'shipping-policy-url-input',
                'about-us-url-input',
                'product-quantity-url-input',
                'product-description-input',
                'product-price-input',
                'website-language-input',
              ],
            },
          },
          elements: [
            {
              type: 'json-form:hint',
              option: {
                label:
                  'This list is intended only as a basic pre-entry check of the websites and does not refer to specific product application requirements.',
              },
            },
            {
              name: 'operation-entities-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.operationEntitiesName',
              option: {
                label: 'Operation Entities Name, address',
                hint: 'Example Corp.',
              },
            },
            {
              type: 'json-form:hint',
              option: {
                style: 'padding-top: -10px;',
                label: 'the same as the application Entities',
              },
            },
            {
              name: 'contact-details-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.contactDetails',
              option: {
                label: 'Contact Details (or Return Address)',
                hint: '22, chaoyangmen, chaoyan district, beijing, china',
              },
            },
            {
              name: 'return-policy-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.returnPolicyUrl',
              option: {
                label: 'Return / Exchange Policy URL',
                hint: 'www.example.com/return-policy',
              },
            },
            {
              name: 'shipping-policy-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.shippingPolicyUrl',
              option: {
                label: 'Shipping Policy',
                hint: 'www.example.com/shipping-policy',
              },
            },
            {
              name: 'about-us-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.aboutUsUrl',
              option: {
                label: 'About Us/Brand Intro URL',
                hint: 'www.example.com/about-us',
              },
            },
            {
              name: 'product-quantity-url-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productQuantityUrl',
              option: {
                label: 'Product Quantity URL',
                hint: 'www.example.com/products',
              },
            },
            {
              name: 'product-description-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productDescription',
              option: {
                label: 'Adequate Product/Service Description',
                hint: 'Descriptive text about the product/service',
              },
            },
            {
              name: 'product-price-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.store.website.productPrice',
              option: {
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
              option: {
                label: 'Website Language',
                hint: 'English',
              },
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'button',
          uiDefinition: {
            classNames: ['align-right', 'padding-top-10'],
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          option: {
            text: 'Continue',
          },
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      event: 'next',
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-logic',
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
