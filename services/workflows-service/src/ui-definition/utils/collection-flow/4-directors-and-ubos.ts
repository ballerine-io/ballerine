const availableOnButtonRule = {
  "type": "object",
  "properties": {
    "entity": {
      "type": "object",
      "required": ["data"],
      "properties": {
        "data": {
          "type": "object",
          "required": ["additionalInfo"],
          "properties": {
            "additionalInfo": {
              "type": "object",
              "required": ["ubos", "directors"],
              "properties": {
                "ubos": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "firstName",
                      "lastName",
                      "nationality",
                      "identityNumber",
                      "email",
                      "fullAddress",
                      "percentageOfOwnership"
                    ],
                    "properties": {
                      "firstName": {"type": "string"},
                      "lastName": {"type": "string"},
                      "nationality": {"type": "string"},
                      "identityNumber": {"type": "string"},
                      "email": {"type": "string"},
                      "fullAddress": {"type": "string"},
                      "percentageOfOwnership": {"type": "number"}
                    }
                  }
                },
                "directors": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "required": [
                      "firstName",
                      "lastName",
                      "nationality",
                      "identityNumber",
                      "email",
                      "fullAddress"
                    ],
                    "properties": {
                      "firstName": {"type": "string"},
                      "lastName": {"type": "string"},
                      "nationality": {
                        "type": "string",
                        "enum": ["Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguans", "Chinese"]
                      },
                      "identityNumber": {"type": "number"},
                      "email": {"type": "string"},
                      "fullAddress": {"type": "string"}
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "required": ["entity"]
}

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
              options: {
                text: 'Directors & UBOs',
              }
            },
            {
              type: 'h3',
              options: {
                text: 'UBOs',
                classNames: ['padding-top-10'],
              }
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
          }
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
                      type: 'string'
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
                      type: 'string'
                    },
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
                  name: 'directors:identity-number-input',
                  type: 'json-form:text',
                  valueDestination: 'entity.data.additionalInfo.directors.identityNumber',
                  options: {
                    jsonFormDefinition: {
                      type: 'number'
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
                      type: 'string'
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
        eventName: 'PREVIOUS'
      },
      dispatchOn: {
        uiEvents: [{ event: 'onClick', uiElementName: 'previous-page-button' }]
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
