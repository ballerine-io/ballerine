const validationSchema = {
  type: 'object',
  required: ['entity'],
  properties: {
    entity: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          required: ['additionalInfo'],
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['mainRepresentative', 'iHaveSigningAuthority'],
              default: {},
              errorMessage: {
                required: {
                  iHaveSigningAuthority: 'errorMessage.required.iHaveSigningAuthority',
                },
              },
              properties: {
                mainRepresentative: {
                  type: 'object',
                  required: ['phone', 'dateOfBirth', 'firstName', 'lastName', 'additionalInfo'],
                  errorMessage: {
                    required: {
                      phone: 'errorMessage.required.phone',
                      dateOfBirth: 'errorMessage.required.dateOfBirth',
                      firstName: 'errorMessage.required.firstName',
                      lastName: 'errorMessage.required.lastName',
                      additionalInfo: 'errorMessage.required.additionalInfo',
                    },
                  },
                  properties: {
                    phone: {
                      type: 'string',
                      pattern: '^[+]?[0-9]{10,15}$',
                      errorMessage: {
                        pattern: 'errorMessage.pattern.phone',
                      },
                    },
                    dateOfBirth: {
                      type: 'string',
                      errorMessage: {
                        type: 'errorMessage.type.dateOfBirth',
                      },
                    },
                    firstName: {
                      type: 'string',
                      minLength: 2,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.firstName',
                      },
                    },
                    lastName: {
                      type: 'string',
                      minLength: 2,
                      errorMessage: {
                        minLength: 'errorMessage.minLength.lastName',
                      },
                    },
                    additionalInfo: {
                      type: 'object',
                      required: ['jobTitle'],
                      default: {},
                      errorMessage: {
                        required: {
                          jobTitle: 'errorMessage.required.jobTitle',
                        },
                      },
                      properties: {
                        jobTitle: {
                          type: 'string',
                          minLength: 2,
                          errorMessage: {
                            minLength: 'errorMessage.minLength.jobTitle',
                          },
                        },
                      },
                    },
                  },
                },
                iHaveSigningAuthority: {
                  type: 'boolean',
                  enum: [true],
                  errorMessage: {
                    enum: 'errorMessage.required.iHaveSigningAuthority',
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};

export const PersonalInfoPage = {
  type: 'page',
  name: 'text.personalDetails',
  number: 1,
  stateName: 'personal_details',
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
                text: 'text.personalInformation',
              },
            },
          ],
        },
        {
          type: 'json-form',
          valueDestination: 'entity.data.additionalInfo.mainRepresentative',
          name: 'json-form:personal-information',
          options: {
            jsonFormDefinition: {
              required: [
                'first-name-input',
                'last-name-input',
                'job-title-input',
                'date-of-birth-input',
                'phone-number-input',
              ],
            },
          },
          availableOn: [
            {
              type: 'json-schema',
              value: validationSchema,
            },
          ],
          elements: [
            {
              name: 'first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.firstName',
              options: {
                label: 'text.name',
                hint: 'text.firstName',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.lastName',
              options: {
                hint: 'text.lastName',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'job-title-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle',
              options: {
                label: 'text.jobTitle.label',
                hint: 'text.jobTitle.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'date-of-birth-input',
              type: 'json-form:date',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.dateOfBirth',
              options: {
                label: 'text.dateOfBirth.label',
                hint: 'text.dateHint',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'DateInput',
                  'ui:label': true,
                },
              },
            },
            {
              name: 'phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.phone',
              options: {
                label: 'text.phoneNumber',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'PhoneInput',
                  'ui:label': true,
                },
              },
            },
            {
              name: 'authority-checkbox',
              type: 'authority-checkbox',
              valueDestination: 'entity.data.additionalInfo.iHaveSigningAuthority',
              options: {
                label: 'text.iHaveAuthority.label',
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
      type: 'definitionPlugin',
      params: {
        pluginName: 'update_end_user',
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
