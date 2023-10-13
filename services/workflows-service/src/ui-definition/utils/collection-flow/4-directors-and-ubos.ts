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
              required: ['ubos', 'directors'],
              properties: {
                ubos: {
                  type: 'array',
                  items: {
                    type: 'object',
                    required: [
                      'firstName',
                      'lastName',
                      'nationality',
                      'identityNumber',
                      'email',
                      'fullAddress',
                      'percentageOfOwnership',
                    ],
                    minItems: 1,
                    properties: {
                      firstName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'First name should be at least 2 characters long.',
                          maxLength: 'First name should not exceed 50 characters.',
                        },
                      },
                      lastName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'Last name should be at least 2 characters long.',
                          maxLength: 'Last name should not exceed 50 characters.',
                        },
                      },
                      nationality: {
                        type: 'string',
                        minLength: 1,
                        errorMessage: {
                          minLength:
                            'Invalid nationality. Please select from the available options.',
                        },
                      },
                      identityNumber: {
                        type: 'string',
                        minLength: 5,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'Identity number should be at least 5 characters long.',
                          maxLength: 'Identity number should not exceed 20 characters.',
                        },
                      },
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'Invalid email address.',
                          maxLength: 'Email should not exceed 100 characters.',
                        },
                      },
                      fullAddress: {
                        type: 'string',
                        minLength: 10,
                        maxLength: 200,
                        errorMessage: {
                          minLength: 'Full address should be at least 10 characters long.',
                          maxLength: 'Full address should not exceed 200 characters.',
                        },
                      },
                      percentageOfOwnership: {
                        type: 'number',
                        minimum: 25,
                        maximum: 100,
                        errorMessage: {
                          minimum: 'Percentage of ownership must be 25 or greater.',
                          maximum: 'Percentage of ownership must not exceed 100.',
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        nationality: 'Nationality is required.',
                        identityNumber: 'Identity number is required.',
                        email: 'Email is required.',
                        fullAddress: 'Full address is required.',
                        percentageOfOwnership: 'Percentage of ownership is required.',
                      },
                    },
                  },
                },
                directors: {
                  type: 'array',
                  minItems: 1,
                  items: {
                    type: 'object',
                    required: [
                      'firstName',
                      'lastName',
                      'nationality',
                      'identityNumber',
                      'email',
                      'fullAddress',
                    ],
                    properties: {
                      firstName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'First name should be at least 2 characters long.',
                          maxLength: 'First name should not exceed 50 characters.',
                        },
                      },
                      lastName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'Last name should be at least 2 characters long.',
                          maxLength: 'Last name should not exceed 50 characters.',
                        },
                      },
                      nationality: {
                        type: 'string',
                        minLength: 1,
                        errorMessage: {
                          minLength:
                            'Invalid nationality. Please select from the available options.',
                        },
                      },
                      identityNumber: {
                        type: 'string',
                        minLength: 5,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'Identity number should be at least 5 characters long.',
                          maxLength: 'Identity number should not exceed 20 characters.',
                        },
                      },
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'Invalid email address.',
                          maxLength: 'Email should not exceed 100 characters.',
                        },
                      },
                      fullAddress: {
                        type: 'string',
                        minLength: 10,
                        maxLength: 200,
                        errorMessage: {
                          minLength: 'Full address should be at least 10 characters long.',
                          maxLength: 'Full address should not exceed 200 characters.',
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        nationality: 'Nationality is required.',
                        identityNumber: 'Identity number is required.',
                        email: 'Email is required.',
                        fullAddress: 'Full address is required.',
                      },
                    },
                  },
                },
              },
              errorMessage: {
                required: {
                  ubos: 'UBOs are required.',
                  directors: 'Directors are required.',
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
export const DirectorsAndUbosPage = {
  type: 'page',
  number: 4,
  stateName: 'directors_and_ubos',
  name: 'Directors and UBOs',
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
                text: 'Directors & UBOs',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'UBOs',
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['im-shareholder-checkbox'],
            },
          },
          elements: [
            {
              type: 'checkbox',
              name: 'im-shareholder-checkbox',
              valueDestination: 'entity.data.additionalInfo.imShareholder',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                },
                label: 'I own 25% or more of the company',
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'description',
          name: 'checkbox-description-1',
          options: {
            descriptionRaw: 'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.'
          }
        },
        {
          type: 'json-form',
          valueDestination: 'entity.data.additionalInfo.ubos',
          options: {
            description:
              '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              type: 'array',
              required: [
                'ubos:first-name-input',
                'ubos:last-name-input',
                'ubos:nationality-input',
                'ubos:identity-number-input',
                'ubos:email-input',
                'ubos:address-of-residence-input',
              ],
            },
            dataCreation: {
              createWhenHidden: true,
              destination: 'entity.data.additionalInfo.ubos',
              schema: {
                'entity.data.additionalInfo.ubos[0].firstName':
                  'entity.data.additionalInfo.mainRepresentative.firstName',
                'entity.data.additionalInfo.ubos[0].lastName':
                  'entity.data.additionalInfo.mainRepresentative.lastName',
              },
              insertRules: [
                {
                  type: 'json-logic',
                  value: { '==': [{ var: 'entity.data.additionalInfo.imShareholder' }, true] },
                },
              ],
              deleteRules: [
                {
                  type: 'json-logic',
                  value: {
                    if: [
                      {
                        var: 'entity.data.additionalInfo.imShareholder',
                      },
                      false,
                      true,
                    ],
                  },
                },
              ],
            },
          },
          elements: [
            {
              name: 'ubos:first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.firstName', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'Legal Name',
                hint: 'First Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.lastName',
              options: {
                label: 'Last Name',
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:nationality-input',
              type: 'nationality-picker',
              valueDestination: 'entity.data.additionalInfo.ubos.nationality',
              options: {
                label: 'Nationality',
                hint: 'Chinese',
                jsonFormDefinition: {
                  type: 'string'
                },
                uiSchema: {
                  'ui:field': 'NationalityPicker'
                }
              },
            },
            {
              name: 'ubos:identity-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.identityNumber',
              options: {
                label: 'Identity Number',
                hint: '11010219820519759X',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:email-input',
              type: 'json-form:email',
              valueDestination: 'entity.data.additionalInfo.ubos.email',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  format: 'email',
                },
                label: 'Email',
                hint: 'name@companyhk.com',
              },
            },
            {
              name: 'ubos:address-of-residence-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.fullAddress',
              options: {
                label: 'Address of Residence',
                hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:ownership-percentage-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.percentageOfOwnership',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: '% of Ownership',
                hint: '25',
              },
            },
          ],
        },
        {
          type: 'h3',
          options: {
            text: 'Directors',
            classNames: ['padding-top-10'],
          },
        },
        {
          type: 'container',
          elements: [
            {
              type: 'json-form',
              options: {
                jsonFormDefinition: {
                  required: ['im-director-checkbox'],
                },
              },
              elements: [
                {
                  type: 'checkbox',
                  name: 'im-director-checkbox',
                  valueDestination: 'entity.data.additionalInfo.imDirector',
                  options: {
                    jsonFormDefinition: {
                      type: 'boolean',
                    },
                    label: "I'm director of the company",
                    uiSchema: {
                      'ui:label': false,
                    },
                  },
                },
              ],
            },
            {
              type: 'description',
              name: 'checkbox-description-2',
              options: {
                descriptionRaw: 'Add all of the directors of the company.'
              }
            },
            {
              name: 'directors-component',
              type: 'json-form',
              valueDestination: 'entity.data.additionalInfo.directors',
              options: {
                description: '<p>Add all the directors of the company.</p>',
                jsonFormDefinition: {
                  type: 'array',
                  required: [
                    'directors:first-name-input',
                    'directors:last-name-input',
                    'directors:nationality-input',
                    'directors:identity-number-input',
                    'directors:email-input',
                    'directors:address-of-residence-input',
                  ],
                },
                dataCreation: {
                  destination: 'entity.data.additionalInfo.directors',
                  createWhenHidden: true,
                  schema: {
                    'entity.data.additionalInfo.directors[0].firstName':
                      'entity.data.additionalInfo.mainRepresentative.firstName',
                    'entity.data.additionalInfo.directors[0].lastName':
                      'entity.data.additionalInfo.mainRepresentative.lastName',
                  },
                  insertRules: [
                    {
                      type: 'json-logic',
                      value: { '==': [{ var: 'entity.data.additionalInfo.imDirector' }, true] },
                    },
                  ],
                  deleteRules: [
                    {
                      type: 'json-logic',
                      value: {
                        if: [
                          {
                            var: 'entity.data.additionalInfo.imDirector',
                          },
                          false,
                          true,
                        ],
                      },
                    },
                  ],
                },
              },
              elements: [
                {
                  name: 'directors:first-name-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.firstName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Legal Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'directors:last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.lastName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Last Name',
                    hint: 'Last Name',
                  },
                },
                {
                  name: 'directors:nationality-input',
                  type: 'nationality-picker',
                  valueDestination: 'entity.data.additionalInfo.directors.nationality',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    uiSchema: {
                      'ui:field': 'NationalityPicker'
                    },
                    label: 'Nationality',
                    hint: 'Chinese',
                  },
                },
                {
                  name: 'directors:identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.identityNumber',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Identity Number',
                    hint: '11010219820519759X',
                  },
                },
                {
                  name: 'directors:address-of-residence-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.fullAddress',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Address of Residence',
                    hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                  },
                },
                {
                  name: 'directors:email-input',
                  type: 'json-form:email',
                  valueDestination: 'entity.data.additionalInfo.directors.email',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                      format: 'email',
                    },
                    label: 'Email',
                    hint: 'name@companyhk.com',
                  },
                },
              ],
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
              type: 'json-form:button',
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
          ]
        }
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
