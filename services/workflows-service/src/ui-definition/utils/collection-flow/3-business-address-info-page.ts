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
              default: {},
              properties: {
                headquarters: {
                  type: 'object',
                  default: {},
                  required: ['street', 'streetNumber', 'city', 'country'],
                  errorMessage: {
                    required: {
                      street: 'Street is required.',
                      streetNumber: 'Street number is required.',
                      city: 'City is required.',
                      country: 'Country is required.',
                      isDifferentFromPhysical: 'This field is required.',
                    },
                  },
                  if: {
                    properties: {
                      isDifferentFromPhysical: { const: true },
                    },
                    required: ['isDifferentFromPhysical'],
                  },
                  then: {
                    required: ['street', 'streetNumber', 'city', 'country', 'physical'],
                  },
                  properties: {
                    isDifferentFromPhysical: {
                      type: 'boolean',
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
                      required: ['street', 'streetNumber', 'city', 'country'],
                      errorMessage: {
                        required: {
                          street: 'Street is required.',
                          streetNumber: 'Street number is required.',
                          city: 'City is required.',
                          country: 'Country is required.',
                          isDifferentFromPhysical: 'This field is required.',
                          physical: 'Physical address details are required.',
                        },
                      },
                      properties: {
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
  name: 'Business Address',
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
                text: 'Business Address',
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
              type: 'json-form:country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              options: {
                label: 'Country',
                hint: 'Choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                  'ui:label': true,
                  'ui:placeholder': 'Choose',
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
              type: 'json-form:country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.country',
              options: {
                label: 'Country',
                hint: 'Choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                  'ui:label': true,
                  'ui:placeholder': 'Choose',
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
