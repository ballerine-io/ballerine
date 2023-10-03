const availableOnButtonRule = {
    and: [
      {'>=': [ { length: [{ var: 'entity.data.additionalInfo.ubos' }] }, 1 ]},
      {
        reduce: [
          { var: 'entity.data.additionalInfo.ubos' },
          {
            and: [
              {'>= ': [ { minLength: [{ var: 'current.firstName' }] }, 3 ]},
              {'>= ': [ { minLength: [{ var: 'current.lastName' }] }, 3 ]},
              {'>= ': [ { minLength: [{ var: 'current.nationality' }] }, 3 ]},
              {'!!': [ { var: 'current.identityNumber' } ]},
              { regex: [ { var: 'current.email' }, '^\\S+@\\S+\\.\\S+$' ]},
              {'!!': [ { var: 'current.fullAddress' } ]},
              {'>= ': [ { var: 'current.percentageOfOwnership' }, 25 ]},
              {'<= ': [ { var: 'current.percentageOfOwnership' }, 100 ]}
            ]
          },
          true
        ]
      },
      {'>=': [ { length: [{ var: 'entity.data.additionalInfo.directors' }] }, 1 ]},
      {
        reduce: [
          { var: 'entity.data.additionalInfo.directors' },
          {
            and: [
              {'>= ': [ { minLength: [{ var: 'current.firstName' }] }, 3 ]},
              {'>= ': [ { minLength: [{ var: 'current.lastName' }] }, 3 ]},
              {'>= ': [ { minLength: [{ var: 'current.nationality' }] }, 3 ]},
              {'!!': [ { var: 'current.identityNumber' } ]},
              { regex: [ { var: 'current.email' }, '^\\S+@\\S+\\.\\S+$' ]},
              {'!!': [ { var: 'current.fullAddress' } ]}
            ]
          },
          true
        ]
      }
    ]
  };

export const DirectorsAndUbosPage = {
  type: 'page',
  number: 4,
  stateName: 'directors_and_ubos',
  name: 'Directors and UBOs',
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
              value: 'UBOs',
              options: {
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          type: 'container',
          elements: [
            {
              name: 'ubos-component',
              type: 'ubos-component',
              valueDestination: 'entity.data.additionalInfo.ubos',
              options: {
                htmlHint:
                  '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
              },
              elements: [
                {
                  name: 'first-name-input',
                  type: 'json-form:text',
                  valueDestination: 'firstName', //entity.data.additionalInfo.ubos[0].firstName
                  option: {
                    label: 'Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'lastName',
                  option: {
                    hint: 'Last Name',
                  },
                },
                {
                  name: 'nationality-input',
                  type: 'nationality-picker',
                  valueDestination: 'nationality',
                  option: {
                    label: 'Nationality',
                    hint: 'Chinese',
                  },
                },
                {
                  name: 'identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'identityNumber',
                  option: {
                    label: 'Identity Number',
                    hint: '11010219820519759X',
                  },
                },
                {
                  name: 'email-input',
                  type: 'json-form:email',
                  valueDestination: 'email',
                  option: {
                    jsonFormDefinition: {
                      type: 'string',
                      format: 'email',
                    },
                    label: 'Email',
                    hint: 'name@companyhk.com',
                  },
                },
                {
                  name: 'address-of-residence-input',
                  type: 'json-form:text',
                  valueDestination: 'fullAddress',
                  option: {
                    label: 'Address of Residence',
                    hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                  },
                },
                {
                  name: 'ownership-percentage-input',
                  type: 'json-form:text',
                  valueDestination: 'percentageOfOwnership',
                  option: {
                    jsonFormDefinition: {
                      type: 'number',
                    },
                    label: '% of Ownership',
                    hint: '25',
                  },
                },
              ],
            },
          ],
        },
        {
          type: 'container',
          elements: [
            {
              name: 'directors-component',
              type: 'directors-component',
              valueDestination: 'entity.data.additionalInfo.directors',
              options: {
                htmlHint: '<p>Add all the directors of the company.</p>',
              },
              elements: [
                {
                  name: 'first-name-input',
                  type: 'json-form:text',
                  valueDestination: 'firstName',
                  option: {
                    label: 'Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'lastName',
                  option: {
                    hint: 'Last Name',
                  },
                },
                {
                  name: 'nationality-input',
                  type: 'nationality-picker',
                  valueDestination: 'nationality',
                  option: {
                    label: 'Nationality',
                    hint: 'Chinese',
                  },
                },
                {
                  name: 'identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'identityNumber',
                  option: {
                    label: 'Identity Number',
                    hint: '11010219820519759X',
                  },
                },
                {
                  name: 'address-of-residence-input',
                  type: 'json-form:text',
                  valueDestination: 'fullAddress',
                  option: {
                    label: 'Address of Residence',
                    hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                  },
                },
                {
                  name: 'email-input',
                  type: 'json-form:email',
                  valueDestination: 'email',
                  option: {
                    jsonFormDefinition: {
                      type: 'email',
                    },
                    label: 'Email',
                    hint: 'name@companyhk.com',
                  },
                },
              ],
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
