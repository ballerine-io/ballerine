const personalInfoPage = {
  type: 'page',
  number: 1,
  stateName: 'personal_details',
  name: 'Personal details',
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
              valueDestination: 'context.entity.data.additionalInfo.mainRepresentative.firstName',
              option: {
                label: 'Name',
                hint: 'First Name',
              },
            },
            {
              type: 'input-text',
              valueDestination: 'context.entity.data.additionalInfo.mainRepresentative.lastName',
              option: {
                hint: 'Last Name',
              },
            },
            {
              type: 'input-text',
              valueDestination:
                'context.entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle',
              option: {
                label: 'Title',
                hint: 'CEO / Manager / Partner',
              },
            },
            {
              type: 'date',
              valueDestination: 'context.entity.data.additionalInfo.mainRepresentative.dateOfBirth',
              option: {
                label: 'Date of Birth',
                hint: 'DD/MM/YYYY',
              },
            },
            {
              type: 'international-phone-number',
              valueDestination: 'context.entity.data.additionalInfo.mainRepresentative.phone',
              option: {
                label: 'Phone number',
              },
            },
            {
              id: 'nextButton-page-1',
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
