const availableOnButtonRule = {
  and: [
    { var: 'entity.data' },
    { var: 'entity.data.additionalInfo' },
    { var: 'entity.data.additionalInfo.mainRepresentative' },
    // {var: 'entity.data.additionalInfo.mainRepresentative.phone'},
    // {match: [{ var: 'entity.data.additionalInfo.mainRepresentative.phone' }, '^[+]?[0-9]{10,15}$']},
    // {match: [{ var: 'entity.data.additionalInfo.mainRepresentative.dateOfBirth' }, '^(0[1-9]|[12][0-9]|3[01])-(0[1-9]|1[0-2])-(\\d{4})$']},
    // {'>': [{ length: [{ var: 'entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle' }] }, 2]},
    // {'>': [{ length: [{ var: 'entity.data.additionalInfo.mainRepresentative.firstName' }] }, 1]},
    // {'>': [{ length: [{ var: 'entity.data.additionalInfo.mainRepresentative.lastName' }] }, 1]}
  ],
};

export const PersonalInfoPage = {
  type: 'page',
  name: 'Personal details',
  number: 1,
  stateName: 'personal_details',
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
              options: {
                text: 'Personal information',
              },
            },
          ],
        },
        {
          type: 'json-form',
          options: {
            jsonFormDefinition: {
              required: [
                'first-name-input',
                'last-name-input',
                'job-title-input',
                'date-of-birth-input',
                'phone-number-input',
              ],
            },
          },
          valueDestination: 'entity.data.additionalInfo.mainRepresentative',
          elements: [
            {
              name: 'first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.firstName',
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
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.lastName',
              options: {
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'job-title-input',
              type: 'json-form:text',
              valueDestination:
                'entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle',
              options: {
                label: 'Title',
                hint: 'CEO / Manager / Partner',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'date-of-birth-input',
              type: 'json-form:date',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.dateOfBirth',
              options: {
                label: 'Date of Birth',
                hint: 'DD/MM/YYYY',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                uiSchema: {
                  birthDate: {
                    'ui:field': 'DateInput',
                    'ui:label': true,
                  },
                },
              },
            },
            {
              name: 'phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainRepresentative.phone',
              options: {
                label: 'Phone number',
                jsonFormDefinition: {
                  type: 'string',
                  minLength: 1,
                },
                uischema: {
                  personalPhoneNumber: {
                    'ui:field': 'PhoneInput',
                    'ui:label': true,
                  },
                },
              },
            },
          ],
        },
        {
          name: 'next-page-button',
          type: 'json-form:button',
          uiDefinition: {
            classNames: ['align-right', 'padding-top-10'],
          },
          availableOn: [
            {
              type: 'json-logic',
              value: availableOnButtonRule,
            },
          ],
          options: {
            text: 'Continue',
          },
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionPlugin',
      params: {
        pluginName: 'update_end_user',
      },
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
    {
      type: 'definitionEvent',
      params: {
        eventName: 'NEXT',
      },
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
