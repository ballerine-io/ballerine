const availableOnButtonRule = {
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
                properties: {
                  ubos: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        firstName: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 50,
                          errorMessage: {
                            minLength: 'First name should be at least 2 characters long.',
                            maxLength: 'First name should not exceed 50 characters.'
                          }
                        },
                        lastName: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 50,
                          errorMessage: {
                            minLength: 'Last name should be at least 2 characters long.',
                            maxLength: 'Last name should not exceed 50 characters.'
                          }
                        },
                        nationality: {
                          type: 'string',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'Invalid nationality. Please select from the available options.'
                          }
                        },
                        identityNumber: {
                          type: 'string',
                          minLength: 5,
                          maxLength: 20,
                          errorMessage: {
                            minLength: 'Identity number should be at least 5 characters long.',
                            maxLength: 'Identity number should not exceed 20 characters.'
                          }
                        },
                        email: {
                          type: 'string',
                          format: 'email',
                          maxLength: 100,
                          errorMessage: {
                            format: 'Invalid email address.',
                            maxLength: 'Email should not exceed 100 characters.'
                          }
                        },
                        fullAddress: {
                          type: 'string',
                          minLength: 10,
                          maxLength: 200,
                          errorMessage: {
                            minLength: 'Full address should be at least 10 characters long.',
                            maxLength: 'Full address should not exceed 200 characters.'
                          }
                        },
                        percentageOfOwnership: {
                          type: 'number',
                          minimum: 0,
                          maximum: 100,
                          errorMessage: {
                            minimum: 'Percentage of ownership must be 0 or greater.',
                            maximum: 'Percentage of ownership must not exceed 100.'
                          }
                        }
                      },
                      errorMessage: {
                        required: {
                          firstName: 'First name is required.',
                          lastName: 'Last name is required.',
                          nationality: 'Nationality is required.',
                          identityNumber: 'Identity number is required.',
                          email: 'Email is required.',
                          fullAddress: 'Full address is required.',
                          percentageOfOwnership: 'Percentage of ownership is required.'
                        }
                      }
                    }
                  },
                  directors: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        firstName: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 50,
                          errorMessage: {
                            minLength: 'First name should be at least 2 characters long.',
                            maxLength: 'First name should not exceed 50 characters.'
                          }
                        },
                        lastName: {
                          type: 'string',
                          minLength: 2,
                          maxLength: 50,
                          errorMessage: {
                            minLength: 'Last name should be at least 2 characters long.',
                            maxLength: 'Last name should not exceed 50 characters.'
                          }
                        },
                        nationality: {
                          type: 'string',
                          minLength: 1,
                          errorMessage: {
                            minLength: 'Invalid nationality. Please select from the available options.'
                          }
                        },
                        identityNumber: {
                          type: 'string',
                          minLength: 5,
                          maxLength: 20,
                          errorMessage: {
                            minLength: 'Identity number should be at least 5 characters long.',
                            maxLength: 'Identity number should not exceed 20 characters.'
                          }
                        },
                        email: {
                          type: 'string',
                          format: 'email',
                          maxLength: 100,
                          errorMessage: {
                            format: 'Invalid email address.',
                            maxLength: 'Email should not exceed 100 characters.'
                          }
                        },
                        fullAddress: {
                          type: 'string',
                          minLength: 10,
                          maxLength: 200,
                          errorMessage: {
                            minLength: 'Full address should be at least 10 characters long.',
                            maxLength: 'Full address should not exceed 200 characters.'
                          }
                        }
                      },
                      errorMessage: {
                        required: {
                          firstName: 'First name is required.',
                          lastName: 'Last name is required.',
                          nationality: 'Nationality is required.',
                          identityNumber: 'Identity number is required.',
                          email: 'Email is required.',
                          fullAddress: 'Full address is required.'
                        }
                      }
                    }
                  }
                },
                errorMessage: {
                  required: {
                    ubos: 'UBOs are required.',
                    directors: 'Directors are required.'
                  }
                }
              }
            },
          }
        },
      }
    },
    required: ['entity'],
  }
;

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
          type: 'container',
          elements: [
            {
              type: 'h1',
              options: {
                text: 'Directors & UBOs',
              },
            },
            {
              type: 'h3',
              options: {
                text: 'UBOs',
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          type: 'json-form',
          valueDestination: 'entity.data.additionalInfo.ubos',
          options: {
            description:
              '<p>add all the natural persons that own or control, <bold>Directly Or Indirectly</bold> more than 25% of the company.</p>',
            jsonFormDefinition: {
              type: 'array',
            },
          },
          elements: [
            {
              name: 'ubos:first-name-input',
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
              name: 'ubos:last-name-input',
              type: 'json-form:text',
              valueDestination: 'entity.data.additionalInfo.ubos.lastName',
              options: {
                label: 'Last Name',
                hint: 'Last Name',
                jsonFormDefinition: {
                  type: 'string',
                },
              },
            },
            {
              name: 'ubos:nationality-input',
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
              name: 'ubos:identity-number-input',
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
              name: 'ubos:email-input',
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
              name: 'ubos:address-of-residence-input',
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
              name: 'ubos:ownership-percentage-input',
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
          type: 'h3',
          options: {
            text: 'Directors',
            classNames: ['padding-top-10'],
          },
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
                  name: 'directors:first-name-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.firstName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Name',
                    hint: 'First Name',
                  },
                },
                {
                  name: 'directors:last-name-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.lastName',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Last Name',
                    hint: 'Last Name',
                  },
                },
                {
                  name: 'directors:nationality-input',
                  type: 'nationality-picker',
                  valueDestination: 'entity.data.additionalInfo.directors.nationality',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                      oneOf: [
                        // Nationality title value
                        { const: 'Afghan', title: 'Afghan' },
                        { const: 'Albanian', title: 'Albanian' },
                        { const: 'Algerian', title: 'Algerian' },
                        { const: 'American', title: 'American' },
                        { const: 'Andorran', title: 'Andorran' },
                        { const: 'Angolan', title: 'Angolan' },
                        { const: 'Antiguans', title: 'Antiguans' },
                        { const: 'Chinese', title: 'Cinese' },
                      ],
                    },
                    label: 'Nationality',
                    hint: 'Chinese',
                  },
                },
                {
                  name: 'directors:identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.identityNumber',
                  options: {
                    jsonFormDefinition: {
                      type: 'number',
                    },
                    label: 'Identity Number',
                    hint: '11010219820519759X',
                  },
                },
                {
                  name: 'directors:address-of-residence-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.fullAddress',
                  options: {
                    jsonFormDefinition: {
                      type: 'string',
                    },
                    label: 'Address of Residence',
                    hint: '22, Choyangmen, Chaoyang District, Beijing, China',
                  },
                },
                {
                  name: 'directors:email-input',
                  type: 'json-form:email',
                  valueDestination: 'entity.data.additionalInfo.directors.email',
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
              type: 'json-schema',
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
      params: {
        eventName: 'PREVIOUS',
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }],
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
            type: 'json-schema',
            value: availableOnButtonRule,
          },
        ],
      },
    },
  ],
};
