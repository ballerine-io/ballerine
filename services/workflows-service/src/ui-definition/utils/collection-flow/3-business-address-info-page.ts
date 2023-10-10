import { getCountriesList } from '../schema-utils/countries';

const availableOnButtonRule = {
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
                properties: {
                  headquarters: {
                    type: 'object',
                    oneOf: [
                      {
                        properties: {
                          street: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 100,
                            errorMessage: {
                              minLength: 'Street should be at least 3 characters long.',
                              maxLength: 'Street should not exceed 100 characters.'
                            }
                          },
                          streetNumber: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 10,
                            errorMessage: {
                              minLength: 'Street number is required.',
                              maxLength: 'Street number should not exceed 10 characters.'
                            }
                          },
                          city: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 50,
                            errorMessage: {
                              minLength: 'City should be at least 2 characters long.',
                              maxLength: 'City should not exceed 50 characters.'
                            }
                          },
                          country: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 2,
                            pattern: '^[A-Z]{2}$',
                            errorMessage: {
                              minLength: 'Country code should be exactly 2 characters.',
                              maxLength: 'Country code should be exactly 2 characters.',
                              pattern: 'Invalid country code.'
                            }
                          },
                          isDifferentFromPhysical: {
                            enum: [false],
                            errorMessage: {
                              enum: 'Should be false if physical address is not different.'
                            }
                          },
                          errorMessage: {
                            required: {
                              street: 'Street is required.',
                              streetNumber: 'Street number is required.',
                              city: 'City is required.',
                              country: 'Country is required.',
                              isDifferentFromPhysical: 'This field is required.'
                            }
                          }
                        }
                      },
                      {
                        properties: {
                          street: {
                            type: 'string',
                            minLength: 3,
                            maxLength: 100,
                            errorMessage: {
                              minLength: 'Street should be at least 3 characters long.',
                              maxLength: 'Street should not exceed 100 characters.'
                            }
                          },
                          streetNumber: {
                            type: 'string',
                            minLength: 1,
                            maxLength: 10,
                            errorMessage: {
                              minLength: 'Street number is required.',
                              maxLength: 'Street number should not exceed 10 characters.'
                            }
                          },
                          city: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 50,
                            errorMessage: {
                              minLength: 'City should be at least 2 characters long.',
                              maxLength: 'City should not exceed 50 characters.'
                            }
                          },
                          country: {
                            type: 'string',
                            minLength: 2,
                            maxLength: 2,
                            pattern: '^[A-Z]{2}$',
                            errorMessage: {
                              minLength: 'Country code should be exactly 2 characters.',
                              maxLength: 'Country code should be exactly 2 characters.',
                              pattern: 'Invalid country code.'
                            }
                          },
                          isDifferentFromPhysical: {
                            enum: [true],
                            errorMessage: {
                              enum: 'Should be true if physical address is different.'
                            }
                          },
                          physical: {
                            type: 'object',
                            properties: {
                              street: {
                                type: 'string',
                                minLength: 3,
                                maxLength: 100,
                                errorMessage: {
                                  minLength: 'Street should be at least 3 characters long.',
                                  maxLength: 'Street should not exceed 100 characters.'
                                }
                              },
                              streetNumber: {
                                type: 'string',
                                minLength: 1,
                                maxLength: 10,
                                errorMessage: {
                                  minLength: 'Street number is required.',
                                  maxLength: 'Street number should not exceed 10 characters.'
                                }
                              },
                              city: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 50,
                                errorMessage: {
                                  minLength: 'City should be at least 2 characters long.',
                                  maxLength: 'City should not exceed 50 characters.'
                                }
                              },
                              country: {
                                type: 'string',
                                minLength: 2,
                                maxLength: 2,
                                pattern: '^[A-Z]{2}$',
                                errorMessage: {
                                  minLength: 'Country code should be exactly 2 characters.',
                                  maxLength: 'Country code should be exactly 2 characters.',
                                  pattern: 'Invalid country code.'
                                }
                              }
                            },
                            errorMessage: {
                              required: {
                                street: 'Street for physical address is required.',
                                streetNumber: 'Street number for physical address is required.',
                                city: 'City for physical address is required.',
                                country: 'Country for physical address is required.'
                              }
                            }
                          },
                          errorMessage: {
                            required: {
                              street: 'Street is required.',
                              streetNumber: 'Street number is required.',
                              city: 'City is required.',
                              country: 'Country is required.',
                              isDifferentFromPhysical: 'This field is required.',
                              physical: 'Physical address details are required.'
                            }
                          }
                        }
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    required: ['entity']
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
