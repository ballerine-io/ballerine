const validationSchema = {
  type: 'object',
  properties: {
    entity: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            additionalInfo: {
              type: 'object',
              required: ['mainContact'],
              properties: {
                mainContact: {
                  type: 'object',
                  required: ['firstName', 'lastName', 'email', 'phone'],
                  default: {},
                  errorMessage: {
                    required: {
                      firstName: 'First name is required.',
                      lastName: 'Last name is required.',
                      phone: 'Phone is required.',
                      email: 'Email is required',
                    },
                  },
                  properties: {
                    firstName: {
                      type: 'string',
                      minLength: 1,
                    },
                    lastName: {
                      type: 'string',
                      minLength: 1,
                    },
                    phone: {
                      type: 'string',
                      pattern: '^[+]?[0-9]{10,15}$',
                      errorMessage: {
                        pattern:
                          'Phone number must be 10 to 15 digits long and may start with a +.',
                      },
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      errorMessage: 'Please enter valid email address.',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  required: ['entity'],
};

export const ContactsPage = {
  type: 'page',
  number: 5,
  stateName: 'contacts_page',
  name: 'Contacts',
  pageValidator: {
    type: 'json-schema',
    value: validationSchema,
  },
  elements: [
    {
      type: 'mainContainer',
      elements: [
        {
          type: 'container',
          elements: [
            {
              type: 'h1',
              options: {
                text: 'Contacts',
              },
            },
            {
              type: 'h4',
              options: {
                text: 'Main Contact',
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
                'contact-first-name-input',
                'contact-last-name-input',
                'contact-email-input',
                'contact-phone-number-input',
              ],
            },
          },
          elements: [
            {
              name: 'contact-first-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.firstName',
              options: {
                label: 'Legal Name',
                hint: 'First Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'contact-last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.lastName',
              options: {
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'contact-email-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.mainContact.email',
              options: {
                jsonFormDefinition: {
                  type: 'string',
                  format: 'email',
                },
                label: 'Email',
                hint: 'example@example.cn',
              },
            },
            {
              name: 'contact-phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainContact.phone',
              options: {
                label: 'Phone Number',
                jsonFormDefinition: {
                  type: 'string',
                },
                uiSchema: {
                  'ui:field': 'PhoneInput',
                  'ui:label': true,
                },
              },
            },
          ],
        },
        {
          name: 'contact-controls-container',
          type: 'container',
          options: {
            align: 'right',
          },
          elements: [
            {
              name: 'next-page-button',
              type: 'submit-button',
              options: {
                uiDefinition: {
                  classNames: ['align-right', 'padding-top-10'],
                },
                text: 'Continue',
              },
              availableOn: [
                {
                  type: 'json-schema',
                  value: validationSchema,
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  actions: [
    {
      type: 'definitionEvent',
      params: {
        eventName: 'NEXT',
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'next-page-button' }],
        rules: [
          {
            type: 'json-schema',
            value: validationSchema,
          },
        ],
      },
    },
  ],
};
