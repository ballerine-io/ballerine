import { getCountriesList } from '../schema-utils/countries';

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
              required: ['headquarters'],
              properties: {
                headquarters: {
                  type: 'object',
                  if: {
                    properties: {
                      isDifferentFromPhysical: { const: true },
                    },
                    required: ['isDifferentFromPhysical'],
                  },
                  then: {
                    required: [
                      'searchAddress',
                      'street',
                      'streetNumber',
                      'city',
                      'country',
                      'physical',
                    ],
                  },
                  else: {
                    required: ['searchAddress', 'street', 'streetNumber', 'city', 'country'],
                    errorMessage: {
                      required: {
                        searchAddress: 'Search address is required.',
                        street: 'Street is required.',
                        streetNumber: 'Street number is required.',
                        city: 'City is required.',
                        country: 'Country is required.',
                        isDifferentFromPhysical: 'This field is required.',
                      },
                    },
                  },
                  properties: {
                    isDifferentFromPhysical: {
                      type: 'boolean',
                    },
                    searchAddress: {
                      type: 'string',
                      // Product of street, street number, city and country
                      minLength: 8,
                      maxLength: 162,
                      errorMessage: {
                        minLength: 'Search address should be at least 3 characters long.',
                        maxLength: 'Search address should not exceed 100 characters.',
                      },
                    },
                    street: {
                      type: 'string',
                      minLength: 3,
                      maxLength: 100,
                      errorMessage: {
                        minLength: 'Street should be at least 3 characters long.',
                        maxLength: 'Street should not exceed 100 characters.',
                      },
                    },
                    streetNumber: {
                      type: 'number',
                      minLength: 1,
                      maxLength: 10,
                      errorMessage: {
                        minLength: 'Street number is required.',
                        maxLength: 'Street number should not exceed 10 characters.',
                      },
                    },
                    city: {
                      type: 'string',
                      minLength: 2,
                      maxLength: 50,
                      errorMessage: {
                        minLength: 'City should be at least 2 characters long.',
                        maxLength: 'City should not exceed 50 characters.',
                      },
                    },
                    country: {
                      type: 'string',
                      minLength: 2,
                      maxLength: 2,
                      pattern: '^[A-Z]{2}$',
                      errorMessage: {
                        minLength: 'Country code should be exactly 2 characters.',
                        maxLength: 'Country code should be exactly 2 characters.',
                        pattern: 'Invalid country code.',
                      },
                    },
                    physical: {
                      type: 'object',
                      required: ['searchAddress', 'street', 'streetNumber', 'city', 'country'],
                      errorMessage: {
                        required: {
                          searchAddress: 'Search address is required.',
                          street: 'Street is required.',
                          streetNumber: 'Street number is required.',
                          city: 'City is required.',
                          country: 'Country is required.',
                          isDifferentFromPhysical: 'This field is required.',
                          physical: 'Physical address details are required.',
                        },
                      },
                      properties: {
                        searchAddress: {
                          type: 'string',
                          // Product of street, street number, city and country
                          minLength: 8,
                          maxLength: 162,
                          errorMessage: {
                            minLength: 'Search address should be at least 8 characters long.',
                            maxLength: 'Search address should not exceed 162 characters.',
                          },
                        },
                        street: {
                          type: 'string',
                          minLength: 3,
                          maxLength: 100,
                          errorMessage: {
                            minLength: 'Street should be at least 3 characters long.',
                            maxLength: 'Street should not exceed 100 characters.',
                          },
                        },
                        streetNumber: {
                          type: 'number',
                          minLength: 1,
                          maxLength: 10,
                          errorMessage: {
                            minLength: 'Street number is required.',
                            maxLength: 'Street number should not exceed 10 characters.',
                          },
                        },
                        city: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 50,
                          errorMessage: {
                            minLength: 'City should be at least 2 characters long.',
                            maxLength: 'City should not exceed 50 characters.',
                          },
                        },
                        country: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 2,
                          pattern: '^[A-Z]{2}$',
                          errorMessage: {
                            minLength: 'Country code should be exactly 2 characters.',
                            maxLength: 'Country code should be exactly 2 characters.',
                            pattern: 'Invalid country code.',
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
              required: [
                'search-address-input',
                'street-input',
                'street-number-input',
                'city-input',
                'country-input',
              ],
            },
          },
          elements: [
            {
              name: 'search-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.searchAddress',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'Search Address',
                hint: '10 Downing Street, London, UK, SW1A 2AA',
              },
            },
            {
              name: 'street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.street',
              options: {
                jsonFormDefinition: {
                  type: 'string',
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
              required: [
                'physical-search-address-input',
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
              name: 'physical-search-address-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.searchAddress',
              options: {
                label: 'Search Address',
                hint: '10 Downing Street, London, UK, SW1A 2AA',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
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
            text: 'Previous',
          },
        },
        {
          name: 'next-page-button',
          type: 'json-form:button',
          availableOn: [
            {
              type: 'json-schema',
              value: validationSchema,
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
