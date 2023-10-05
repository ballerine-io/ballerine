import {getCountriesList} from '../schema-utils/countries';

const availableOnButtonRule = {
  or: [
    {
      and: [
        { var: 'entity.data' },
        { var: 'entity.data.additionalInfo' },
        { var: 'entity.data.additionalInfo.headquarters' },
        { var: 'entity.data.additionalInfo.headquarters.street' },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2] },
        // { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2] },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2] },
        // {
        //   '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, false],
        // },
      ],
    },
    {
      and: [
        { var: 'entity.data' },
        { var: 'entity.data.additionalInfo' },
        { var: 'entity.data.additionalInfo.headquarters' },
        { var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' },
        // {
        //   '==': [{ var: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical' }, true],
        // },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.street' }] }, 2] },
        // { typeof: [{ var: 'entity.data.additionalInfo.headquarters.streetNumber' }, 'number'] },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.city' }] }, 2] },
        // { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.headquarters.country' }] }, 2] },
        // {
        //   '>= ': [
        //     { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.street' }] },
        //     2,
        //   ],
        // },
        // {
        //   typeof: [
        //     { var: 'entity.data.additionalInfo.headquarters.physical.streetNumber' },
        //     'number',
        //   ],
        // },
        // {
        //   '>= ': [
        //     { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.city' }] },
        //     2,
        //   ],
        // },
        // {
        //   '>= ': [
        //     { minLength: [{ var: 'entity.data.additionalInfo.headquarters.physical.country' }] },
        //     2,
        //   ],
        // },
      ],
    },
  ],
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
              options: {
                label: 'Street',
                hint: 'Downing Street',
              },
            },
            {
              name: 'street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.streetNumber',
              options: {
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
              options: {
                jsonFormDefinition: {
                  type: 'string',
                },
                label: 'City',
                hint: 'London',
              },
            },
            {
              name: 'country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.country',
              options: {
                label: 'Country',
                hint: 'United Kingdom',
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
              name: 'different-from-physical-checkbox',
              type: 'checkbox',
              valueDestination: 'entity.data.additionalInfo.headquarters.isDifferentFromPhysical',
              options: {
                label: 'Different from physical address',
                jsonFormDefinition: {
                  type: 'boolean',
                },
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
          visibleOn: [physicalAddressForm],
          elements: [
            {
              name: 'physical-street-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.street',
              options: {
                label: 'Street',
                hint: 'Downing Street',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'physical-street-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.streetNumber',
              options: {
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
              options: {
                label: 'City',
                hint: 'London',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'physical-country-input',
              type: 'country-picker',
              valueDestination: 'entity.data.additionalInfo.headquarters.physical.country',
              options: {
                label: 'Country',
                hint: 'United Kingdom',
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
          ],
        },
        {
          name: 'next-page-button',
          type: 'json-form:button',
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          options: {
            uiDefinition: {
              classNames: ['align-right', 'padding-top-10'],
            },
            text: 'Continue',
          },
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      event: 'NEXT',
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
