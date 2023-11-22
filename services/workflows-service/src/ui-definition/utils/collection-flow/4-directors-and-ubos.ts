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
                  minItems: 1,
                  errorMessage: {
                    minItems: 'UBOs are required.',
                  },
                  items: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'nationalId', 'email'],
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
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'Invalid email address.',
                          maxLength: 'Email should not exceed 100 characters.',
                        },
                      },
                      nationalId: {
                        type: 'string',
                        minLength: 5,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'Identity number should be at least 5 characters long.',
                          maxLength: 'Identity number should not exceed 20 characters.',
                        },
                      },
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['nationality', 'fullAddress', 'percentageOfOwnership'],
                        errorMessage: {
                          required: {
                            nationality: 'Nationality is required.',
                            fullAddress: 'Full address is required.',
                            percentageOfOwnership: 'Percentage of ownership is required.',
                          },
                        },
                        properties: {
                          nationality: {
                            type: 'string',
                            minLength: 1,
                            errorMessage: {
                              minLength:
                                'Invalid nationality. Please select from the available options.',
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
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        nationalId: 'Identity number is required.',
                        email: 'Email is required.',
                      },
                    },
                  },
                },
                directors: {
                  type: 'array',
                  minItems: 1,
                  errorMessage: {
                    minItems: 'Directors are required.',
                  },
                  items: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'nationalId', 'email'],
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
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'Invalid email address.',
                          maxLength: 'Email should not exceed 100 characters.',
                        },
                      },
                      nationalId: {
                        type: 'string',
                        minLength: 5,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'Identity number should be at least 5 characters long.',
                          maxLength: 'Identity number should not exceed 20 characters.',
                        },
                      },
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['nationality', 'fullAddress'],
                        errorMessage: {
                          required: {
                            nationality: 'Nationality is required.',
                            fullAddress: 'Full address is required.',
                            percentageOfOwnership: 'Percentage of ownership is required.',
                          },
                        },
                        properties: {
                          nationality: {
                            type: 'string',
                            minLength: 1,
                            errorMessage: {
                              minLength:
                                'Invalid nationality. Please select from the available options.',
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
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        nationalId: 'Identity number is required.',
                        email: 'Email is required.',
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
            descriptionRaw:
              'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.',
          },
        },
        {
          type: 'json-form',
          name: 'ubos-form',
          valueDestination: 'entity.data.additionalInfo.ubos',
          options: {
            description:
              '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              title: 'Shareholder',
              type: 'array',
              required: [
                'ubos:first-name-input',
                'ubos:last-name-input',
                'ubos:nationality-input',
                'ubos:identity-number-input',
                'ubos:email-input',
                'ubos:ownership-percentage-input',
                'ubos:address-of-residence-input',
              ],
            },
            uiSchema: {
              titleTemplate: 'UBO {{INDEX}}',
            },
            insertionParams: {
              insertionStrategy: 'array',
              destination: 'entity.data.additionalInfo.ubos',
              schema: {
                firstName: 'entity.data.additionalInfo.mainRepresentative.firstName',
                lastName: 'entity.data.additionalInfo.mainRepresentative.lastName',
                email: 'entity.data.additionalInfo.mainRepresentative.email',
              },
              bindingAnchorDestination: 'additionalInfo.__isGeneratedAutomatically',
              disableElements: [
                {
                  elementName: 'ubos:first-name-input',
                  atIndex: 0,
                },
                {
                  elementName: 'ubos:last-name-input',
                  atIndex: 0,
                },
                {
                  elementName: 'ubos:email-input',
                  atIndex: 0,
                },
              ],
              insertWhen: [
                {
                  type: 'json-logic',
                  value: { '==': [{ var: 'entity.data.additionalInfo.imShareholder' }, true] },
                },
              ],
              removeWhen: [
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
              valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].firstName', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'First Name',
                hint: 'First Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].lastName',
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
              valueDestination:
                'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.nationality',
              options: {
                label: 'Nationality',
                hint: 'Choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'NationalityPicker',
                },
              },
            },
            {
              name: 'ubos:identity-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].nationalId',
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
              valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].email',
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
              valueDestination:
                'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.fullAddress',
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
              valueDestination:
                'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.percentageOfOwnership',
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
          type: 'divider',
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
                descriptionRaw: 'Add all of the directors of the company.',
              },
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
                uiSchema: {
                  titleTemplate: 'Director {{INDEX}}',
                },
                insertionParams: {
                  insertionStrategy: 'array',
                  destination: 'entity.data.additionalInfo.directors',
                  schema: {
                    firstName: 'entity.data.additionalInfo.mainRepresentative.firstName',
                    lastName: 'entity.data.additionalInfo.mainRepresentative.lastName',
                    email: 'entity.data.additionalInfo.mainRepresentative.email',
                  },
                  bindingAnchorDestination: 'additionalInfo.__isGeneratedAutomatically',
                  disableElements: [
                    {
                      elementName: 'directors:first-name-input',
                      atIndex: 0,
                    },
                    {
                      elementName: 'directors:last-name-input',
                      atIndex: 0,
                    },
                    {
                      elementName: 'directors:email-input',
                      atIndex: 0,
                    },
                  ],
                  insertWhen: [
                    {
                      type: 'json-logic',
                      value: { '==': [{ var: 'entity.data.additionalInfo.imDirector' }, true] },
                    },
                  ],
                  removeWhen: [
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
                  valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].firstName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'First Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'directors:last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].lastName',
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
                  valueDestination:
                    'entity.data.additionalInfo.directors[{INDEX}].additionalInfo.nationality',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    uiSchema: {
                      'ui:field': 'NationalityPicker',
                    },
                    label: 'Nationality',
                    hint: 'Choose',
                  },
                },
                {
                  name: 'directors:identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].nationalId',
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
                  valueDestination:
                    'entity.data.additionalInfo.directors[{INDEX}].additionalInfo.fullAddress',
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
                  valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].email',
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
            {
              type: 'divider',
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
