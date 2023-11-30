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
                        required: ['nationality', 'fullAddress', 'percentageOfOwnership'],
                        errorMessage: {
                          required: {
                            nationality: 'errorMessage.required.nationality',
                            fullAddress: 'errorMessage.required.fullAddress',
                            percentageOfOwnership: 'errorMessage.required.percentageOfOwnership',
                          },
                        },
                        properties: {
                          nationality: {
                            type: 'string',
                            minLength: 1,
                            errorMessage: {
                              minLength: 'errorMessage.minLength.nationality',
                            },
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
                          percentageOfOwnership: {
                            type: 'number',
                            minimum: 25,
                            maximum: 100,
                            errorMessage: {
                              minimum: 'errorMessage.minimum.percentageOfOwnership',
                              maximum: 'errorMessage.maximum.percentageOfOwnership',
                            },
                          },
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'errorMessage.required.firstName',
                        lastName: 'errorMessage.required.lastName',
                        nationalId: 'errorMessage.required.nationalId',
                        email: 'errorMessage.required.email',
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
                        required: ['nationality', 'fullAddress'],
                        errorMessage: {
                          required: {
                            nationality: 'error.required.nationality',
                            fullAddress: 'error.required.fullAddress',
                            percentageOfOwnership: 'error.required.percentageOfOwnership',
                          },
                        },
                        properties: {
                          nationality: {
                            type: 'string',
                            minLength: 1,
                            errorMessage: {
                              minLength: 'error.minLength.nationality',
                            },
                          },
                          fullAddress: {
                            type: 'string',
                            minLength: 10,
                            maxLength: 200,
                            errorMessage: {
                              minLength: 'error.minLength.fullAddress',
                              maxLength: 'error.maxLength.fullAddress',
                            },
                          },
                        },
                      },
                    },
                    errorMessage: {
                      required: {
                        firstName: 'error.required.firstName',
                        lastName: 'error.required.lastName',
                        nationalId: 'error.required.nationalId',
                        email: 'error.required.email',
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

export const DirectorsAndUbosPage = {
  type: 'page',
  number: 4,
  stateName: 'directors_and_ubos',
  name: 'text.directorsAndUBOs',
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
                text: 'text.directors&UBOs',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'text.ubos',
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
            description:
              '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              title: 'text.shareholder',
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
              titleTemplate: 'text.uboIndex',
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
                label: 'text.firstName',
                hint: 'text.firstName',
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
                hint: 'text.lastName',
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
                label: 'text.nationality',
                hint: 'text.choose',
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
                label: 'text.nationalId.label',
                hint: 'text.nationalId.hint',
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
                label: 'text.email.label',
                hint: 'text.email.hint',
              },
            },
            {
              name: 'ubos:address-of-residence-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.fullAddress',
              options: {
                label: 'text.addressOfResidence.label',
                hint: 'text.addressOfResidence.hint',
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
                label: 'text.ownershipPercentage.label',
                hint: 'text.ownershipPercentage.hint',
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
            text: 'text.directors',
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
                    label: 'text.imDirector',
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
                descriptionRaw: 'text.directorsDescription',
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
                  titleTemplate: 'text.directorIndex',
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
                    label: 'text.firstName',
                    hint: 'text.firstName',
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
                    label: 'text.lastName',
                    hint: 'text.lastName',
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
