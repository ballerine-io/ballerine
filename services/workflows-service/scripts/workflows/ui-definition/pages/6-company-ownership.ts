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
                    required: ['firstName', 'lastName', 'email'],
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
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['role', 'dateOfBirth'],
                        errorMessage: {
                          required: {
                            role: 'Title is required.',
                            dateOfBirth: 'Date of Birth is required.',
                          },
                        },
                        properties: {
                          role: {
                            type: 'string',
                          },
                          dateOfBirth: {
                            type: 'string',
                          },
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        email: 'Email is required.',
                      },
                    },
                  },
                },
                directors: {
                  type: 'array',
                  minItems: 1,
                  errorMessage: {
                    minItems: 'UBOs are required.',
                  },
                  items: {
                    type: 'object',
                    required: ['firstName', 'lastName', 'email'],
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
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['role', 'dateOfBirth'],
                        errorMessage: {
                          required: {
                            role: 'Title is required.',
                            dateOfBirth: 'Date of Birth is required.',
                          },
                        },
                        properties: {
                          role: {
                            type: 'string',
                          },
                          dateOfBirth: {
                            type: 'string',
                          },
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'First name is required.',
                        lastName: 'Last name is required.',
                        email: 'Email is required.',
                      },
                    },
                  },
                },
              },
              errorMessage: {
                required: {
                  ubos: 'UBOs are required.',
                  directors: 'directors are required.',
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

export const CompanyOwnershipPage = {
  type: 'page',
  number: 6,
  stateName: 'company_ownership',
  name: 'Company Ownership',
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
                text: 'Company Ownership',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'Shareholders',
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
                'ubos:title-input',
                'ubos:email-input',
                'ubos:date-of-birth-input',
              ],
            },
            uiSchema: {
              titleTemplate: 'Shareholder {{INDEX}}',
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
                  value: {
                    '==': [{ var: 'entity.data.additionalInfo.imShareholder' }, true],
                  },
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
              name: 'ubos:title-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.role',
              options: {
                label: 'Title',
                hint: 'CEO / Manager / Partner',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:date-of-birth-input',
              type: 'json-form:date',
              valueDestination:
                'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.dateOfBirth',
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
          ],
        },
        {
          type: 'divider',
        },
        {
          type: 'h3',
          options: {
            text: 'Associated companies',
            classNames: ['padding-top-10'],
          },
        },
        {
          type: 'description',
          options: {
            descriptionRaw: 'Add all companies that own more than 25% of the company.',
          },
        },
        {
          type: 'json-form',
          elements: [
            {
              type: 'checkbox',
              name: 'there-no-companies-with-more-than-25',
              valueDestination: 'entity.data.additionalInfo.thereNoCompaniesWithMoreThan25',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                },
                label: 'There are no companies with more than 25%',
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          name: 'companies-form',
          valueDestination: 'entity.data.additionalInfo.companies',
          options: {
            description:
              '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              title: 'Shareholder',
              type: 'array',
              required: [
                'companies:first-name-input',
                'companies:last-name-input',
                'companies:title-input',
                'companies:email-input',
                'companies:date-of-birth-input',
              ],
            },
            uiSchema: {
              titleTemplate: 'Associated company {{INDEX}}',
            },
          },
          elements: [
            {
              name: 'companies:first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.companies[{INDEX}].firstName', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'First Name',
                hint: 'First Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'companies:last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.companies[{INDEX}].lastName',
              options: {
                label: 'Last Name',
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'companies:title-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.companies[{INDEX}].additionalInfo.role',
              options: {
                label: 'Title',
                hint: 'CEO / Manager / Partner',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'companies:date-of-birth-input',
              type: 'json-form:date',
              valueDestination:
                'entity.data.additionalInfo.companies[{INDEX}].additionalInfo.dateOfBirth',
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
              name: 'companies:email-input',
              type: 'json-form:email',
              valueDestination: 'entity.data.additionalInfo.companies[{INDEX}].email',
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
