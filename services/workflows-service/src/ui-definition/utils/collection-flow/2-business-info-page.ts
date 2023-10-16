import { getCountriesList } from '../schema-utils/countries';

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
      properties: {
        data: {
          type: 'object',
          required: ['registrationNumber', 'country'],
          properties: {
            registrationNumber: {
              type: 'string',
              minLength: 6,
            },
            country: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
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
  name: 'Company Information', // page name ( in stepper )
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
                text: 'Business information',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'registration-number-input',
                'country-picker-input',
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
              type: 'country-picker',
              valueDestination: 'entity.data.country',
              options: {
                label: 'Country',
                hint: 'Hong Kong',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                  oneOf: [
                    // Line below should removed in case when field is required.
                    // { const: '', title: '' },
                    ...getCountriesList().map(countryData => ({
                      const: countryData.isoCode,
                      title: countryData.fullName,
                    })),
                  ],
                },
              },
            },
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
                hint: 'Corporation',
                label: 'Corporate type',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:placeholder': 'Corporation',
                  'ui:field': 'AutocompleteInput',
                  'ui:label': true,
                  options: [
                    { title: 'Corporation', const: 'corporation' },
                    { title: 'Limited Liability Company', const: 'limited_liability_company' },
                    { title: 'Partnership', const: 'partnership' },
                    { title: 'Sole Proprietorship', const: 'sole_proprietorship' },
                    { title: 'Non-Profit', const: 'non_profit' },
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
      type: 'definitionPlugin',
      params: { pluginName: 'fetch_company_information' },
      dispatchOn: {
        uiEvents: [
          { event: 'onChange', uiElementName: 'registration-number-input' },
          { event: 'onChange', uiElementName: 'country-picker-input' },
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
