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
            'taxIdentificationNumber',
            'companyName',
            'country',
            'registrationNumber',
          ],
          properties: {
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
            taxIdentificationNumber: {
              type: 'string',
              minLength: 8,
              maxLength: 15,
              pattern: '^[^\\s]*$',
              errorMessage: {
                minLength: 'Tax ID should have at least 8 characters.',
                maxLength: 'Tax ID should not exceed 15 characters.',
                pattern: 'Tax ID must be in valid format',
                required: 'Vat number is required.',
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
            additionalInfo: {
              type: 'object',
              required: ['dateOfEstablishment'],
              properties: {
                dateOfEstablishment: {
                  type: 'string',
                },
              },
              errorMessage: {
                required: {
                  dateOfEstablishment: 'Date of Establishment is required.',
                },
              },
            },
          },
          errorMessage: {
            required: {
              additionalInfo: 'Additional information is required.',
              businessType: 'Business type is required.',
              numberOfEmployees: 'Number of employees is required.',
              taxIdentificationNumber: 'Vat number is required.',
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

export const CompanyInfoPage = {
  type: 'page',
  number: 2, // routing number of page
  stateName: 'company_information', // this is the route from xstate
  name: 'Company Information', // page name ( in stepper )
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
                label: 'Company Registration Number',
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
                label: 'Registered Country',
                hint: 'United Kingdom',
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
                'date-of-establishment-input',
              ],
            },
          },
          elements: [
            {
              name: 'company-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.companyName',
              options: {
                label: 'Company Legal Name',
                hint: 'OpenAI Technologies, Inc.',
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
                label: 'VAT Number',
                hint: 'US-VAT-98765432',
                jsonFormDefinition: {
                  type: 'string',
                },
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
                    {
                      title: 'Sole Proprietorship',
                      const: 'sole_proprietorship',
                    },
                    { title: 'Partnership', const: 'partnership' },
                    { title: 'Corporation', const: 'corporation' },
                    {
                      title: 'Limited Liability Company (LLC)',
                      const: 'limited_liability_company_(llc)',
                    },
                    {
                      title: 'Limited Partnership (LP)',
                      const: 'limited_partnership_(lp)',
                    },
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
                    {
                      title: 'Non-Profit Organization',
                      const: 'non-profit_organization',
                    },
                    { title: 'Cooperative', const: 'cooperative' },
                    { title: 'Trust', const: 'trust' },
                    { title: 'Government', const: 'government' },
                    { title: 'Other', const: 'other' },
                  ],
                },
              },
            },
            {
              name: 'date-of-establishment-input',
              type: 'json-form:date',
              valueDestination: 'entity.data.additionalInfo.dateOfEstablishment',
              options: {
                label: 'Date of Establishment',
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
