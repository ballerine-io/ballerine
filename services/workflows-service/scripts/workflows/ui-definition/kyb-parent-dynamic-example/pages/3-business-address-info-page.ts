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
                      street: 'errorMessage.required.street',
                      streetNumber: 'errorMessage.required.streetNumber',
                      city: 'errorMessage.required.city',
                      country: 'errorMessage.required.country',
                      postalCode: 'errorMessage.required.postalCode',
                      phone: 'errorMessage.required.phone',
                    },
                  },
                  properties: {
                    street: {
                      type: 'string',
                      minLength: 3,
                      maxLength: 100,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.street',
                        maxLength: 'errorMessage.maxLength.street',
                      },
                    },
                    streetNumber: {
                      type: 'number',
                      minLength: 1,
                      maxLength: 10,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.streetNumber',
                        maxLength: 'errorMessage.maxLength.streetNumber',
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
                        minLength: 'errorMessage.minLength.city',
                        maxLength: 'errorMessage.maxLength.city',
                      },
                    },
                    country: {
                      type: 'string',
                      minLength: 2,
                      maxLength: 2,
                      pattern: '^[A-Z]{2}$',
                      errorMessage: {
                        minLength: 'errorMessage.minLength.country',
                        maxLength: 'errorMessage.maxLength,country',
                        pattern: 'errorMessage.pattern.country',
                      },
                    },
                    phone: {
                      type: 'string',
                      pattern: '^[+]?[0-9]{10,15}$',
                      errorMessage: {
                        pattern: 'errorMessage.pattern.phone',
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

export const BusinessAddressInfoPage = {
  type: 'page',
  number: 3,
  stateName: 'business_address_information',
  name: 'text.headquartersAddress',
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
                text: 'text.businessAddress',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'text.registeredAddress',
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
                label: 'text.street.label',
                hint: 'text.street.hint',
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
                label: 'text.number',
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
                label: 'text.postalCode',
                hint: '76131',
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
                label: 'text.city.label',
                hint: 'text.city.hint',
              },
            },
            {
              name: 'country-input',
              type: 'json-form:country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              options: {
                label: 'text.country',
                hint: 'text.choose',
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
                label: 'text.headquartersPhoneNumber.label',
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
