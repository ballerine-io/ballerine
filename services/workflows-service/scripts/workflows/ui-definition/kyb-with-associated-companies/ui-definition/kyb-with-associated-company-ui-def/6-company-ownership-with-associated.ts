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
              default: {},
              if: {
                properties: {
                  thereNoCompaniesWithMoreThan25: {
                    enum: [true],
                  },
                },
              },
              then: {
                required: ['ubos'],
                errorMessage: {
                  required: {
                    ubos: 'errorMessage.required.ubos',
                  },
                },
              },
              else: {
                required: ['ubos', 'associatedCompanies'],
                properties: {
                  associatedCompanies: {
                    minItems: 1,
                  },
                },
                errorMessage: {
                  required: {
                    ubos: 'errorMessage.required.ubos',
                    associatedCompanies: 'errorMessage.required.companies',
                  },
                },
              },
              properties: {
                thereNoCompaniesWithMoreThan25: {
                  type: 'boolean',
                  default: false,
                },
                ubos: {
                  type: 'array',
                  minItems: 1,
                  errorMessage: {
                    minItems: 'errorMessage.required.ubos',
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
                            role: 'errorMessage.error.requiredField',
                            dateOfBirth: 'errorMessage.error.requiredField',
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
                associatedCompanies: {
                  type: 'array',
                  errorMessage: {
                    minItems: 'errorMessage.required.companies',
                  },
                  items: {
                    type: 'object',
                    required: ['registrationNumber', 'country', 'companyName'],
                    errorMessage: {
                      required: {
                        registrationNumber: 'errorMessage.required.companyRegistrationNumber',
                        country: 'errorMessage.required.country',
                        companyName: 'errorMessage.required.companyName',
                      },
                    },
                    properties: {
                      registrationNumber: {
                        type: 'string',
                        minLength: 4,
                        maxLength: 20,
                        errorMessage: {
                          minLength: 'errorMessage.minLength.companyRegistrationNumber',
                          maxLength: 'errorMessage.maxLength.companyRegistrationNumber',
                        },
                      },
                      country: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 2,
                        pattern: '^[A-Z]{2}$',
                        errorMessage: {
                          minLength: 'errorMessage.minLength.country',
                          maxLength: 'errorMessage.maxLength.country',
                          pattern: 'errorMessage.maxLength.pattern',
                        },
                      },
                      companyName: {
                        type: 'string',
                        minLength: 2,
                        maxLength: 100,
                        errorMessage: {
                          minLength: 'errorMessage.minLength.companyName',
                          maxLength: 'errorMessage.maxLength.companyName',
                        },
                      },
                      additionalInfo: {
                        type: 'object',
                        default: {},
                        required: ['associationRelationship', 'mainRepresentative'],
                        errorMessage: {
                          required: {
                            associationRelationship: 'errorMessage.error.requiredField',
                            mainRepresentative: 'errorMessage.error.requiredField',
                          },
                        },
                        properties: {
                          associationRelationship: {
                            type: 'string',
                          },
                          mainRepresentative: {
                            type: 'object',
                            default: {},
                            required: ['firstName', 'lastName', 'email'],
                            errorMessage: {
                              required: {
                                firstName: 'errorMessage.required.firstName',
                                lastName: 'errorMessage.required.lastName',
                                email: 'errorMessage.required.email',
                              },
                            },
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
  },
  required: ['entity'],
};

export const CompanyOwnershipWithAssociatedCPage = {
  type: 'page',
  number: 6,
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
            description: 'text.shareholdersDescription',
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
            text: 'text.associatedCompanies',
            classNames: ['padding-top-10'],
          },
        },
        {
          type: 'description',
          options: {
            descriptionRaw: 'text.associatedCompaniesDescription',
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
                label: 'text.noCompaniesWithMoreThan',
                uiSchema: {
                  'ui:label': false,
                },
              },
              availableOn: [
                {
                  type: 'json-logic',
                  value: {
                    if: [
                      {
                        '>=': [
                          {
                            var: 'entity.data.additionalInfo.associatedCompanies.length',
                          },
                          1,
                        ],
                      },
                      false,
                      true,
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'json-form',
          name: 'companies-form',
          valueDestination: 'entity.data.additionalInfo.associatedCompanies',
          options: {
            description: 'text.shareholdersDescription',
            jsonFormDefinition: {
              title: 'text.shareholder',
              type: 'array',
              required: [
                'associatedCompanies:company-registration-number-input',
                'associatedCompanies:company-country-input',
                'associatedCompanies:company-legal-name-input',
                'associatedCompanies:company-association-relationship-input',
                'associatedCompanies:company-main-representative-first-name-input',
                'associatedCompanies:company-main-representative-last-name-input',
                'associatedCompanies:company-main-representative-email-input',
              ],
            },
            uiSchema: {
              titleTemplate: 'text.associatedCompanyIndex',
            },
            canAdd: [
              {
                type: 'json-logic',
                value: {
                  '!==': [
                    {
                      var: 'entity.data.additionalInfo.thereNoCompaniesWithMoreThan25',
                    },
                    true,
                    false,
                  ],
                },
              },
            ],
          },
          elements: [
            {
              name: 'associatedCompanies:company-registration-number-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].registrationNumber', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'text.companyRegistrationNumber.label',
                hint: 'text.companyRegistrationNumber.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'associatedCompanies:company-country-input',
              type: 'dropdown',
              valueDestination: 'entity.data.additionalInfo.associatedCompanies[{INDEX}].country',
              options: {
                label: 'text.registeredCountry.label',
                hint: 'text.registeredCountry.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                },
              },
            },
            {
              name: 'associatedCompanies:company-legal-name-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].companyName',
              options: {
                label: 'text.companyLegalName.label',
                hint: 'text.companyLegalName.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'associatedCompanies:company-association-relationship-input',
              type: 'json-form:date',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.associationRelationship',
              options: {
                label: 'text.relationship.label',
                hint: 'text.relationship.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'RelationshipDropdown',
                  'ui:label': true,
                },
                companyNameDestination: 'entity.data.companyName',
              },
            },
            {
              name: 'associatedCompanies:company-main-representative-first-name-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.firstName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.representativeFirstName.label',
                hint: 'text.representativeFirstName.hint',
              },
            },
            {
              name: 'associatedCompanies:company-main-representative-last-name-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.lastName',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.representativeLastName.label',
                hint: 'text.representativeLastName.hint',
              },
            },
            {
              name: 'associatedCompanies:company-main-representative-email-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.email',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'text.representativeEmail.label',
                hint: 'text.representativeEmail.hint',
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
