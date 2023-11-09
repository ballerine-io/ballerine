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
              required: ['registeredCapitalInYuan'],
              properties: {
                registeredCapitalInYuan: {
                  type: 'number',
                  minimum: 0,
                  errorMessage: {
                    required: 'Registered capital in yuan is required.',
                    minimum: 'Registered capital must be non-negative.',
                  },
                },
              },
              errorMessage: {
                required: {
                  registeredCapitalInYuan: 'Registered capital in yuan is required.',
                },
              },
            },
            businessType: {
              type: 'string',
              minLength: 3,
              maxLength: 50,
              errorMessage: {
                minLength: 'Business type should have at least 3 characters.',
                maxLength: 'Business type should not exceed 50 characters.',
                required: 'Business type is required.',
              },
            },
            numberOfEmployees: {
              type: 'number',
              minimum: 1,
              maximum: 100000,
              errorMessage: {
                type: 'Number of employees is required.',
                required: 'Number of employees is required.',
                minimum: 'Number of employees must be at least 1.',
                maximum: 'Number of employees cannot exceed 100,000.',
              },
            },
            taxIdentificationNumber: {
              type: 'string',
              minLength: 8,
              maxLength: 15,
              errorMessage: {
                minLength: 'Tax ID should have at least 8 characters.',
                maxLength: 'Tax ID should not exceed 15 characters.',
                required: 'Tax identification number is required.',
              },
            },
            companyName: {
              type: 'string',
              minLength: 2,
              maxLength: 100,
              errorMessage: {
                minLength: 'Company name should have at least 2 characters.',
                maxLength: 'Company name should not exceed 100 characters.',
                required: 'Company name is required.',
              },
            },
            country: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              pattern: '^[A-Z]{2}$',
              errorMessage: {
                minLength: 'Country code should have exactly 2 characters.',
                maxLength: 'Country code should have exactly 2 characters.',
                pattern: 'Please enter a valid country code.',
                required: 'Country is required.',
              },
            },
            registrationNumber: {
              type: 'string',
              minLength: 4,
              maxLength: 20,
              errorMessage: {
                minLength: 'Registration number should have at least 4 characters.',
                maxLength: 'Registration number should not exceed 20 characters.',
                required: 'Registration number is required.',
              },
            },
          },
          errorMessage: {
            required: {
              additionalInfo: 'Additional information is required.',
              businessType: 'Business type is required.',
              numberOfEmployees: 'Number of employees is required.',
              taxIdentificationNumber: 'Tax identification number is required.',
              companyName: 'Company name is required.',
              country: 'Country is required.',
              registrationNumber: 'Registration number is required.',
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
  name: 'Business Information', // page name ( in stepper )
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
                text: 'Business information',
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
                label: 'Registration Number',
                hint: '1000000032985',
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
                label: 'Country',
                hint: 'Choose',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                uiSchema: {
                  'ui:field': 'CountryPicker',
                  'ui:label': true,
                  'ui:placeholder': 'Choose',
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
                label: 'State',
                hint: 'California',
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
                'registered-capital-in-yuan-type-input',
              ],
            },
          },
          elements: [
            {
              name: 'company-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.companyName',
              options: {
                label: 'Company English Name',
                hint: 'English Name',
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
                label: 'Tax Identity Number',
                hint: '1234567898765',
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
                hint: 20,
                label: 'Amount of Employees',
              },
            },
            {
              name: 'business-type-input',
              type: 'json-form:dropdown',
              valueDestination: 'entity.data.businessType',
              options: {
                hint: 'Choose',
                label: 'Corporate type',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'AutocompleteInput',
                  'ui:label': true,
                  options: [
                    { title: 'Sole Proprietorship', const: 'sole_proprietorship' },
                    { title: 'Partnership', const: 'partnership' },
                    { title: 'Corporation', const: 'corporation' },
                    {
                      title: 'Limited Liability Company (LLC)',
                      const: 'limited_liability_company_(llc)',
                    },
                    { title: 'Limited Partnership (LP)', const: 'limited_partnership_(lp)' },
                    {
                      title: 'Limited Liability Partnership (LLP)',
                      const: 'limited_liability_partnership_(llp)',
                    },
                    {
                      title: 'Public Limited Company (PLC)',
                      const: 'public_limited_company_(plc)',
                    },
                    {
                      title: 'Private Limited Company (Ltd)',
                      const: 'private_limited_company_(ltd)',
                    },
                    { title: 'Non-Profit Organization', const: 'non-profit_organization' },
                    { title: 'Cooperative', const: 'cooperative' },
                    { title: 'Trust', const: 'trust' },
                    { title: 'Government', const: 'government' },
                    { title: 'Other', const: 'other' },
                  ],
                },
              },
            },
            {
              name: 'registered-capital-in-yuan-type-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.registeredCapitalInYuan',
              options: {
                jsonFormDefinition: {
                  type: 'integer',
                },
                format: 'currency',
                hint: '2,000,000',
                label: 'Registered capital (in Chinese Yuan)',
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
