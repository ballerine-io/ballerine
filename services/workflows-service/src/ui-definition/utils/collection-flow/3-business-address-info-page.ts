import { getCountriesList } from '../schema-utils/countries';

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
              required: ['headquarters'],
              properties: {
                headquarters: {
                  type: 'object',
                  oneOf: [
                    {
                      required: [
                        'street',
                        'streetNumber',
                        'city',
                        'country',
                        'isDifferentFromPhysical',
                      ],
                      properties: {
                        street: { type: 'string', minLength: 2 },
                        streetNumber: { type: 'number' },
                        city: { type: 'string', minLength: 2 },
                        country: { type: 'string', minLength: 2 },
                        isDifferentFromPhysical: { enum: [false] },
                      },
                    },
                    {
                      required: [
                        'street',
                        'streetNumber',
                        'city',
                        'country',
                        'isDifferentFromPhysical',
                        'physical',
                      ],
                      properties: {
                        isDifferentFromPhysical: { enum: [true] },
                        street: { type: 'string', minLength: 2 },
                        streetNumber: { type: 'number' },
                        city: { type: 'string', minLength: 2 },
                        country: { type: 'string', minLength: 2 },
                        physical: {
                          type: 'object',
                          required: ['street', 'streetNumber', 'city', 'country'],
                          properties: {
                            street: { type: 'string', minLength: 2 },
                            streetNumber: { type: 'number' },
                            city: { type: 'string', minLength: 2 },
                            country: { type: 'string', minLength: 2 },
                          },
                        },
                      },
                    },
                  ],
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

const physicalAddressForm = {
  '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true],
};

export const BusinessAddressInfoPage = {
  type: 'page',
  number: 3,
  stateName: 'business_address_information',
  name: 'Company Address',
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
                text: 'Address',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'Registered Address',
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['street-input', 'street-number-input', 'city-input', 'country-input'],
            },
          },
          elements: [
            {
              name: 'street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.street',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              name: 'street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.streetNumber',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'Number',
                hint: '10',
              },
            },
            {
              name: 'city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.city',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                label: 'City',
                hint: 'London',
              },
            },
            {
              name: 'country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              options: {
                label: 'Country',
                hint: 'United Kingdom',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                  oneOf: [
                    // Line below should removed in case when field is required.
                    // { const: '', title: '' },
                    ...getCountriesList().map(countryData => ({
                      const: countryData.isoCode,
                      title: countryData.fullName,
                    })),
                  ],
                },
              },
            },
            {
              name: 'different-from-physical-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical',
              options: {
                label: 'Different from physical address',
                jsonFormDefinition: {
                  type: 'boolean',
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'physical-street-input',
                'physical-street-number-input',
                'physical-city-input',
                'physical-country-input',
              ],
            },
          },
          visibleOn: [
            {
              type: 'json-logic',
              value: physicalAddressForm,
            },
          ],
          elements: [
            {
              name: 'physical-street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.street',
              options: {
                label: 'Street',
                hint: 'Downing Street',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'physical-street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.streetNumber',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'Number',
                hint: '10',
              },
            },
            {
              name: 'physical-city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.city',
              options: {
                label: 'City',
                hint: 'London',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'physical-country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.country',
              options: {
                label: 'Country',
                hint: 'United Kingdom',
                jsonFormDefinition: {
                  type: 'string',
                  oneOf: [
                    // Line below should removed in case when field is required.
                    // { const: '', title: '' },
                    ...getCountriesList().map(countryData => ({
                      const: countryData.isoCode,
                      title: countryData.fullName,
                    })),
                  ],
                },
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
          availableOn: [
            {
              type: 'json-schema',
              value: availableOnButtonRule,
            },
          ],
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'Continue',
          },
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
