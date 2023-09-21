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
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.firstName',
              option: {
                label: 'Name',
                hint: 'First Name',
              },
            },
            {
              type: 'input-text',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.lastName',
              option: {
                hint: 'Last Name',
              },
            },
            {
              type: 'input-text',
              valueDestination:
                'entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle',
              option: {
                label: 'Title',
                hint: 'CEO / Manager / Partner',
              },
            },
            {
              type: 'date',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.dateOfBirth',
              option: {
                label: 'Date of Birth',
                hint: 'DD/MM/YYYY',
              },
            },
            {
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.phone',
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
              availableOn: [
                {
                  type: 'json-logic',
                  value: ['entity.data.additionalInfo.mainRepresentative.phone'],
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
          dispatchOn: { type: { event: 'onClick', uiElementName: 'nextButton-page-1' } },
          type: 'definitionPlugin',
          pluginName: 'update_end_user',
        },
        {
          dispatchOn: { type: { event: 'onClick', uiElementName: 'nextButton-page-1' } },
          type: 'definitionEvent',
          event: 'next',
        },
      ],
    },
  ],
};

const processDefintion = {
  id: 'clickspay_collection_flow',
  predictableActionArguments: true,
  initial: 'personal_details',
  context: {},
  states: {
    personal_details: {
      on: {
        next: 'company_information',
      },
    },
    company_information: {
      on: {
        next: 'address_information',
        previous: 'personal_details',
      },
    },
    address_information: {
      on: {
        next: 'placeholder_1',
        previous: 'company_information',
      },
    },
  },
  extensions: {
    apiPlugins: [
      {
        name: 'update_end_user',
        pluginKind: 'api',
        url: `{VITE_API_URL}/api/v1/collection-flow/end-user`,
        method: 'POST',
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              firstName: entity.data.additionalInfo.mainRepresentative.countryOfIncorporation,
              lastName: entity.data.additionalInfo.mainRepresentative.registrationNumber,
              additionalInfo: {title: entity.data.additionalInfo.mainRepresentative.additionalInfo.title},
              phone: entity.data.additionalInfo.mainRepresentative.phone,
              dateOfBirth: entity.data.additionalInfo.mainRepresentative.dateOfBirth
              }`,
            },
          ],
        },
      },
      {
        name: 'update_runtime_data',
        pluginKind: 'api',
        url: `{VITE_API_URL}/api/v1/collection-flow/{tokenId}`,
        method: 'PUT',
        stateNames: ['company_information', 'address_information'],
        headers: { Authorization: 'Bearer {tokenId}' },
        request: {
          transform: [
            {
              transformer: 'jmespath',
              mapping: `{
              flowId: {tokenId},
              mainRepresentative: entity.data.additionalInfo.mainRepresentative,
              documents: documents,
              ubos: entity.data.additionalInfo.ubos,
              businessData: entity.data,
              }`,
            },
          ],
        },
      },
    ],
  },
};
