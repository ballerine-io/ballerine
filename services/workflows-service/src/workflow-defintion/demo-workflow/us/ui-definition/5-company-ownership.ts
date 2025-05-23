import { DISABLE_IF_APP_SYNCING } from '../common/rules';
import locales from '../locales';
import { i18nKeyChecker } from '@/collection-flow/utils/i18n-key-checker/i18n-key-checker';

const kc = i18nKeyChecker(locales);

export const CompanyOwnershipPage = {
  type: 'page',
  number: 5,
  stateName: 'company_ownership',
  name: kc('text.companyOwnership.page.title'),
  pageValidation: [],
  elements: [
    {
      id: 'company-ownership-page-main-container',
      element: 'column',
      children: [
        {
          id: 'company-ownership-page-title-container',
          element: 'column',
          children: [
            {
              id: 'company-ownership-page-title',
              element: 'h1',
              params: {
                text: kc('text.companyOwnership.page.title'),
              },
            },
            {
              id: 'company-ownership-page-shareholders-title',
              element: 'h3',
              params: {
                text: kc('text.companyOwnership.shareholders.label'),
                classNames: ['padding-top-10'],
              },
            },
          ],
        },
        {
          id: 'company-ownership-page-im-shareholder-checkbox',
          element: 'checkboxfield',
          valueDestination: 'entity.data.additionalInfo.imShareholder',
          params: {
            label: kc('text.companyOwnership.imShareholder.label'),
            description: kc('text.companyOwnership.shareholders.description'),
          },
        },
        {
          id: 'company-ownership-page-ubos',
          element: 'entityfieldgroup',
          valueDestination: 'entity.data.additionalInfo.ubos',
          params: {
            defaultValue: `{
              "additionalInfo": {
                "companyName": entity.data.companyName,
                "customerCompany": collectionFlow.additionalInformation.customerCompany
              }
            }`,
            type: 'ubo',
            httpParams: {
              createEntity: {
                httpParams: {
                  url: '{_app.apiUrl}collection-flow/entity',
                  method: 'POST',
                  resultPath: 'entityId',
                },
                transform: `{
                "firstName": entity.firstName,
                "lastName": entity.lastName,
                "email": entity.email,
                "phone": entity.phone,
                "country": entity.country,
                "dateOfBirth": entity.dateOfBirth,
                "nationality": entity.nationality,
                "passportNumber": entity.passportNumber,
                "address": entity.street & ", " & entity.city & ", " & entity.country,
                "nationalId": entity.nationalId,
                "additionalInfo": {
                  "fullAddress": entity.street & ", " & entity.city & ", " & entity.country,
                  "companyName": context.entity.data.companyName,
                  "customerCompany": context.collectionFlow.additionalInformation.customerCompany,
                  "placeOfBirth": entity.placeOfBirth,
                  "percentageOfOwnership": entity.ownershipPercentage,
                  "role": entity.role,
                  "city": entity.city,
                  "isAuthorizedSignatory": entity.isAuthorizedSignatory
                }
              }`,
              },
              deleteEntity: {
                url: '{_app.apiUrl}collection-flow/entity/{entityId}',
                method: 'DELETE',
                headers: {
                  Authorization: 'Bearer {_app.accessToken}',
                },
              },
              updateEntity: {
                httpParams: {
                  url: '{_app.apiUrl}collection-flow/entity/{entityId}',
                  method: 'PUT',
                  resultPath: 'entityId',
                },
                transform: `{
                "firstName": entity.firstName,
                "lastName": entity.lastName,
                "email": entity.email,
                "phone": entity.phone,
                "country": entity.country,
                "dateOfBirth": entity.dateOfBirth,
                "nationality": entity.nationality,
                "passportNumber": entity.passportNumber,
                "address": entity.street & ", " & entity.city & ", " & entity.country,
                "nationalId": entity.nationalId,
                "additionalInfo": {
                  "fullAddress": entity.street & ", " & entity.city & ", " & entity.country,
                  "companyName": context.entity.data.companyName,
                  "customerCompany": context.collectionFlow.additionalInformation.customerCompany,
                  "placeOfBirth": entity.placeOfBirth,
                  "percentageOfOwnership": entity.ownershipPercentage,
                  "role": entity.role,
                  "city": entity.city,
                  "isAuthorizedSignatory": entity.isAuthorizedSignatory
                }
              }`,
              },
              // Uncomment in case of documents in form
              // uploadDocument: {
              //   url: '{_app.apiUrl}collection-flow/files',
              //   method: 'POST',
              //   headers: {
              //     Authorization: 'Bearer {_app.accessToken}',
              //   },
              //   resultPath: 'id',
              // },
              // deleteDocument: {
              //   url: '{_app.apiUrl}collection-flow/files',
              //   method: 'DELETE',
              //   headers: {
              //     Authorization: 'Bearer {_app.accessToken}',
              //   },
              // },
            },
            addButtonLabel: 'Add Shareholder',
            itemIndexLabel: 'Shareholder {INDEX}',
          },
          validate: [
            {
              type: 'required',
              message: kc('errorMessage.companyOwnership.ubos.required'),
            },
            {
              type: 'minLength',
              value: {
                minLength: 1,
              },
              message: kc('errorMessage.companyOwnership.ubos.minItems'),
            },
          ],
          children: [
            {
              id: 'company-ownership-page-ubos-first-name-input',
              element: 'textfield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].firstName',
              params: {
                label: kc('text.companyOwnership.firstName.label'),
                placeholder: kc('text.companyOwnership.firstName.placeholder'),
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.firstName.required'),
                },
                {
                  type: 'minLength',
                  value: {
                    minLength: 2,
                  },
                  message: kc('errorMessage.companyOwnership.firstName.minLength'),
                },
                {
                  type: 'maxLength',
                  value: {
                    maxLength: 50,
                  },
                  message: kc('errorMessage.companyOwnership.firstName.maxLength'),
                },
              ],
              disable: [
                {
                  engine: 'json-logic',
                  value: {
                    and: [
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.firstName',
                          },
                          {
                            var: 'entity.data.additionalInfo.mainRepresentative.firstName',
                          },
                        ],
                      },
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.__isGeneratedAutomatically',
                          },
                          true,
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: 'company-ownership-page-ubos-last-name-input',
              element: 'textfield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].lastName',
              params: {
                label: kc('text.companyOwnership.lastName.label'),
                placeholder: kc('text.companyOwnership.lastName.placeholder'),
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.lastName.required'),
                },
                {
                  type: 'minLength',
                  value: {
                    minLength: 2,
                  },
                  message: kc('errorMessage.companyOwnership.lastName.minLength'),
                },
                {
                  type: 'maxLength',
                  value: {
                    maxLength: 50,
                  },
                  message: kc('errorMessage.companyOwnership.lastName.maxLength'),
                },
              ],
              disable: [
                {
                  engine: 'json-logic',
                  value: {
                    and: [
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.lastName',
                          },
                          {
                            var: 'entity.data.additionalInfo.mainRepresentative.lastName',
                          },
                        ],
                      },
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.__isGeneratedAutomatically',
                          },
                          true,
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: 'company-ownership-page-ubos-title-input',
              element: 'textfield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].additionalInfo.role',
              params: {
                label: kc('text.companyOwnership.jobTitle.label'),
                placeholder: kc('text.companyOwnership.jobTitle.placeholder'),
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.jobTitle.required'),
                },
                {
                  type: 'minLength',
                  value: {
                    minLength: 2,
                  },
                  message: kc('errorMessage.companyOwnership.jobTitle.minLength'),
                },
                {
                  type: 'maxLength',
                  value: {
                    maxLength: 100,
                  },
                  message: kc('errorMessage.companyOwnership.jobTitle.maxLength'),
                },
              ],
            },
            {
              id: 'company-ownership-page-ubos-date-of-birth-input',
              element: 'datefield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].additionalInfo.dateOfBirth',
              params: {
                label: kc('text.companyOwnership.dateOfBirth.label'),
                placeholder: 'MM/DD/YYYY',
                disableFuture: true,
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.dateOfBirth.required'),
                },
                {
                  type: 'pastDate',
                  message: kc('errorMessage.companyOwnership.dateOfBirth.pastDate'),
                },
              ],
            },
            {
              id: 'company-ownership-page-ubos-ssn-input',
              element: 'textfield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].additionalInfo.ssn',
              params: {
                label: kc('text.companyOwnership.ssn.label'),
                placeholder: kc('text.companyOwnership.ssn.placeholder'),
                mask: '999-99-9999',
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.ssn.required'),
                },
                {
                  type: 'pattern',
                  value: {
                    pattern: '\\d{3}[-]?\\d{2}[-]?\\d{4}',
                  },
                  message: kc('errorMessage.companyOwnership.ssn.format'),
                },
              ],
            },
            {
              id: 'company-ownership-page-ubos-email-input',
              element: 'textfield',
              valueDestination: 'entity.data.additionalInfo.ubos[$0].email',
              params: {
                label: kc('text.companyOwnership.email.label'),
                placeholder: kc('text.companyOwnership.email.placeholder'),
              },
              validate: [
                {
                  type: 'required',
                  message: kc('errorMessage.companyOwnership.email.required'),
                },
                {
                  type: 'format',
                  value: {
                    format: 'email',
                  },
                  message: kc('errorMessage.companyOwnership.email.format'),
                },
              ],
              disable: [
                {
                  engine: 'json-logic',
                  value: {
                    and: [
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.email',
                          },
                          {
                            var: 'entity.data.additionalInfo.mainRepresentative.email',
                          },
                        ],
                      },
                      {
                        '==': [
                          {
                            var: 'entity.data.additionalInfo.ubos.$0.__isGeneratedAutomatically',
                          },
                          true,
                        ],
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'company-ownership-page-ubos-divider',
          element: 'divider',
        },
        {
          id: 'company-ownership-page-next-button-row',
          element: 'row',
          params: {
            className: 'justify-end',
          },
          children: [
            {
              id: 'company-ownership-page-next-page-button',
              element: 'submitbutton',
              params: {
                text: kc('text.companyOwnership.continue'),
              },
              disable: [DISABLE_IF_APP_SYNCING],
            },
          ],
        },
      ],
    },
  ],
  plugins: [
    {
      name: 'event',
      params: {
        eventName: 'NEXT',
      },
      runOn: [
        {
          type: 'onSubmit',
        },
      ],
    },
    {
      name: 'transformer',
      params: {
        expression: `[{
          "firstName": entity.data.additionalInfo.mainRepresentative.firstName,
          "lastName": entity.data.additionalInfo.mainRepresentative.lastName,
          "email": entity.data.additionalInfo.mainRepresentative.email,
          "__isGeneratedAutomatically": true,
          "additionalInfo": {
            "companyName": entity.data.companyName,
            "customerCompany": collectionFlow.additionalInformation.customerCompany
          }
        }, entity.data.additionalInfo.ubos]`,
        output: 'entity.data.additionalInfo.ubos',
      },
      commonParams: {
        debounceTime: 0,
      },
      runOn: [
        {
          type: 'onChange',
          elementId: 'company-ownership-page-im-shareholder-checkbox',
          rules: [
            {
              engine: 'json-logic',
              value: {
                '==': [{ var: 'entity.data.additionalInfo.imShareholder' }, true],
              },
            },
          ],
        },
      ],
    },
    {
      name: 'transformer',
      params: {
        expression: `[entity.data.additionalInfo.ubos[__isGeneratedAutomatically != true]]`,
        output: 'entity.data.additionalInfo.ubos',
      },
      commonParams: {
        debounceTime: 0,
      },
      runOn: [
        {
          type: 'onChange',
          elementId: 'company-ownership-page-im-shareholder-checkbox',
          rules: [
            {
              engine: 'json-logic',
              value: {
                or: [
                  {
                    '==': [{ var: 'entity.data.additionalInfo.imShareholder' }, false],
                  },
                ],
              },
            },
          ],
        },
      ],
    },
  ],
};
