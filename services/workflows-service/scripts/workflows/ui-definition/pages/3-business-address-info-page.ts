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
                  required: ['street', 'streetNumber', 'city', 'country', 'postalCode', 'phone'],
                  errorMessage: {
                    required: {
                      street: 'Street is required.',
                      streetNumber: 'Street number is required.',
                      city: 'City is required.',
                      country: 'Country is required.',
                      postalCode: 'Postal code is required.',
                      phone: 'Phoine is required.',
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
                    postalCode: {
                      type: 'string',
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
                    phone: {
                      type: 'string',
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

export const BusinessAddressInfoPage = {
  type: 'page',
  number: 3,
  stateName: 'business_address_information',
  name: 'Headquarters Address',
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
                'street-input',
                'street-number-input',
                'postal-code-input',
                'city-input',
                'country-input',
                'headquarters-phone-number-input',
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
              name: 'postal-code-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.postalCode',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'Postal code',
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
              name: 'headquarters-phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.headquarters.phone',
              options: {
                label: 'Headquarters phone number',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'PhoneInput',
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
