const availableOnButtonRule = {
  and: [
    { var: 'entity.data' },
    { var: 'entity.data.additionalInfo' },
    { var: 'entity.data.additionalInfo.ubos' },
    { '>=': [{ length: [{ var: 'entity.data.additionalInfo.ubos' }] }, 1] },
    {
      reduce: [
        { var: 'entity.data.additionalInfo.ubos' },
        {
          and: [
            { '>= ': [{ minLength: [{ var: 'current.firstName' }] }, 3] },
            { '>= ': [{ minLength: [{ var: 'current.lastName' }] }, 3] },
            { '>= ': [{ minLength: [{ var: 'current.nationality' }] }, 3] },
            { '!!': [{ var: 'current.identityNumber' }] },
            { regex: [{ var: 'current.email' }, '^\\S+@\\S+\\.\\S+$'] },
            { '!!': [{ var: 'current.fullAddress' }] },
            { '>= ': [{ var: 'current.percentageOfOwnership' }, 25] },
            { '<= ': [{ var: 'current.percentageOfOwnership' }, 100] },
          ],
        },
        true,
      ],
    },
    { var: 'entity.data.additionalInfo.directors' },
    { '>=': [{ length: [{ var: 'entity.data.additionalInfo.directors' }] }, 1] },
    {
      reduce: [
        { var: 'entity.data.additionalInfo.directors' },
        {
          and: [
            { '>= ': [{ minLength: [{ var: 'current.firstName' }] }, 3] },
            { '>= ': [{ minLength: [{ var: 'current.lastName' }] }, 3] },
            { '>= ': [{ minLength: [{ var: 'current.nationality' }] }, 3] },
            { '!!': [{ var: 'current.identityNumber' }] },
            { regex: [{ var: 'current.email' }, '^\\S+@\\S+\\.\\S+$'] },
            { '!!': [{ var: 'current.fullAddress' }] },
          ],
        },
        true,
      ],
    },
  ],
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
          type: 'json-form',
          valueDestination: 'entity.data.additionalInfo.ubos',
          options: {
            description: '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              type: 'array',
            },
          },
          elements: [
            {
              name: 'first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.firstName', //entity.data.additionalInfo.ubos[0].firstName
              options: {
                label: 'Name',
                hint: 'First Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.lastName',
              options: {
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'nationality-input',
              type: 'nationality-picker',
              valueDestination: 'entity.data.additionalInfo.ubos.nationality',
              options: {
                label: 'Nationality',
                hint: 'Chinese',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'identity-number-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.identityNumber',
              options: {
                label: 'Identity Number',
                hint: '11010219820519759X',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'email-input',
              type: 'json-form:email',
              valueDestination: 'entity.data.additionalInfo.ubos.email',
              options: {
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
              valueDestination: 'entity.data.additionalInfo.ubos.fullAddress',
              options: {
                label: 'Address of Residence',
                hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ownership-percentage-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.percentageOfOwnership',
              options: {
                jsonFormDefinition: {
                  type: 'number',
                },
                label: '% of Ownership',
                hint: '25',
              },
            },
          ],
        },
        {
          type: 'container',
          elements: [
            {
              name: 'directors-component',
              type: 'json-form',
              valueDestination: 'entity.data.additionalInfo.directors',
              options: {
                description: '<p>Add all the directors of the company.</p>',
                jsonFormDefinition: {
                  type: 'array',
                },
              },
              elements: [
                {
                  name: 'first-name-input',
                  type: 'json-form:text',
                  valueDestination: 'firstName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string'
                    },
                    label: 'Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'lastName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string'
                    },
                    hint: 'Last Name',
                  },
                },
                {
                  name: 'nationality-input',
                  type: 'nationality-picker',
                  valueDestination: 'nationality',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                      oneOf: [
                        // Nationality title value
                        {const: 'Afghan', title: 'Afghan'},
                        {const: 'Albanian', title: 'Albanian'},
                        {const: 'Algerian', title: 'Algerian'},
                        {const: 'American', title: 'American'},
                        {const: 'Andorran', title: 'Andorran'},
                        {const: 'Angolan', title: 'Angolan'},
                        {const: 'Antiguans', title: 'Antiguans'},
                        {const: 'Chinese', title: 'Cinese'}
                      ],
                    },
                    label: 'Nationality',
                    hint: 'Chinese',
                  },
                },
                {
                  name: 'identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'identityNumber',
                  options: {
                    jsonFormDefinition: {
                      type: 'number'
                    },
                    label: 'Identity Number',
                    hint: '11010219820519759X',
                  },
                },
                {
                  name: 'address-of-residence-input',
                  type: 'json-form:text',
                  valueDestination: 'fullAddress',
                  options: {
                    jsonFormDefinition: {
                      type: 'string'
                    },
                    label: 'Address of Residence',
                    hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                  },
                },
                {
                  name: 'email-input',
                  type: 'json-form:email',
                  valueDestination: 'email',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                      format: 'email',
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
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      event: 'PREVIOUS',
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }]
      },
    },
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
