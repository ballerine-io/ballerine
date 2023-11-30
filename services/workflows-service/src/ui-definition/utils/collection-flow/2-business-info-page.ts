const validationSchema = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          required: [
            'additionalInfo',
            'businessType',
            'numberOfEmployees',
            'taxIdentificationNumber',
            'companyName',
            'country',
            'registrationNumber',
          ],
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['registeredCapitalInUsd'],
              properties: {
                registeredCapitalInUsd: {
                  type: 'number',
                  minimum: 0,
                  errorMessage: {
                    required: 'errorMessage.required.registeredCapitalInUsd',
                    minimum: 'errorMessage.minimum.registeredCapitalInUsd',
                  },
                },
              },
              errorMessage: {
                required: {
                  registeredCapitalInUsd: 'errorMessage.required.registeredCapitalInUsd',
                },
              },
            },
            businessType: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              errorMessage: {
                minLength: 'errorMessage.minLength.businessType',
                maxLength: 'errorMessage.maxLength.businessType',
                required: 'errorMessage.required.businessType',
              },
            },
            numberOfEmployees: {
              type: 'number',
              minimum: 1,
              maximum: 100000,
              errorMessage: {
                type: 'errorMessage.type.numberOfEmployees',
                required: 'errorMessage.required.numberOfEmployees',
                minimum: 'errorMessage.minimum.numberOfEmployees',
                maximum: 'errorMessage.maximum.numberOfEmployees',
              },
            },
            taxIdentificationNumber: {
              type: 'string',
              minLength: 8,
              maxLength: 15,
              pattern: '^[^\\s]*$',
              errorMessage: {
                minLength: 'errorMessage.minLength.taxIdentificationNumber',
                maxLength: 'errorMessage.maxLength.taxIdentificationNumber',
                pattern: 'errorMessage.pattern.taxIdentificationNumber',
                required: 'errorMessage.required.taxIdentificationNumber',
              },
            },
            companyName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              errorMessage: {
                minLength: 'errorMessage.minLength.companyName',
                maxLength: 'errorMessage.maxLength.companyName',
                required: 'errorMessage.required.companyName',
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
                pattern: 'errorMessage.pattern.country',
                required: 'errorMessage.required.country',
              },
            },
            registrationNumber: {
              type: 'string',
              minLength: 4,
              maxLength: 20,
              errorMessage: {
                minLength: 'errorMessage.minLength.registrationNumber',
                maxLength: 'errorMessage.maxLength.registrationNumber',
                required: 'errorMessage.required.registrationNumber',
              },
            },
          },
          errorMessage: {
            required: {
              additionalInfo: 'errorMessage.required.additionalInfo',
              businessType: 'errorMessage.required.businessType',
              numberOfEmployees: 'errorMessage.required.numberOfEmployees',
              taxIdentificationNumber: 'errorMessage.required.taxIdentificationNumber',
              companyName: 'errorMessage.required.companyName',
              country: 'errorMessage.required.country',
              registrationNumber: 'errorMessage.required.registrationNumber',
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};

const dispatchOpenCorporateRule = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['data'],
      default: {},
      properties: {
        data: {
          type: 'object',
          required: ['registrationNumber', 'country'],
          default: {},
          properties: {
            registrationNumber: {
              type: 'string',
              minLength: 6,
              maxLength: 20,
            },
            country: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
            },
            additionalInfo: {
              type: 'object',
              properties: {
                state: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
          },
          if: {
            properties: {
              country: {
                enum: ['AE', 'US', 'CA'],
              },
            },
          },
          then: {
            required: ['additionalInfo'],
            properties: {
              additionalInfo: {
                required: ['state'],
              },
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};

const stateVisiblityRule = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      required: ['data'],
      properties: {
        data: {
          type: 'object',
          required: ['country'],
          default: {},
          properties: {
            country: {
              type: 'string',
              enum: ['AE', 'US', 'CA'],
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};

export const BusinessInfoPage = {
  type: 'page',
  number: 2, // routing number of page
  stateName: 'business_information', // this is the route from xstate
  name: 'text.businessInformation', // page name ( in stepper )
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
                text: 'text.businessInformation',
              },
            },
          ],
        },
        {
          type: 'json-form',
          name: 'business_info_form_p1',
          options: {
            jsonFormDefinition: {
              required: ['registration-number-input', 'country-picker-input'],
            },
          },
          elements: [
            {
              name: 'registration-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.registrationNumber',
              options: {
                label: 'text.registrationNumber.label',
                hint: 'text.registrationNumber.hint',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
            {
              name: 'country-picker-input',
              type: 'json-form:country-picker',
              valueDestination: 'entity.data.country',
              options: {
                label: 'text.country',
                hint: 'text.choose',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
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
          name: 'business_info_form_p2',
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['business_info_state_input'],
            },
          },
          visibleOn: [
            {
              type: 'json-schema',
              value: stateVisiblityRule,
            },
          ],
          elements: [
            {
              name: 'business_info_state_input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.state',
              options: {
                label: 'text.state.label',
                hint: 'text.state.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'StatePicker',
                },
                countryCodePath: 'entity.data.country',
              },
            },
          ],
        },
        {
          name: 'business_info_form_p3',
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'company-name-input',
                'tax-identification-number-input',
                'number-of-employees-input',
                'business-type-input',
                'registered-capital-in-usd-type-input',
              ],
            },
          },
          elements: [
            {
              name: 'company-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.companyName',
              options: {
                label: 'text.companyName.label',
                hint: 'text.companyName.hint',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
              },
            },
            {
              name: 'tax-identification-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.taxIdentificationNumber',
              options: {
                label: 'text.taxIdentificationNumber.label',
                hint: 'text.taxIdentificationNumber.hint',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'number-of-employees-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.numberOfEmployees',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'text.numberOfEmployees.label',
                hint: 'text.numberOfEmployees.hint',
              },
            },
            {
              name: 'business-type-input',
              type: 'json-form:dropdown',
              valueDestination: 'entity.data.businessType',
              options: {
                label: 'text.businessType.label',
                hint: 'text.choose',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'AutocompleteInput',
                  'ui:label': true,
                  options: [
                    {
                      title: 'text.businessType.options.sole_proprietorship',
                      const: 'sole_proprietorship',
                    },
                    { title: 'text.businessType.options.partnership', const: 'partnership' },
                    { title: 'text.businessType.options.corporation', const: 'corporation' },
                    {
                      title: 'text.businessType.options.limited_liability_company',
                      const: 'limited_liability_company_(llc)',
                    },
                    {
                      title: 'text.businessType.options.limited_partnership',
                      const: 'limited_partnership_(lp)',
                    },
                    {
                      title: 'text.businessType.options.limitied_liability_partnership',
                      const: 'limited_liability_partnership_(llp)',
                    },
                    {
                      title: 'text.businessType.options.public_limited_company',
                      const: 'public_limited_company_(plc)',
                    },
                    {
                      title: 'text.businessType.options.private_limited_company',
                      const: 'private_limited_company_(ltd)',
                    },
                    {
                      title: 'text.businessType.options.non_profit_organization',
                      const: 'non-profit_organization',
                    },
                    { title: 'text.businessType.options.cooperative', const: 'cooperative' },
                    { title: 'text.businessType.options.trust', const: 'trust' },
                    { title: 'text.businessType.options.government', const: 'government' },
                    { title: 'text.businessType.options.other', const: 'other' },
                  ],
                },
              },
            },
            {
              name: 'registered-capital-in-usd-type-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.registeredCapitalInUsd',
              options: {
                jsonFormDefinition: {
                  type: 'integer',
                },
                format: 'currency',
                hint: 'text.registeredCapitalInUsd.hint',
                label: 'text.registeredCapitalInUsd.label',
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
      params: { pluginName: 'fetch_company_information', debounce: 700 },
      dispatchOn: {
        uiEvents: [
          { event: 'onChange', uiElementName: 'registration-number-input' },
          { event: 'onChange', uiElementName: 'country-picker-input' },
          { event: 'onChange', uiElementName: 'business_info_state_input' },
        ],
        rules: [
          {
            type: 'json-schema',
            value: dispatchOpenCorporateRule,
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
