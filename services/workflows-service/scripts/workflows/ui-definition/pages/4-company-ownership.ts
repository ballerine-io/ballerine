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
                    minItems: 'errorMessage.minItems.ubos',
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
                          minLength: 'errorMessage.minLength.firstName',
                          maxLength: 'errorMessage.maxLength.firstName',
                        },
                      },
                      lastName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'errorMessage.minLength.lastName',
                          maxLength: 'errorMessage.maxLength.lastName',
                        },
                      },
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'errorMessage.format.email',
                          maxLength: 'errorMessage.maxLength.email',
                        },
                      },
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['role', 'dateOfBirth'],
                        errorMessage: {
                          required: {
                            role: 'errorMessage.required.role',
                            dateOfBirth: 'errorMessage.required.dateOfBirth',
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
                        firstName: 'errorMessage.required.firstName',
                        lastName: 'errorMessage.required.lastName',
                        email: 'errorMessage.required.email',
                      },
                    },
                  },
                },
                directors: {
                  type: 'array',
                  minItems: 1,
                  errorMessage: {
                    minItems: 'errorMessage.minItems.directors',
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
                          minLength: 'errorMessage.minLength.firstName',
                          maxLength: 'errorMessage.maxLength.firstName',
                        },
                      },
                      lastName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 50,
                        errorMessage: {
                          minLength: 'errorMessage.minLength.lastName',
                          maxLength: 'errorMessage.maxLength.lastName',
                        },
                      },
                      email: {
                        type: 'string',
                        format: 'email',
                        maxLength: 100,
                        errorMessage: {
                          format: 'errorMessage.format.email',
                          maxLength: 'errorMessage.maxLength.email',
                        },
                      },
                      nationalId: {
                        type: 'string',
                        minLength: 5,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'errorMessage.minLength.nationalId',
                          maxLength: 'errorMessage.maxLength.nationalId',
                        },
                      },
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['role', 'dateOfBirth'],
                        errorMessage: {
                          required: {
                            nationality: 'errorMessage.required.nationality',
                            fullAddress: 'errorMessage.required.fullAddress',
                            role: 'errorMessage.required.role',
                            dateOfBirth: 'errorMessage.required.dateOfBirth',
                          },
                        },
                        properties: {
                          role: {
                            type: 'string',
                          },
                          dateOfBirth: {
                            type: 'string',
                          },
                          fullAddress: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 200,
                            errorMessage: {
                              minLength: 'errorMessage.minLength.fullAddress',
                              maxLength: 'errorMessage.maxLength.fullAddress',
                            },
                          },
                          nationality: {
                            type: 'string',
                            minLength: 1,
                            errorMessage: {
                              minLength: 'errorMessage.minLength.nationality',
                            },
                          },
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'errorMessage.required.firstName',
                        lastName: 'errorMessage.required.lastName',
                        email: 'errorMessage.required.email',
                      },
                    },
                  },
                },
              },
              errorMessage: {
                required: {
                  ubos: 'errorMessage.required.ubos',
                  directors: 'errorMessage.required.directors',
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
  number: 4,
  stateName: 'company_ownership',
  name: 'text.companyOwnership',
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
                text: 'text.companyOwnership',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'text.shareholders',
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
                label: 'text.imShareholder',
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
            descriptionRaw: 'text.shareholdersDescription',
          },
        },
        {
          type: 'json-form',
          name: 'ubos-form',
          valueDestination: 'entity.data.additionalInfo.ubos',
          options: {
            description: 'text.shareholdersDescriptionUbo',
            jsonFormDefinition: {
              title: 'text.shareholder',
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
              titleTemplate: 'text.shareholderTitleTemplate',
            },
            insertionParams: {
              insertionStrategy: 'array',
              destination: 'entity.data.additionalInfo.ubos',
              schema: {
                firstName: 'entity.data.additionalInfo.mainRepresentative.firstName',
                lastName: 'entity.data.additionalInfo.mainRepresentative.lastName',
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
                label: 'text.firstName',
                hint: 'text.hint.firstName',
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
                label: 'text.lastName',
                hint: 'text.hint.lastName',
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
                label: 'text.jobTitle.label',
                hint: 'text.jobTitle.hint',
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
                label: 'text.dateOfBirth.label',
                hint: 'text.dateOfBirth.hint',
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
                label: 'text.email.label',
                hint: 'text.email.hint',
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
            text: 'UBOs',
            classNames: ['padding-top-10'],
          },
        },
        {
          type: 'description',
          options: {
            descriptionRaw: 'text.shareholdersDescription',
          },
        },
        {
          type: 'json-form',
          elements: [
            {
              type: 'checkbox',
              name: 'im-director-checkbox',
              valueDestination: 'entity.data.additionalInfo.imDirector',
              options: {
                jsonFormDefinition: {
                  type: 'boolean',
                },
                label: 'text.imDirector',
                uiSchema: {
                  'ui:label': false,
                },
              },
            },
          ],
        },
        {
          type: 'json-form',
          name: 'directors-form',
          valueDestination: 'entity.data.additionalInfo.directors',
          options: {
            description: 'text.directorsDescription',
            jsonFormDefinition: {
              title: 'Shareholder',
              type: 'array',
              required: [
                'directors:first-name-input',
                'directors:last-name-input',
                'directors:nationality-input',
                'directors:title-input',
                'directors:identity-number-input',
                'directors:email-input',
                'directors:date-of-birth-input',
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
              ],
              insertWhen: [
                {
                  type: 'json-logic',
                  value: {
                    '==': [{ var: 'entity.data.additionalInfo.imDirector' }, true],
                  },
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
              valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].firstName', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'text.firstName',
                hint: 'text.hint.firstName',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'directors:last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].lastName',
              options: {
                label: 'text.lastName',
                hint: 'text.hint.lastName',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'directors:title-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.directors[{INDEX}].additionalInfo.role',
              options: {
                label: 'text.jobTitle.label',
                hint: 'text.jobTitle.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'directors:date-of-birth-input',
              type: 'json-form:date',
              valueDestination:
                'entity.data.additionalInfo.directors[{INDEX}].additionalInfo.dateOfBirth',
              options: {
                label: 'text.dateOfBirth.label',
                hint: 'text.dateOfBirth.hint',
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
                label: 'text.nationality',
                hint: 'text.choose',
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
                label: 'text.nationalId.label',
                hint: 'text.nationalId.hint',
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
                label: 'text.nationalId.label',
                hint: 'text.nationalId.hint',
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
                label: 'text.addressOfResidence.label',
                hint: 'text.addressOfResidence.hint',
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
                label: 'text.email.label',
                hint: 'text.email.hint',
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
