const availableOnButtonRule = {
  and: [
    {
      '===': [
        {
          typeof: {
            var: 'context.entity.data.additionalInfo.registeredCapitalInYuan',
          },
        },
        'number',
      ],
    },
    {
      '>': [
        {
          length: {
            var: 'context.entity.data.businessType',
          },
        },
        3,
      ],
    },
    {
      '===': [
        {
          typeof: {
            var: 'context.entity.data.numberOfEmployees',
          },
        },
        'number',
      ],
    },
    {
      '>': [
        {
          length: {
            var: 'context.entity.data.taxIdentificationNumber',
          },
        },
        3,
      ],
    },
    {
      '>': [
        {
          length: {
            var: 'context.entity.data.companyName',
          },
        },
        3,
      ],
    },
    {
      and: [
        {
          '==': [
            {
              length: {
                var: 'context.entity.data.country',
              },
            },
            2,
          ],
        },
        {
          '==': [
            {
              var: 'context.entity.data.country',
            },
            {
              toUpperCase: {
                var: 'context.entity.data.country',
              },
            },
          ],
        },
      ],
    },
    {
      '>': [
        {
          length: {
            var: 'context.entity.data.registrationNumber',
          },
        },
        3,
      ],
    },
  ],
};

const dispatchOpenCorporateRule = {
  and: [
    {
      '>': [
        {
          length: {
            var: 'context.entity.data.registrationNumber',
          },
        },
        4,
      ],
    },
    {
      and: [
        {
          '==': [
            {
              length: {
                var: 'context.entity.data.country',
              },
            },
            2,
          ],
        },
        {
          '==': [
            {
              var: 'context.entity.data.country',
            },
            {
              toUpperCase: {
                var: 'context.entity.data.country',
              },
            },
          ],
        },
      ],
    },
  ],
};

export const businessInfoPage = {
  type: 'page',
  number: 2,
  stateName: 'business_information',
  name: 'Company Information',
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'container',
          uiElements: {
            elementClass: ['inline'],
          },
          elements: [
            {
              name: 'page-stepper',
              type: 'page-stepper',
              uiElements: {
                elementClass: ['inline'],
              },
            },
            {
              name: 'save-popup',
              type: 'save-popup',
            },
          ],
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
              id: 'registration-number-input',
              type: 'json-form:text',
              valueDestination: 'context.entity.data.registrationNumber',
              option: {
                label: 'Registration Number',
                hint: '1000000032985',
              },
            },
            {
              id: 'country-picker-input',
              type: 'country-picker',
              valueDestination: 'context.entity.data.country',
              option: {
                hint: 'Hong Kong',
              },
            },
            {
              id: 'company-name-input',
              type: 'json-form:text',
              valueDestination: 'context.entity.data.companyName',
              option: {
                label: 'Company English Name',
                hint: 'English Name',
              },
            },
            {
              id: 'tax-identification-number-input',
              type: 'json-form:text',
              valueDestination: 'context.entity.data.taxIdentificationNumber',
              option: {
                label: 'Tax Identity Number',
                hint: '1234567898765',
              },
            },
            {
              id: 'number-of-employees-input',
              type: 'json-form:text',
              valueDestination: 'context.entity.data.numberOfEmployees',
              option: {
                jsonFormDefinition: {
                  type: 'number',
                },
                hint: '20',
                label: 'Amount of Employees',
              },
            },
            {
              id: 'business-type-input',
              type: 'json-form:dropdown',
              valueDestination: 'context.entity.data.businessType',
              option: {
                hint: 'Corporation',
                label: 'Corporate type',
                options: [
                  { label: 'Corporation', value: 'corporation' },
                  { label: 'Limited Liability Company', value: 'limited_liability_company' },
                  { label: 'Partnership', value: 'partnership' },
                  { label: 'Sole Proprietorship', value: 'sole_proprietorship' },
                  { label: 'Non-Profit', value: 'non_profit' },
                  { label: 'Government', value: 'government' },
                  { label: 'Other', value: 'other' },
                ],
              },
            },
            {
              id: 'registered-capital-in-yuan-type-input',
              type: 'json-form:text',
              valueDestination: 'context.entity.data.additionalInfo.registeredCapitalInYuan',
              option: {
                jsonFormDefinition: {
                  type: 'number',
                },
                format: 'currency',
                hint: '2,000,000',
                label: 'Registered capital (in Chinese Yuan)',
              },
            },
            {
              id: 'some-file-input',
              type: 'file',
              valueDestination: 'context.entity.data.additionalInfo.file_file',
              option: {
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
          ],
        },
        {
          id: 'next-page-button',
          type: 'button',
          uiDefinition: {
            classNames: ['align-right', 'padding-top-10'],
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          option: {
            text: 'Continue',
          },
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionPlugin',
      pluginName: 'open_corporate',
      dispatchOn: {
        uiEvents: [
          { event: 'onChanged', uiElementName: 'registration-number-input' },
          { event: 'onChanged', uiElementName: 'country-picker-input' },
        ],
        rules: [
          {
            type: 'json-logic',
            value: dispatchOpenCorporateRule,
          },
        ],
      },
    },
    {
      type: 'definitionEvent',
      event: 'next',
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-logic',
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
