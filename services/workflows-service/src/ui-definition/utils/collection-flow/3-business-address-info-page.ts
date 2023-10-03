const availableOnButtonRule = {
    or: [
      {
        and: [
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2 ]},
          { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2 ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2 ]},
          {'==': [ { var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, false ]}
        ]
      },
      {
        and: [
          {'==': [ { var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2 ]},
          { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2 ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2 ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.street' }] }, 2 ]},
          { typeof: [ { var: 'entity.data.additionalInfo.headquarters.physical.streetNumber' }, 'number' ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.city' }] }, 2 ]},
          {'>= ': [ { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.country' }] }, 2 ]}
        ]
      }
    ]
  };

const physicalAddressForm = {
  '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true],
};

export const BusinessAddressInfoPage = {
  type: 'page',
  number: 3,
  stateName: 'business_address_information',
  name: 'Company Address',
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
              name: 'street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.street',
              option: {
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              name: 'street-number-input',
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
              name: 'city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.city',
              option: {
                label: 'City',
                hint: 'London',
              },
            },
            {
              name: 'country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              option: {
                label: 'Country',
                hint: 'United Kingdom',
              },
            },
            {
              name: 'different-from-physical-checkbox',
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
            visibleOn: [physicalAddressForm],
          },
          elements: [
            {
              name: 'physical-street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.street',
              option: {
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              name: 'physical-street-number-input',
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
              name: 'physical-city-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.city',
              option: {
                label: 'City',
                hint: 'London',
              },
            },
            {
              name: 'physical-country-input',
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
          name: 'next-page-button',
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
