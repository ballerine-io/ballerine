const availableOnButtonRule = {
  or: [
    {
      and: [
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2] },
        { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2] },
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2] },
        {
          '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, false],
        },
      ],
    },
    {
      and: [
        {
          '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true],
        },
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2] },
        { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2] },
        { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2] },
        {
          '>= ': [
            { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.street' }] },
            2,
          ],
        },
        {
          typeof: [
            { var: 'entity.data.additionalInfo.headquarters.physical.streetNumber' },
            'number',
          ],
        },
        {
          '>= ': [
            { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.city' }] },
            2,
          ],
        },
        {
          '>= ': [
            { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.country' }] },
            2,
          ],
        },
      ],
    },
  ],
};

const physicalAddressForm = {
  '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true],
};

export const businessAddressInfoPage = {
  type: 'page',
  number: 4,
  stateName: 'business_address_information',
  name: 'Company Address',
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
              value: 'Address',
            },
            {
              type: 'h3',
              value: 'Registered Address',
              options: {
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: ['street-input', 'street-number-input', 'city-input', 'country-input'],
            },
          },
          elements: [
            {
              id: 'street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.street',
              option: {
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              id: 'street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.streetNumber',
              option: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'Number',
                hint: '10',
              },
            },
            {
              id: 'city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.city',
              option: {
                label: 'City',
                hint: 'London',
              },
            },
            {
              id: 'country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              option: {
                label: 'Country',
                hint: 'United Kingdom',
              },
            },
            {
              id: 'different-from-physical-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical',
              option: {
                label: 'Different from physical address',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'physical-street-input',
                'physical-street-number-input',
                'physical-city-input',
                'physical-country-input',
              ],
            },
          },
          elements: [
            {
              id: 'physical-street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.street',
              option: {
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              id: 'physical-street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.streetNumber',
              option: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: 'Number',
                hint: '10',
              },
            },
            {
              id: 'physical-city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.city',
              option: {
                label: 'City',
                hint: 'London',
              },
            },
            {
              id: 'physical-country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.country',
              option: {
                label: 'Country',
                hint: 'United Kingdom',
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
