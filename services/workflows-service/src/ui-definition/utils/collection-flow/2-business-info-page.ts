import {getCountriesList} from '../schema-utils/countries';

const availableOnButtonRule = {
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
                },
              },
            },
            businessType: {
              type: 'string',
              minLength: 4,
            },
            numberOfEmployees: {
              type: 'number',
            },
            taxIdentificationNumber: {
              type: 'string',
              minLength: 4,
            },
            companyName: {
              type: 'string',
              minLength: 4,
            },
            country: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              pattern: '^[A-Z]{2}$',
            },
            registrationNumber: {
              type: 'string',
              minLength: 4,
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
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'collection-flow-head',
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              value: 'Personal information',
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['registration-number-input', 'country-picker-input', 'company-name-input'],
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
          name: 'previous-page-button',
          type: 'json-form:button',
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'PREVIOUS',
          },
        },
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
              value: availableOnButtonRule,
            },
          ],
        },
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
        eventName: 'PREVIOUS'
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }],
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
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
