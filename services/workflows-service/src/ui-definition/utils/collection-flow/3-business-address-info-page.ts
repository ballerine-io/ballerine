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
                      street: 'errorMessage.required.street',
                      streetNumber: 'errorMessage.required.streetNumber',
                      city: 'errorMessage.required.city',
                      country: 'errorMessage.required.country',
                      isDifferentFromPhysical: 'errorMessage.required.requiredField',
                    },
                  },
                  if: {
                    properties: {
                      isDifferentFromPhysical: { const: true },
                    },
                  },
                  then: {
                    required: ['physical'],
                    errorMessage: {
                      required: {
                        street: 'errorMessage.required.street',
                        streetNumber: 'errorMessage.required.streetNumber',
                        city: 'errorMessage.required.city',
                        country: 'errorMessage.required.country',
                        isDifferentFromPhysical: 'errorMessage.required.requiredField',
                      },
                    },
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
                    physical: {
                      type: 'object',
                      default: {},
                      required: ['street', 'streetNumber', 'city', 'country'],
                      errorMessage: {
                        required: {
                          street: 'errorMessage.required.street',
                          streetNumber: 'errorMessage.required.streetNumber',
                          city: 'errorMessage.required.city',
                          country: 'errorMessage.required.country',
                          isDifferentFromPhysical: 'errorMessage.required.requiredField',
                          physical: 'errorMessage.required.physical',
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
  name: 'text.businessAddress',
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
                  'ui:placeholder': 'text.choose',
                },
              },
            },
            {
              name: 'different-from-physical-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical',
              options: {
                label: 'text.differentFromPhysicalAddress',
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
                label: 'text.street.label',
                hint: 'text.street.hint',
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
                label: 'text.number',
                hint: '10',
              },
            },
            {
              name: 'physical-city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.city',
              options: {
                label: 'text.city.label',
                hint: 'text.city.hint',
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
                label: 'text.country',
                hint: 'text.choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                  'ui:label': true,
                  'ui:placeholder': 'text.choose',
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
