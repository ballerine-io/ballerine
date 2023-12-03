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
                      firstName: 'errorMessage.required.firstName',
                      lastName: 'errorMessage.required.lastName',
                      phone: 'errorMessage.required.phone',
                      email: 'errorMessage.required.email',
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
                        pattern: 'errorMessage.pattern.phone',
                      },
                    },
                    email: {
                      type: 'string',
                      format: 'email',
                      errorMessage: 'errorMessage.format.email',
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
  name: 'text.contacts',
  pageValidation: [
    {
      type: 'json-schema',
      value: validationSchema,
    },
  ],
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
                text: 'text.contacts',
              },
            },
            {
              type: 'h4',
              options: {
                text: 'text.mainContact',
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
                label: 'text.legalName',
                hint: 'text.firstName',
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
                hint: 'text.lastName',
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
                label: 'text.email.label',
                hint: 'text.email.hint',
              },
            },
            {
              name: 'contact-phone-number-input',
              type: 'international-phone-number',
              valueDestination: 'entity.data.additionalInfo.mainContact.phone',
              options: {
                label: 'text.phoneNumber',
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
                text: 'text.continue',
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
