const companyInfoPage = {
  type: 'page',
  number: 2,
  stateName: 'company_information',
  name: 'Company Information',
  elements: [
    {
      type: 'case',
      elements: [
        {
          type: 'cell',
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
          type: 'cell',
          elements: [
            {
              type: 'h1',
              value: 'Personal information',
            },
          ],
        },
        {
          type: 'cell',
          elements: [
            {
              type: 'input-text',
              valueDestination: 'context.entity.data.registrationNumber',
              option: {
                label: 'Registration Number',
                hint: '1000000032985',
              },
            },
            {
              type: 'country-picker',
              valueDestination: 'context.entity.data.country',
              option: {
                hint: 'Hong Kong',
              },
            },
            {
              type: 'input-text',
              valueDestination: 'context.entity.data.companyName',
              option: {
                label: 'Company English Name',
                hint: 'English Name',
              },
            },
            {
              type: 'input-text',
              valueDestination: 'context.entity.data.taxIdentificationNumber',
              option: {
                label: 'Tax Identity Number',
                hint: '1234567898765',
              },
            },
            {
              type: 'input-number',
              valueDestination: 'context.entity.data.numberOfEmployees',
              option: {
                hint: '20',
                label: 'Amount of Employees',
              },
            },
            {
              type: 'dropdown',
              valueDestination: 'context.entity.data.businessType',
              option: {
                hint: 'Corporation',
                label: 'Corporate type',
              },
            },
            {
              type: 'input-number',
              valueDestination: 'context.entity.data.additionalInfo.registeredCapitalInYuan',
              option: {
                format: 'currency',
                hint: '2,000,000',
                label: 'Registered capital (in Chinese Yuan)',
              },
            },
            {
              id: 'nextButton-page-2',
              type: 'button',
              uiDefinition: {
                classNames: ['align-right', 'padding-top-10'],
              },
              option: {
                text: 'Continue',
              },
            },
          ],
        },
      ],
    },
  ],
};
