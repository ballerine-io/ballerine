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
                  iHaveSigningAuthority: 'This field is required.',
                },
              },
              properties: {
                mainRepresentative: {
                  type: 'object',
                  required: ['phone', 'dateOfBirth', 'firstName', 'lastName', 'additionalInfo'],
                  errorMessage: {
                    required: {
                      phone: 'A valid phone number is required.',
                      dateOfBirth: 'Date of birth is required.',
                      firstName: 'First name is required.',
                      lastName: 'Last name is required.',
                      additionalInfo: 'Additional information is required.',
                    },
                  },
                  properties: {
                    phone: {
                      type: 'string',
                      pattern: '^[+]?[0-9]{10,15}$',
                      errorMessage: {
                        pattern:
                          'Phone number must be 10 to 15 digits long and may start with a +.',
                      },
                    },
                    dateOfBirth: {
                      type: 'string',
                      errorMessage: {
                        type: 'Date of birth must be a string.',
                      },
                    },
                    firstName: {
                      type: 'string',
                      minLength: 2,
                      errorMessage: {
                        minLength: 'First name must be at least 2 characters long.',
                      },
                    },
                    lastName: {
                      type: 'string',
                      minLength: 2,
                      errorMessage: {
                        minLength: 'Last name must be at least 2 characters long.',
                      },
                    },
                    additionalInfo: {
                      type: 'object',
                      required: ['jobTitle'],
                      default: {},
                      errorMessage: {
                        required: {
                          jobTitle: 'Job title is a required',
                        },
                      },
                      properties: {
                        jobTitle: {
                          type: 'string',
                          minLength: 2,
                          errorMessage: {
                            minLength: 'Job title must be at least 2 characters long.',
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
                    enum: 'This field is required.',
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
  name: 'Personal details',
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
                text: 'Personal information',
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
                label: 'Name',
                hint: 'First Name',
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
                hint: 'Last Name',
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
                label: 'Title',
                hint: 'CEO / Manager / Partner',
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
                label: 'Date of Birth',
                hint: 'DD/MM/YYYY',
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
                label: 'Phone number',
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
                label: 'I have the signing authority for this company',
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
