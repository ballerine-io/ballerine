const availableOnButtonRule = {
  and: [
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.mainContact.firstName' }] }, 3] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.mainContact.lastName' }] }, 3] },
    { regex: [{ var: 'entity.data.additionalInfo.mainContact.email' }, '^\\S+@\\S+\\.\\S+$'] },
    { '>= ': [{ minLength: [{ var: 'entity.data.additionalInfo.mainContact.phone' }] }, 6] },
  ],
};
export const ContactsPage = {
  type: 'page',
  number: 5,
  stateName: 'contacts_page',
  name: 'Contacts',
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'collection-flow-head'
        },
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              value: 'Contacts',
            },
            {
              type: 'h3',
              value: 'Main Contact',
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
              required: [
                'first-name-input',
                'last-name-input',
                'email-input',
                'phone-number-input',
              ],
            },
          },
          elements: [
            {
              name: 'first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.firstName',
              option: {
                label: 'Name',
                hint: 'First Name',
              },
            },
            {
              name: 'last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.lastName',
              option: {
                hint: 'Last Name',
              },
            },
            {
              name: 'email-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.email',
              option: {
                jsonFormDefinition: {
                  type: 'string',
                  format: 'email',
                },
                label: 'Email',
                hint: 'example@example.cn',
              },
            },
            {
              name: 'phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainContact.phone',
              option: {
                label: 'Phone Number',
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
