import { App } from '@/App';
import { withSessionProtected } from '@/common/hocs/withSessionProtected';
import { AlertDefinitions } from '@/pages/AlertDefinitions';
import { Filters } from '@/pages/Filters';
import { Overview } from '@/pages/Overview';
import { SignIn } from '@/pages/SignIn';
import { UIDefinitions } from '@/pages/UIDefinitions';
import { WorkflowDefinition } from '@/pages/WorkflowDefinition';
import { WorkflowDefinitions } from '@/pages/WorkflowDefinitions';
import { Workflows } from '@/pages/Workflows';
import { createBrowserRouter, Navigate } from 'react-router-dom';
//@ts-ignore
import { Main as CollectionFlowPortable } from '@ballerine/kyb-app';
import '@ballerine/kyb-app/dist/collection-flow-portable/style.css';

console.log({ CollectionFlowPortable });

const schema = {
  id: 'kyb_with_associated_companies_example',
  config: {
    isExample: true,
    childCallbackResults: [
      {
        definitionId: 'associated_company_child_workflow',
        deliverEvent: 'ASSOCIATED_COMPANY_KYB_FINISHED',
        transformers: [
          {
            mapping: '{childEntity: entity.data}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['manual_review'],
      },
      {
        definitionId: 'associated_company_child_workflow',
        deliverEvent: 'ASSOCIATED_COMPANY_IN_PROGRESS',
        transformers: [
          {
            mapping: '{childEntity: entity.data}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['pending_associated_kyb_collection_flow'],
      },
      {
        definitionId: 'associated_company_child_workflow',
        deliverEvent: 'revision',
        transformers: [
          {
            mapping: '{childEntity: entity.data}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['revision'],
      },
      {
        definitionId: 'kyc_child_workflow',
        deliverEvent: 'KYC_RESPONDED',
        transformers: [
          {
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['manual_review'],
      },
      {
        definitionId: 'kyc_child_workflow',
        deliverEvent: 'KYC_IN_PROGRESS',
        transformers: [
          {
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['pending_kyc_flow'],
      },
      {
        definitionId: 'kyc_child_workflow',
        deliverEvent: 'KYC_REVISION',
        transformers: [
          {
            mapping:
              '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
            transformer: 'jmespath',
          },
        ],
        persistenceStates: ['revision'],
      },
    ],
    isCaseOverviewEnabled: true,
    workflowLevelResolution: true,
    createCollectionFlowToken: true,
  },
  uiSchema: {
    elements: [
      {
        name: 'Personal details',
        type: 'page',
        number: 1,
        actions: [
          {
            type: 'definitionPlugin',
            params: {
              pluginName: 'update_end_user',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            required: ['additionalInfo'],
                            properties: {
                              additionalInfo: {
                                type: 'object',
                                default: {},
                                required: ['mainRepresentative', 'iHaveSigningAuthority'],
                                properties: {
                                  mainRepresentative: {
                                    type: 'object',
                                    required: [
                                      'phone',
                                      'dateOfBirth',
                                      'firstName',
                                      'lastName',
                                      'additionalInfo',
                                    ],
                                    properties: {
                                      phone: {
                                        type: 'string',
                                        pattern: '^[+]?[0-9]{10,15}$',
                                        errorMessage: {
                                          pattern:
                                            'Phone number must be 10 to 15 digits long and may start with a +.',
                                        },
                                      },
                                      lastName: {
                                        type: 'string',
                                        minLength: 2,
                                        errorMessage: {
                                          minLength:
                                            'Last name must be at least 2 characters long.',
                                        },
                                      },
                                      firstName: {
                                        type: 'string',
                                        minLength: 2,
                                        errorMessage: {
                                          minLength:
                                            'First name must be at least 2 characters long.',
                                        },
                                      },
                                      dateOfBirth: {
                                        type: 'string',
                                        errorMessage: {
                                          type: 'Date of birth must be a string.',
                                        },
                                      },
                                      additionalInfo: {
                                        type: 'object',
                                        default: {},
                                        required: ['jobTitle'],
                                        properties: {
                                          jobTitle: {
                                            type: 'string',
                                            minLength: 2,
                                            errorMessage: {
                                              minLength:
                                                'Job title must be at least 2 characters long.',
                                            },
                                          },
                                        },
                                        errorMessage: {
                                          required: {
                                            jobTitle: 'Job title is required.',
                                          },
                                        },
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        phone: 'A valid phone number is required.',
                                        lastName: 'Last name is required.',
                                        firstName: 'First name is required.',
                                        dateOfBirth: 'Date of Birth is required.',
                                        additionalInfo: 'Additional information is required.',
                                      },
                                    },
                                  },
                                  iHaveSigningAuthority: {
                                    enum: [true],
                                    type: 'boolean',
                                    errorMessage: {
                                      enum: 'You must be authorized to sign on behalf of the company.',
                                    },
                                  },
                                },
                                errorMessage: {
                                  required: {
                                    iHaveSigningAuthority:
                                      'You must be authorized to sign on behalf of the company.',
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
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
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
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            required: ['additionalInfo'],
                            properties: {
                              additionalInfo: {
                                type: 'object',
                                default: {},
                                required: ['mainRepresentative', 'iHaveSigningAuthority'],
                                properties: {
                                  mainRepresentative: {
                                    type: 'object',
                                    required: [
                                      'phone',
                                      'dateOfBirth',
                                      'firstName',
                                      'lastName',
                                      'additionalInfo',
                                    ],
                                    properties: {
                                      phone: {
                                        type: 'string',
                                        pattern: '^[+]?[0-9]{10,15}$',
                                        errorMessage: {
                                          pattern:
                                            'Phone number must be 10 to 15 digits long and may start with a +.',
                                        },
                                      },
                                      lastName: {
                                        type: 'string',
                                        minLength: 2,
                                        errorMessage: {
                                          minLength:
                                            'Last name must be at least 2 characters long.',
                                        },
                                      },
                                      firstName: {
                                        type: 'string',
                                        minLength: 2,
                                        errorMessage: {
                                          minLength:
                                            'First name must be at least 2 characters long.',
                                        },
                                      },
                                      dateOfBirth: {
                                        type: 'string',
                                        errorMessage: {
                                          type: 'Date of birth must be a string.',
                                        },
                                      },
                                      additionalInfo: {
                                        type: 'object',
                                        default: {},
                                        required: ['jobTitle'],
                                        properties: {
                                          jobTitle: {
                                            type: 'string',
                                            minLength: 2,
                                            errorMessage: {
                                              minLength:
                                                'Job title must be at least 2 characters long.',
                                            },
                                          },
                                        },
                                        errorMessage: {
                                          required: {
                                            jobTitle: 'Job title is required.',
                                          },
                                        },
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        phone: 'A valid phone number is required.',
                                        lastName: 'Last name is required.',
                                        firstName: 'First name is required.',
                                        dateOfBirth: 'Date of Birth is required.',
                                        additionalInfo: 'Additional information is required.',
                                      },
                                    },
                                  },
                                  iHaveSigningAuthority: {
                                    enum: [true],
                                    type: 'boolean',
                                    errorMessage: {
                                      enum: 'You must be authorized to sign on behalf of the company.',
                                    },
                                  },
                                },
                                errorMessage: {
                                  required: {
                                    iHaveSigningAuthority:
                                      'You must be authorized to sign on behalf of the company.',
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
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Personal Information',
                    },
                  },
                ],
              },
              {
                name: 'json-form:personal-information',
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
                elements: [
                  {
                    name: 'first-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'First Name',
                      label: 'Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.mainRepresentative.firstName',
                  },
                  {
                    name: 'last-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'Last Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.mainRepresentative.lastName',
                  },
                  {
                    name: 'job-title-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'CEO / Manager / Partner',
                      label: 'Title',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle',
                  },
                  {
                    name: 'date-of-birth-input',
                    type: 'json-form:date',
                    options: {
                      hint: 'DD/MM/YYYY',
                      label: 'Date of Birth',
                      uiSchema: {
                        'ui:field': 'DateInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.mainRepresentative.dateOfBirth',
                  },
                  {
                    name: 'phone-number-input',
                    type: 'international-phone-number',
                    options: {
                      label: 'Phone Number',
                      uiSchema: {
                        'ui:field': 'PhoneInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.mainRepresentative.phone',
                  },
                  {
                    name: 'authority-checkbox',
                    type: 'authority-checkbox',
                    options: {
                      label: 'I have the signing authority for this company',
                      uiSchema: {
                        'ui:label': false,
                      },
                      jsonFormDefinition: {
                        type: 'boolean',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.iHaveSigningAuthority',
                  },
                ],
                availableOn: [
                  {
                    type: 'json-schema',
                    value: {
                      type: 'object',
                      required: ['entity'],
                      properties: {
                        entity: {
                          type: 'object',
                          properties: {
                            data: {
                              type: 'object',
                              required: ['additionalInfo'],
                              properties: {
                                additionalInfo: {
                                  type: 'object',
                                  default: {},
                                  required: ['mainRepresentative', 'iHaveSigningAuthority'],
                                  properties: {
                                    mainRepresentative: {
                                      type: 'object',
                                      required: [
                                        'phone',
                                        'dateOfBirth',
                                        'firstName',
                                        'lastName',
                                        'additionalInfo',
                                      ],
                                      properties: {
                                        phone: {
                                          type: 'string',
                                          pattern: '^[+]?[0-9]{10,15}$',
                                          errorMessage: {
                                            pattern:
                                              'Phone number must be 10 to 15 digits long and may start with a +.',
                                          },
                                        },
                                        lastName: {
                                          type: 'string',
                                          minLength: 2,
                                          errorMessage: {
                                            minLength:
                                              'Last name must be at least 2 characters long.',
                                          },
                                        },
                                        firstName: {
                                          type: 'string',
                                          minLength: 2,
                                          errorMessage: {
                                            minLength:
                                              'First name must be at least 2 characters long.',
                                          },
                                        },
                                        dateOfBirth: {
                                          type: 'string',
                                          errorMessage: {
                                            type: 'Date of birth must be a string.',
                                          },
                                        },
                                        additionalInfo: {
                                          type: 'object',
                                          default: {},
                                          required: ['jobTitle'],
                                          properties: {
                                            jobTitle: {
                                              type: 'string',
                                              minLength: 2,
                                              errorMessage: {
                                                minLength:
                                                  'Job title must be at least 2 characters long.',
                                              },
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              jobTitle: 'Job title is required.',
                                            },
                                          },
                                        },
                                      },
                                      errorMessage: {
                                        required: {
                                          phone: 'A valid phone number is required.',
                                          lastName: 'Last name is required.',
                                          firstName: 'First name is required.',
                                          dateOfBirth: 'Date of Birth is required.',
                                          additionalInfo: 'Additional information is required.',
                                        },
                                      },
                                    },
                                    iHaveSigningAuthority: {
                                      enum: [true],
                                      type: 'boolean',
                                      errorMessage: {
                                        enum: 'You must be authorized to sign on behalf of the company.',
                                      },
                                    },
                                  },
                                  errorMessage: {
                                    required: {
                                      iHaveSigningAuthority:
                                        'You must be authorized to sign on behalf of the company.',
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
                ],
                valueDestination: 'entity.data.additionalInfo.mainRepresentative',
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              properties: {
                                data: {
                                  type: 'object',
                                  required: ['additionalInfo'],
                                  properties: {
                                    additionalInfo: {
                                      type: 'object',
                                      default: {},
                                      required: ['mainRepresentative', 'iHaveSigningAuthority'],
                                      properties: {
                                        mainRepresentative: {
                                          type: 'object',
                                          required: [
                                            'phone',
                                            'dateOfBirth',
                                            'firstName',
                                            'lastName',
                                            'additionalInfo',
                                          ],
                                          properties: {
                                            phone: {
                                              type: 'string',
                                              pattern: '^[+]?[0-9]{10,15}$',
                                              errorMessage: {
                                                pattern:
                                                  'Phone number must be 10 to 15 digits long and may start with a +.',
                                              },
                                            },
                                            lastName: {
                                              type: 'string',
                                              minLength: 2,
                                              errorMessage: {
                                                minLength:
                                                  'Last name must be at least 2 characters long.',
                                              },
                                            },
                                            firstName: {
                                              type: 'string',
                                              minLength: 2,
                                              errorMessage: {
                                                minLength:
                                                  'First name must be at least 2 characters long.',
                                              },
                                            },
                                            dateOfBirth: {
                                              type: 'string',
                                              errorMessage: {
                                                type: 'Date of birth must be a string.',
                                              },
                                            },
                                            additionalInfo: {
                                              type: 'object',
                                              default: {},
                                              required: ['jobTitle'],
                                              properties: {
                                                jobTitle: {
                                                  type: 'string',
                                                  minLength: 2,
                                                  errorMessage: {
                                                    minLength:
                                                      'Job title must be at least 2 characters long.',
                                                  },
                                                },
                                              },
                                              errorMessage: {
                                                required: {
                                                  jobTitle: 'Job title is required.',
                                                },
                                              },
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              phone: 'A valid phone number is required.',
                                              lastName: 'Last name is required.',
                                              firstName: 'First name is required.',
                                              dateOfBirth: 'Date of Birth is required.',
                                              additionalInfo: 'Additional information is required.',
                                            },
                                          },
                                        },
                                        iHaveSigningAuthority: {
                                          enum: [true],
                                          type: 'boolean',
                                          errorMessage: {
                                            enum: 'You must be authorized to sign on behalf of the company.',
                                          },
                                        },
                                      },
                                      errorMessage: {
                                        required: {
                                          iHaveSigningAuthority:
                                            'You must be authorized to sign on behalf of the company.',
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
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'personal_details',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      required: ['additionalInfo'],
                      properties: {
                        additionalInfo: {
                          type: 'object',
                          default: {},
                          required: ['mainRepresentative', 'iHaveSigningAuthority'],
                          properties: {
                            mainRepresentative: {
                              type: 'object',
                              required: [
                                'phone',
                                'dateOfBirth',
                                'firstName',
                                'lastName',
                                'additionalInfo',
                              ],
                              properties: {
                                phone: {
                                  type: 'string',
                                  pattern: '^[+]?[0-9]{10,15}$',
                                  errorMessage: {
                                    pattern:
                                      'Phone number must be 10 to 15 digits long and may start with a +.',
                                  },
                                },
                                lastName: {
                                  type: 'string',
                                  minLength: 2,
                                  errorMessage: {
                                    minLength: 'Last name must be at least 2 characters long.',
                                  },
                                },
                                firstName: {
                                  type: 'string',
                                  minLength: 2,
                                  errorMessage: {
                                    minLength: 'First name must be at least 2 characters long.',
                                  },
                                },
                                dateOfBirth: {
                                  type: 'string',
                                  errorMessage: {
                                    type: 'Date of birth must be a string.',
                                  },
                                },
                                additionalInfo: {
                                  type: 'object',
                                  default: {},
                                  required: ['jobTitle'],
                                  properties: {
                                    jobTitle: {
                                      type: 'string',
                                      minLength: 2,
                                      errorMessage: {
                                        minLength: 'Job title must be at least 2 characters long.',
                                      },
                                    },
                                  },
                                  errorMessage: {
                                    required: {
                                      jobTitle: 'Job title is required.',
                                    },
                                  },
                                },
                              },
                              errorMessage: {
                                required: {
                                  phone: 'A valid phone number is required.',
                                  lastName: 'Last name is required.',
                                  firstName: 'First name is required.',
                                  dateOfBirth: 'Date of Birth is required.',
                                  additionalInfo: 'Additional information is required.',
                                },
                              },
                            },
                            iHaveSigningAuthority: {
                              enum: [true],
                              type: 'boolean',
                              errorMessage: {
                                enum: 'You must be authorized to sign on behalf of the company.',
                              },
                            },
                          },
                          errorMessage: {
                            required: {
                              iHaveSigningAuthority:
                                'You must be authorized to sign on behalf of the company.',
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
        ],
      },
      {
        name: 'Company Information',
        type: 'page',
        number: 2,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        required: ['data'],
                        properties: {
                          data: {
                            type: 'object',
                            required: [
                              'additionalInfo',
                              'businessType',
                              'taxIdentificationNumber',
                              'companyName',
                              'country',
                              'registrationNumber',
                            ],
                            properties: {
                              country: {
                                type: 'string',
                                pattern: '^[A-Z]{2}$',
                                maxLength: 2,
                                minLength: 2,
                                errorMessage: {
                                  pattern: 'Please enter a valid country code.',
                                  required: 'Country is required.',
                                  maxLength: 'Country code should have exactly 2 characters.',
                                  minLength: 'Country code should have exactly 2 characters.',
                                },
                              },
                              companyName: {
                                type: 'string',
                                maxLength: 100,
                                minLength: 2,
                                errorMessage: {
                                  required: 'Company name is required.',
                                  maxLength: 'Company name should not exceed 100 characters.',
                                  minLength: 'Company name should have at least 2 characters.',
                                },
                              },
                              businessType: {
                                type: 'string',
                                maxLength: 100,
                                minLength: 3,
                                errorMessage: {
                                  required: 'Business type is required.',
                                  maxLength: 'Business type should not exceed 100 characters.',
                                  minLength: 'Business type should have at least 3 characters.',
                                },
                              },
                              additionalInfo: {
                                type: 'object',
                                required: ['dateOfEstablishment'],
                                properties: {
                                  dateOfEstablishment: {
                                    type: 'string',
                                  },
                                },
                                errorMessage: {
                                  required: {
                                    dateOfEstablishment: 'Date Of Establishment is required.',
                                  },
                                },
                              },
                              registrationNumber: {
                                type: 'string',
                                maxLength: 20,
                                minLength: 4,
                                errorMessage: {
                                  required: 'Registration number is required.',
                                  maxLength: 'Registration number should not exceed 20 characters.',
                                  minLength:
                                    'Registration number should have at least 4 characters.',
                                },
                              },
                              taxIdentificationNumber: {
                                type: 'string',
                                pattern: '^[^\\s]*$',
                                maxLength: 15,
                                minLength: 8,
                                errorMessage: {
                                  pattern: 'Tax ID must be in valid format.',
                                  required: 'Tax identification number is required.',
                                  maxLength: 'Tax ID should not exceed 15 characters.',
                                  minLength: 'Tax ID should have at least 8 characters.',
                                },
                              },
                            },
                            errorMessage: {
                              required: {
                                country: 'Country is required.',
                                companyName: 'Company name is required.',
                                businessType: 'Business type is required.',
                                additionalInfo: 'Additional information is required.',
                                numberOfEmployees: 'Number of employees is required.',
                                registrationNumber: 'Registration number is required.',
                                taxIdentificationNumber: 'Tax identification number is required.',
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Business Information',
                    },
                  },
                ],
              },
              {
                name: 'business_info_form_p1',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['registration-number-input', 'country-picker-input'],
                  },
                },
                elements: [
                  {
                    name: 'registration-number-input',
                    type: 'json-form:text',
                    options: {
                      hint: '1000000032985',
                      label: 'Registration Number',
                      jsonFormDefinition: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    valueDestination: 'entity.data.registrationNumber',
                  },
                  {
                    name: 'country-picker-input',
                    type: 'json-form:country-picker',
                    options: {
                      hint: 'Choose',
                      label: 'Country',
                      uiSchema: {
                        'ui:field': 'CountryPicker',
                        'ui:label': true,
                        'ui:placeholder': 'Choose',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    valueDestination: 'entity.data.country',
                  },
                ],
              },
              {
                name: 'business_info_form_p2',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['business_info_state_input'],
                  },
                },
                elements: [
                  {
                    name: 'business_info_state_input',
                    type: 'json-form:text',
                    options: {
                      hint: 'California',
                      label: 'State',
                      uiSchema: {
                        'ui:field': 'StatePicker',
                      },
                      countryCodePath: 'entity.data.country',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.state',
                  },
                ],
                visibleOn: [
                  {
                    type: 'json-schema',
                    value: {
                      type: 'object',
                      required: ['entity'],
                      properties: {
                        entity: {
                          type: 'object',
                          required: ['data'],
                          properties: {
                            data: {
                              type: 'object',
                              default: {},
                              required: ['country'],
                              properties: {
                                country: {
                                  enum: ['AE', 'US', 'CA'],
                                  type: 'string',
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                ],
              },
              {
                name: 'business_info_form_p3',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: [
                      'company-name-input',
                      'tax-identification-number-input',
                      'number-of-employees-input',
                      'business-type-input',
                      'registered-capital-in-yuan-type-input',
                      'date-of-establishment-input',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'company-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'English Name',
                      label: 'Company English Name',
                      jsonFormDefinition: {
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    valueDestination: 'entity.data.companyName',
                  },
                  {
                    name: 'tax-identification-number-input',
                    type: 'json-form:text',
                    options: {
                      hint: '1234567898765',
                      label: 'Tax Identity Number',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.taxIdentificationNumber',
                  },
                  {
                    name: 'business-type-input',
                    type: 'json-form:dropdown',
                    options: {
                      hint: 'Choose',
                      label: 'Corporate type',
                      uiSchema: {
                        options: [
                          {
                            const: 'sole_proprietorship',
                            title: 'Sole Proprietorship',
                          },
                          {
                            const: 'partnership',
                            title: 'Partnership',
                          },
                          {
                            const: 'corporation',
                            title: 'Corporation',
                          },
                          {
                            const: 'limited_liability_company_(llc)',
                            title: 'Limited Liability Company (LLC)',
                          },
                          {
                            const: 'limited_partnership_(lp)',
                            title: 'Limited Partnership (LP)',
                          },
                          {
                            const: 'limited_liability_partnership_(llp)',
                            title: 'Limited Liability Partnership (LLP)',
                          },
                          {
                            const: 'public_limited_company_(plc)',
                            title: 'Public Limited Company (PLC)',
                          },
                          {
                            const: 'private_limited_company_(ltd)',
                            title: 'Private Limited Company (Ltd)',
                          },
                          {
                            const: 'non-profit_organization',
                            title: 'Non-Profit Organization',
                          },
                          {
                            const: 'cooperative',
                            title: 'Cooperative',
                          },
                          {
                            const: 'trust',
                            title: 'Trust',
                          },
                          {
                            const: 'government',
                            title: 'Government',
                          },
                          {
                            const: 'other',
                            title: 'Other',
                          },
                        ],
                        'ui:field': 'AutocompleteInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.businessType',
                  },
                  {
                    name: 'date-of-establishment-input',
                    type: 'json-form:date',
                    options: {
                      hint: 'DD/MM/YYYY',
                      label: 'Date Of Establishment',
                      uiSchema: {
                        'ui:field': 'DateInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.dateOfEstablishment',
                  },
                ],
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              required: ['data'],
                              properties: {
                                data: {
                                  type: 'object',
                                  required: [
                                    'additionalInfo',
                                    'businessType',
                                    'taxIdentificationNumber',
                                    'companyName',
                                    'country',
                                    'registrationNumber',
                                  ],
                                  properties: {
                                    country: {
                                      type: 'string',
                                      pattern: '^[A-Z]{2}$',
                                      maxLength: 2,
                                      minLength: 2,
                                      errorMessage: {
                                        pattern: 'Please enter a valid country code.',
                                        required: 'Country is required.',
                                        maxLength: 'Country code should have exactly 2 characters.',
                                        minLength: 'Country code should have exactly 2 characters.',
                                      },
                                    },
                                    companyName: {
                                      type: 'string',
                                      maxLength: 100,
                                      minLength: 2,
                                      errorMessage: {
                                        required: 'Company name is required.',
                                        maxLength: 'Company name should not exceed 100 characters.',
                                        minLength:
                                          'Company name should have at least 2 characters.',
                                      },
                                    },
                                    businessType: {
                                      type: 'string',
                                      maxLength: 100,
                                      minLength: 3,
                                      errorMessage: {
                                        required: 'Business type is required.',
                                        maxLength:
                                          'Business type should not exceed 100 characters.',
                                        minLength:
                                          'Business type should have at least 3 characters.',
                                      },
                                    },
                                    additionalInfo: {
                                      type: 'object',
                                      required: ['dateOfEstablishment'],
                                      properties: {
                                        dateOfEstablishment: {
                                          type: 'string',
                                        },
                                      },
                                      errorMessage: {
                                        required: {
                                          dateOfEstablishment: 'Date Of Establishment is required.',
                                        },
                                      },
                                    },
                                    registrationNumber: {
                                      type: 'string',
                                      maxLength: 20,
                                      minLength: 4,
                                      errorMessage: {
                                        required: 'Registration number is required.',
                                        maxLength:
                                          'Registration number should not exceed 20 characters.',
                                        minLength:
                                          'Registration number should have at least 4 characters.',
                                      },
                                    },
                                    taxIdentificationNumber: {
                                      type: 'string',
                                      pattern: '^[^\\s]*$',
                                      maxLength: 15,
                                      minLength: 8,
                                      errorMessage: {
                                        pattern: 'Tax ID must be in valid format.',
                                        required: 'Tax identification number is required.',
                                        maxLength: 'Tax ID should not exceed 15 characters.',
                                        minLength: 'Tax ID should have at least 8 characters.',
                                      },
                                    },
                                  },
                                  errorMessage: {
                                    required: {
                                      country: 'Country is required.',
                                      companyName: 'Company name is required.',
                                      businessType: 'Business type is required.',
                                      additionalInfo: 'Additional information is required.',
                                      numberOfEmployees: 'Number of employees is required.',
                                      registrationNumber: 'Registration number is required.',
                                      taxIdentificationNumber:
                                        'Tax identification number is required.',
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'company_information',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      required: [
                        'additionalInfo',
                        'businessType',
                        'taxIdentificationNumber',
                        'companyName',
                        'country',
                        'registrationNumber',
                      ],
                      properties: {
                        country: {
                          type: 'string',
                          pattern: '^[A-Z]{2}$',
                          maxLength: 2,
                          minLength: 2,
                          errorMessage: {
                            pattern: 'Please enter a valid country code.',
                            required: 'Country is required.',
                            maxLength: 'Country code should have exactly 2 characters.',
                            minLength: 'Country code should have exactly 2 characters.',
                          },
                        },
                        companyName: {
                          type: 'string',
                          maxLength: 100,
                          minLength: 2,
                          errorMessage: {
                            required: 'Company name is required.',
                            maxLength: 'Company name should not exceed 100 characters.',
                            minLength: 'Company name should have at least 2 characters.',
                          },
                        },
                        businessType: {
                          type: 'string',
                          maxLength: 100,
                          minLength: 3,
                          errorMessage: {
                            required: 'Business type is required.',
                            maxLength: 'Business type should not exceed 100 characters.',
                            minLength: 'Business type should have at least 3 characters.',
                          },
                        },
                        additionalInfo: {
                          type: 'object',
                          required: ['dateOfEstablishment'],
                          properties: {
                            dateOfEstablishment: {
                              type: 'string',
                            },
                          },
                          errorMessage: {
                            required: {
                              dateOfEstablishment: 'Date Of Establishment is required.',
                            },
                          },
                        },
                        registrationNumber: {
                          type: 'string',
                          maxLength: 20,
                          minLength: 4,
                          errorMessage: {
                            required: 'Registration number is required.',
                            maxLength: 'Registration number should not exceed 20 characters.',
                            minLength: 'Registration number should have at least 4 characters.',
                          },
                        },
                        taxIdentificationNumber: {
                          type: 'string',
                          pattern: '^[^\\s]*$',
                          maxLength: 15,
                          minLength: 8,
                          errorMessage: {
                            pattern: 'Tax ID must be in valid format.',
                            required: 'Tax identification number is required.',
                            maxLength: 'Tax ID should not exceed 15 characters.',
                            minLength: 'Tax ID should have at least 8 characters.',
                          },
                        },
                      },
                      errorMessage: {
                        required: {
                          country: 'Country is required.',
                          companyName: 'Company name is required.',
                          businessType: 'Business type is required.',
                          additionalInfo: 'Additional information is required.',
                          numberOfEmployees: 'Number of employees is required.',
                          registrationNumber: 'Registration number is required.',
                          taxIdentificationNumber: 'Tax identification number is required.',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        ],
      },
      {
        name: 'Headquarters Address',
        type: 'page',
        number: 3,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              additionalInfo: {
                                type: 'object',
                                default: {},
                                required: ['headquarters'],
                                properties: {
                                  headquarters: {
                                    type: 'object',
                                    default: {},
                                    required: [
                                      'street',
                                      'streetNumber',
                                      'city',
                                      'country',
                                      'postalCode',
                                      'phone',
                                    ],
                                    properties: {
                                      city: {
                                        type: 'string',
                                        maxLength: 50,
                                        minLength: 2,
                                        errorMessage: {
                                          maxLength: 'City should not exceed 50 characters.',
                                          minLength: 'City should be at least 2 characters long.',
                                        },
                                      },
                                      phone: {
                                        type: 'string',
                                        pattern: '^[+]?[0-9]{10,15}$',
                                        errorMessage: {
                                          pattern:
                                            'Phone number must be 10 to 15 digits long and may start with a +.',
                                        },
                                      },
                                      street: {
                                        type: 'string',
                                        maxLength: 100,
                                        minLength: 3,
                                        errorMessage: {
                                          maxLength: 'Street should not exceed 100 characters.',
                                          minLength: 'Street should be at least 3 characters long.',
                                        },
                                      },
                                      country: {
                                        type: 'string',
                                        pattern: '^[A-Z]{2}$',
                                        maxLength: 2,
                                        minLength: 2,
                                        errorMessage: {
                                          pattern: 'Please enter a valid country code.',
                                          maxLength: 'errorMessage.maxLength,country',
                                          minLength:
                                            'Country code should have exactly 2 characters.',
                                        },
                                      },
                                      postalCode: {
                                        type: 'string',
                                      },
                                      streetNumber: {
                                        type: 'number',
                                        maxLength: 10,
                                        minLength: 1,
                                        errorMessage: {
                                          maxLength:
                                            'Street number should not exceed 10 characters.',
                                          minLength: 'Street number is required.',
                                        },
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        city: 'City is required.',
                                        phone: 'A valid phone number is required.',
                                        street: 'Street is required.',
                                        country: 'Country is required.',
                                        postalCode: 'Postal code is required.',
                                        streetNumber: 'Street number is required.',
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
                  },
                },
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Business Address',
                    },
                  },
                  {
                    type: 'h3',
                    options: {
                      text: 'Registered Address',
                      classNames: ['padding-top-10'],
                    },
                  },
                ],
              },
              {
                name: 'business-address-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: [
                      'street-input',
                      'street-number-input',
                      'postal-code-input',
                      'city-input',
                      'country-input',
                      'headquarters-phone-number-input',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'street-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'Downing Street',
                      label: 'Street',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.street',
                  },
                  {
                    name: 'street-number-input',
                    type: 'json-form:text',
                    options: {
                      hint: '10',
                      label: 'Number',
                      jsonFormDefinition: {
                        type: 'number',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.streetNumber',
                  },
                  {
                    name: 'postal-code-input',
                    type: 'json-form:text',
                    options: {
                      hint: '76131',
                      label: 'Postal code',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.postalCode',
                  },
                  {
                    name: 'city-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'London',
                      label: 'City',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.city',
                  },
                  {
                    name: 'country-input',
                    type: 'json-form:country-picker',
                    options: {
                      hint: 'Choose',
                      label: 'Country',
                      uiSchema: {
                        'ui:field': 'CountryPicker',
                        'ui:label': true,
                        'ui:placeholder': 'Choose',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.country',
                  },
                  {
                    name: 'headquarters-phone-number-input',
                    type: 'international-phone-number',
                    options: {
                      label: 'Headquarters phone number',
                      uiSchema: {
                        'ui:field': 'PhoneInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.headquarters.phone',
                  },
                ],
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              properties: {
                                data: {
                                  type: 'object',
                                  properties: {
                                    additionalInfo: {
                                      type: 'object',
                                      default: {},
                                      required: ['headquarters'],
                                      properties: {
                                        headquarters: {
                                          type: 'object',
                                          default: {},
                                          required: [
                                            'street',
                                            'streetNumber',
                                            'city',
                                            'country',
                                            'postalCode',
                                            'phone',
                                          ],
                                          properties: {
                                            city: {
                                              type: 'string',
                                              maxLength: 50,
                                              minLength: 2,
                                              errorMessage: {
                                                maxLength: 'City should not exceed 50 characters.',
                                                minLength:
                                                  'City should be at least 2 characters long.',
                                              },
                                            },
                                            phone: {
                                              type: 'string',
                                              pattern: '^[+]?[0-9]{10,15}$',
                                              errorMessage: {
                                                pattern:
                                                  'Phone number must be 10 to 15 digits long and may start with a +.',
                                              },
                                            },
                                            street: {
                                              type: 'string',
                                              maxLength: 100,
                                              minLength: 3,
                                              errorMessage: {
                                                maxLength:
                                                  'Street should not exceed 100 characters.',
                                                minLength:
                                                  'Street should be at least 3 characters long.',
                                              },
                                            },
                                            country: {
                                              type: 'string',
                                              pattern: '^[A-Z]{2}$',
                                              maxLength: 2,
                                              minLength: 2,
                                              errorMessage: {
                                                pattern: 'Please enter a valid country code.',
                                                maxLength: 'errorMessage.maxLength,country',
                                                minLength:
                                                  'Country code should have exactly 2 characters.',
                                              },
                                            },
                                            postalCode: {
                                              type: 'string',
                                            },
                                            streetNumber: {
                                              type: 'number',
                                              maxLength: 10,
                                              minLength: 1,
                                              errorMessage: {
                                                maxLength:
                                                  'Street number should not exceed 10 characters.',
                                                minLength: 'Street number is required.',
                                              },
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              city: 'City is required.',
                                              phone: 'A valid phone number is required.',
                                              street: 'Street is required.',
                                              country: 'Country is required.',
                                              postalCode: 'Postal code is required.',
                                              streetNumber: 'Street number is required.',
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
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'business_address_information',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        additionalInfo: {
                          type: 'object',
                          default: {},
                          required: ['headquarters'],
                          properties: {
                            headquarters: {
                              type: 'object',
                              default: {},
                              required: [
                                'street',
                                'streetNumber',
                                'city',
                                'country',
                                'postalCode',
                                'phone',
                              ],
                              properties: {
                                city: {
                                  type: 'string',
                                  maxLength: 50,
                                  minLength: 2,
                                  errorMessage: {
                                    maxLength: 'City should not exceed 50 characters.',
                                    minLength: 'City should be at least 2 characters long.',
                                  },
                                },
                                phone: {
                                  type: 'string',
                                  pattern: '^[+]?[0-9]{10,15}$',
                                  errorMessage: {
                                    pattern:
                                      'Phone number must be 10 to 15 digits long and may start with a +.',
                                  },
                                },
                                street: {
                                  type: 'string',
                                  maxLength: 100,
                                  minLength: 3,
                                  errorMessage: {
                                    maxLength: 'Street should not exceed 100 characters.',
                                    minLength: 'Street should be at least 3 characters long.',
                                  },
                                },
                                country: {
                                  type: 'string',
                                  pattern: '^[A-Z]{2}$',
                                  maxLength: 2,
                                  minLength: 2,
                                  errorMessage: {
                                    pattern: 'Please enter a valid country code.',
                                    maxLength: 'errorMessage.maxLength,country',
                                    minLength: 'Country code should have exactly 2 characters.',
                                  },
                                },
                                postalCode: {
                                  type: 'string',
                                },
                                streetNumber: {
                                  type: 'number',
                                  maxLength: 10,
                                  minLength: 1,
                                  errorMessage: {
                                    maxLength: 'Street number should not exceed 10 characters.',
                                    minLength: 'Street number is required.',
                                  },
                                },
                              },
                              errorMessage: {
                                required: {
                                  city: 'City is required.',
                                  phone: 'A valid phone number is required.',
                                  street: 'Street is required.',
                                  country: 'Country is required.',
                                  postalCode: 'Postal code is required.',
                                  streetNumber: 'Street number is required.',
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
            },
          },
        ],
      },
      {
        name: 'Company Activity',
        type: 'page',
        number: 4,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              additionalInfo: {
                                type: 'object',
                                default: {},
                                required: ['store'],
                                properties: {
                                  store: {
                                    type: 'object',
                                    default: {},
                                    required: ['websiteUrls', 'industry'],
                                    properties: {
                                      industry: {
                                        type: 'string',
                                        minLength: 1,
                                        errorMessage: {
                                          minLength: 'errorMessage.minLength.industry',
                                        },
                                      },
                                      websiteUrls: {
                                        type: 'string',
                                        pattern:
                                          '^((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?(, *((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?)*$',
                                        minLength: 1,
                                        errorMessage: {
                                          pattern:
                                            'Website URL(s) should be valid URL(s) separated by comma.',
                                          minLength: 'Website URL(s) is required.',
                                        },
                                      },
                                      processingDetails: {
                                        type: 'object',
                                        default: {},
                                        required: ['annualSalesVolume', 'businessModel'],
                                        properties: {
                                          businessModel: {
                                            type: 'array',
                                            items: {
                                              type: 'string',
                                            },
                                            minItems: 1,
                                            errorMessage: 'Business Model is required.',
                                          },
                                          annualSalesVolume: {
                                            type: 'number',
                                            minimum: 1,
                                            errorMessage: 'Annual Sales Volume must be positive.',
                                          },
                                        },
                                        errorMessage: {
                                          required: {
                                            businessModel: 'Website Business Model is required.',
                                            annualSalesVolume: 'Monthly Sales Volume is required.',
                                          },
                                        },
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        industry: 'Industry is required.',
                                        websiteUrls: 'Website URL(s) is required.',
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
                  },
                },
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Company Activity',
                    },
                  },
                ],
              },
              {
                name: 'story-industry-input-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['store-industry-input'],
                  },
                },
                elements: [
                  {
                    name: 'store-industry-input',
                    type: 'json-form:dropdown',
                    options: {
                      hint: 'Choose',
                      label: 'Industry',
                      uiSchema: {
                        'ui:field': 'IndustriesPicker',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.store.industry',
                  },
                ],
              },
              {
                type: 'h3',
                options: {
                  text: 'Business Model',
                },
              },
              {
                name: 'business-model-input-form',
                type: 'json-form',
                options: {},
                elements: [
                  {
                    name: 'business-model-input',
                    type: 'json-form:select',
                    options: {
                      uiSchema: {
                        options: [
                          {
                            title: 'Membership',
                            value: 'Membership',
                          },
                          {
                            title: 'Direct Purchase',
                            value: 'Direct Purchase',
                          },
                          {
                            title: 'Other',
                            value: 'Other',
                          },
                        ],
                        'ui:field': 'CheckboxList',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.store.processingDetails.businessModel',
                  },
                ],
              },
              {
                name: 'other-business-model-input-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['other-business-model-input'],
                  },
                },
                elements: [
                  {
                    name: 'other-business-model-input',
                    type: 'json-form:text',
                    options: {
                      label: 'Business Model',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.store.processingDetails.otherBusinessModel',
                  },
                ],
                visibleOn: [
                  {
                    type: 'json-logic',
                    value: {
                      in: [
                        'Other',
                        {
                          var: 'entity.data.additionalInfo.store.processingDetails.businessModel',
                        },
                      ],
                    },
                  },
                ],
              },
              {
                name: 'sales-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['annual-sales-volume-input', 'store-website-urls-input'],
                  },
                },
                elements: [
                  {
                    name: 'annual-sales-volume-input',
                    type: 'json-form:text',
                    options: {
                      hint: '5,000,000',
                      label: 'Annual Sales Volume (USD)',
                      jsonFormDefinition: {
                        type: 'number',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.store.processingDetails.annualSalesVolume',
                  },
                  {
                    name: 'store-website-urls-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'www.example.cn',
                      label: 'Website URLs (divide with comma if more than one)',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.store.websiteUrls',
                  },
                ],
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              properties: {
                                data: {
                                  type: 'object',
                                  properties: {
                                    additionalInfo: {
                                      type: 'object',
                                      default: {},
                                      required: ['store'],
                                      properties: {
                                        store: {
                                          type: 'object',
                                          default: {},
                                          required: ['websiteUrls', 'industry'],
                                          properties: {
                                            industry: {
                                              type: 'string',
                                              minLength: 1,
                                              errorMessage: {
                                                minLength: 'errorMessage.minLength.industry',
                                              },
                                            },
                                            websiteUrls: {
                                              type: 'string',
                                              pattern:
                                                '^((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?(, *((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?)*$',
                                              minLength: 1,
                                              errorMessage: {
                                                pattern:
                                                  'Website URL(s) should be valid URL(s) separated by comma.',
                                                minLength: 'Website URL(s) is required.',
                                              },
                                            },
                                            processingDetails: {
                                              type: 'object',
                                              default: {},
                                              required: ['annualSalesVolume', 'businessModel'],
                                              properties: {
                                                businessModel: {
                                                  type: 'array',
                                                  items: {
                                                    type: 'string',
                                                  },
                                                  minItems: 1,
                                                  errorMessage: 'Business Model is required.',
                                                },
                                                annualSalesVolume: {
                                                  type: 'number',
                                                  minimum: 1,
                                                  errorMessage:
                                                    'Annual Sales Volume must be positive.',
                                                },
                                              },
                                              errorMessage: {
                                                required: {
                                                  businessModel:
                                                    'Website Business Model is required.',
                                                  annualSalesVolume:
                                                    'Monthly Sales Volume is required.',
                                                },
                                              },
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              industry: 'Industry is required.',
                                              websiteUrls: 'Website URL(s) is required.',
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
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'company_activity',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        additionalInfo: {
                          type: 'object',
                          default: {},
                          required: ['store'],
                          properties: {
                            store: {
                              type: 'object',
                              default: {},
                              required: ['websiteUrls', 'industry'],
                              properties: {
                                industry: {
                                  type: 'string',
                                  minLength: 1,
                                  errorMessage: {
                                    minLength: 'errorMessage.minLength.industry',
                                  },
                                },
                                websiteUrls: {
                                  type: 'string',
                                  pattern:
                                    '^((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?(, *((https?):\\/\\/)?([a-zA-Z0-9-_]+\\.)+[a-zA-Z0-9]+(\\.[a-z]{2})?(\\/[a-zA-Z0-9_#-]+)*(\\/)?(\\?[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+(&[a-zA-Z0-9_-]+=[a-zA-Z0-9_-]+)*)?(#[a-zA-Z0-9_-]+)?)*$',
                                  minLength: 1,
                                  errorMessage: {
                                    pattern:
                                      'Website URL(s) should be valid URL(s) separated by comma.',
                                    minLength: 'Website URL(s) is required.',
                                  },
                                },
                                processingDetails: {
                                  type: 'object',
                                  default: {},
                                  required: ['annualSalesVolume', 'businessModel'],
                                  properties: {
                                    businessModel: {
                                      type: 'array',
                                      items: {
                                        type: 'string',
                                      },
                                      minItems: 1,
                                      errorMessage: 'Business Model is required.',
                                    },
                                    annualSalesVolume: {
                                      type: 'number',
                                      minimum: 1,
                                      errorMessage: 'Annual Sales Volume must be positive.',
                                    },
                                  },
                                  errorMessage: {
                                    required: {
                                      businessModel: 'Website Business Model is required.',
                                      annualSalesVolume: 'Monthly Sales Volume is required.',
                                    },
                                  },
                                },
                              },
                              errorMessage: {
                                required: {
                                  industry: 'Industry is required.',
                                  websiteUrls: 'Website URL(s) is required.',
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
            },
          },
        ],
      },
      {
        name: 'Bank Information',
        type: 'page',
        number: 5,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        default: {},
                        required: ['data'],
                        properties: {
                          data: {
                            type: 'object',
                            default: {},
                            required: ['additionalInfo'],
                            properties: {
                              additionalInfo: {
                                type: 'object',
                                default: {},
                                required: ['bankInformation'],
                                properties: {
                                  bankInformation: {
                                    type: 'object',
                                    default: {},
                                    required: [
                                      'country',
                                      'name',
                                      'holderName',
                                      'accountNumber',
                                      'currencyCode',
                                    ],
                                    properties: {
                                      name: {
                                        type: 'string',
                                      },
                                      country: {
                                        type: 'string',
                                      },
                                      holderName: {
                                        type: 'string',
                                      },
                                      currencyCode: {
                                        type: 'string',
                                      },
                                      accountNumber: {
                                        type: 'string',
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        name: 'Bank name is required.',
                                        country: 'Bank Country is required.',
                                        holderName: 'Holder name is required.',
                                        currencyCode: 'Account currency is required',
                                        accountNumber: 'Account number is required.',
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
                  },
                },
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Bank Information',
                    },
                  },
                ],
              },
              {
                name: 'bank-information-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: [
                      'bank-country-input',
                      'bank-name-input',
                      'account-holder-name-input',
                      'account-number-input',
                      'account-currency-input',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'bank-country-input',
                    type: 'dropdown',
                    options: {
                      hint: 'United Kingdom',
                      label: 'Bank Country',
                      uiSchema: {
                        'ui:field': 'CountryPicker',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.bankInformation.country',
                  },
                  {
                    name: 'bank-name-input',
                    type: 'text-field',
                    options: {
                      hint: 'Hong Kong Bank',
                      label: 'Bank Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.bankInformation.name',
                  },
                  {
                    name: 'account-holder-name-input',
                    type: 'text-field',
                    options: {
                      hint: 'OpenAI Technologies, Inc.',
                      label: 'Account Holder Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.bankInformation.holderName',
                  },
                  {
                    name: 'account-number-input',
                    type: 'text-field',
                    options: {
                      hint: '0123456789',
                      label: 'Account Number',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.bankInformation.accountNumber',
                  },
                  {
                    name: 'account-currency-input',
                    type: 'text-field',
                    options: {
                      hint: 'GBP',
                      label: 'Account Currency',
                      jsonFormDefinition: {
                        type: 'string',
                        oneOf: [
                          {
                            const: 'AED',
                            title: 'AED',
                          },
                          {
                            const: 'AFN',
                            title: 'AFN',
                          },
                          {
                            const: 'ALL',
                            title: 'ALL',
                          },
                          {
                            const: 'AMD',
                            title: 'AMD',
                          },
                          {
                            const: 'ANG',
                            title: 'ANG',
                          },
                          {
                            const: 'AOA',
                            title: 'AOA',
                          },
                          {
                            const: 'ARS',
                            title: 'ARS',
                          },
                          {
                            const: 'AUD',
                            title: 'AUD',
                          },
                          {
                            const: 'AWG',
                            title: 'AWG',
                          },
                          {
                            const: 'AZN',
                            title: 'AZN',
                          },
                          {
                            const: 'BAM',
                            title: 'BAM',
                          },
                          {
                            const: 'BBD',
                            title: 'BBD',
                          },
                          {
                            const: 'BDT',
                            title: 'BDT',
                          },
                          {
                            const: 'BGN',
                            title: 'BGN',
                          },
                          {
                            const: 'BHD',
                            title: 'BHD',
                          },
                          {
                            const: 'BIF',
                            title: 'BIF',
                          },
                          {
                            const: 'BMD',
                            title: 'BMD',
                          },
                          {
                            const: 'BND',
                            title: 'BND',
                          },
                          {
                            const: 'BOB',
                            title: 'BOB',
                          },
                          {
                            const: 'BOV',
                            title: 'BOV',
                          },
                          {
                            const: 'BRL',
                            title: 'BRL',
                          },
                          {
                            const: 'BSD',
                            title: 'BSD',
                          },
                          {
                            const: 'BTN',
                            title: 'BTN',
                          },
                          {
                            const: 'BWP',
                            title: 'BWP',
                          },
                          {
                            const: 'BYN',
                            title: 'BYN',
                          },
                          {
                            const: 'BZD',
                            title: 'BZD',
                          },
                          {
                            const: 'CAD',
                            title: 'CAD',
                          },
                          {
                            const: 'CDF',
                            title: 'CDF',
                          },
                          {
                            const: 'CHE',
                            title: 'CHE',
                          },
                          {
                            const: 'CHF',
                            title: 'CHF',
                          },
                          {
                            const: 'CHW',
                            title: 'CHW',
                          },
                          {
                            const: 'CLF',
                            title: 'CLF',
                          },
                          {
                            const: 'CLP',
                            title: 'CLP',
                          },
                          {
                            const: 'CNY',
                            title: 'CNY',
                          },
                          {
                            const: 'COP',
                            title: 'COP',
                          },
                          {
                            const: 'COU',
                            title: 'COU',
                          },
                          {
                            const: 'CRC',
                            title: 'CRC',
                          },
                          {
                            const: 'CUC',
                            title: 'CUC',
                          },
                          {
                            const: 'CUP',
                            title: 'CUP',
                          },
                          {
                            const: 'CVE',
                            title: 'CVE',
                          },
                          {
                            const: 'CZK',
                            title: 'CZK',
                          },
                          {
                            const: 'DJF',
                            title: 'DJF',
                          },
                          {
                            const: 'DKK',
                            title: 'DKK',
                          },
                          {
                            const: 'DOP',
                            title: 'DOP',
                          },
                          {
                            const: 'DZD',
                            title: 'DZD',
                          },
                          {
                            const: 'EGP',
                            title: 'EGP',
                          },
                          {
                            const: 'ERN',
                            title: 'ERN',
                          },
                          {
                            const: 'ETB',
                            title: 'ETB',
                          },
                          {
                            const: 'EUR',
                            title: 'EUR',
                          },
                          {
                            const: 'FJD',
                            title: 'FJD',
                          },
                          {
                            const: 'FKP',
                            title: 'FKP',
                          },
                          {
                            const: 'GBP',
                            title: 'GBP',
                          },
                          {
                            const: 'GEL',
                            title: 'GEL',
                          },
                          {
                            const: 'GHS',
                            title: 'GHS',
                          },
                          {
                            const: 'GIP',
                            title: 'GIP',
                          },
                          {
                            const: 'GMD',
                            title: 'GMD',
                          },
                          {
                            const: 'GNF',
                            title: 'GNF',
                          },
                          {
                            const: 'GTQ',
                            title: 'GTQ',
                          },
                          {
                            const: 'GYD',
                            title: 'GYD',
                          },
                          {
                            const: 'HKD',
                            title: 'HKD',
                          },
                          {
                            const: 'HNL',
                            title: 'HNL',
                          },
                          {
                            const: 'HRK',
                            title: 'HRK',
                          },
                          {
                            const: 'HTG',
                            title: 'HTG',
                          },
                          {
                            const: 'HUF',
                            title: 'HUF',
                          },
                          {
                            const: 'IDR',
                            title: 'IDR',
                          },
                          {
                            const: 'ILS',
                            title: 'ILS',
                          },
                          {
                            const: 'INR',
                            title: 'INR',
                          },
                          {
                            const: 'IQD',
                            title: 'IQD',
                          },
                          {
                            const: 'IRR',
                            title: 'IRR',
                          },
                          {
                            const: 'ISK',
                            title: 'ISK',
                          },
                          {
                            const: 'JMD',
                            title: 'JMD',
                          },
                          {
                            const: 'JOD',
                            title: 'JOD',
                          },
                          {
                            const: 'JPY',
                            title: 'JPY',
                          },
                          {
                            const: 'KES',
                            title: 'KES',
                          },
                          {
                            const: 'KGS',
                            title: 'KGS',
                          },
                          {
                            const: 'KHR',
                            title: 'KHR',
                          },
                          {
                            const: 'KMF',
                            title: 'KMF',
                          },
                          {
                            const: 'KPW',
                            title: 'KPW',
                          },
                          {
                            const: 'KRW',
                            title: 'KRW',
                          },
                          {
                            const: 'KWD',
                            title: 'KWD',
                          },
                          {
                            const: 'KYD',
                            title: 'KYD',
                          },
                          {
                            const: 'KZT',
                            title: 'KZT',
                          },
                          {
                            const: 'LAK',
                            title: 'LAK',
                          },
                          {
                            const: 'LBP',
                            title: 'LBP',
                          },
                          {
                            const: 'LKR',
                            title: 'LKR',
                          },
                          {
                            const: 'LRD',
                            title: 'LRD',
                          },
                          {
                            const: 'LSL',
                            title: 'LSL',
                          },
                          {
                            const: 'LYD',
                            title: 'LYD',
                          },
                          {
                            const: 'MAD',
                            title: 'MAD',
                          },
                          {
                            const: 'MDL',
                            title: 'MDL',
                          },
                          {
                            const: 'MGA',
                            title: 'MGA',
                          },
                          {
                            const: 'MKD',
                            title: 'MKD',
                          },
                          {
                            const: 'MMK',
                            title: 'MMK',
                          },
                          {
                            const: 'MNT',
                            title: 'MNT',
                          },
                          {
                            const: 'MOP',
                            title: 'MOP',
                          },
                          {
                            const: 'MRU',
                            title: 'MRU',
                          },
                          {
                            const: 'MUR',
                            title: 'MUR',
                          },
                          {
                            const: 'MVR',
                            title: 'MVR',
                          },
                          {
                            const: 'MWK',
                            title: 'MWK',
                          },
                          {
                            const: 'MXN',
                            title: 'MXN',
                          },
                          {
                            const: 'MXV',
                            title: 'MXV',
                          },
                          {
                            const: 'MYR',
                            title: 'MYR',
                          },
                          {
                            const: 'MZN',
                            title: 'MZN',
                          },
                          {
                            const: 'NAD',
                            title: 'NAD',
                          },
                          {
                            const: 'NGN',
                            title: 'NGN',
                          },
                          {
                            const: 'NIO',
                            title: 'NIO',
                          },
                          {
                            const: 'NOK',
                            title: 'NOK',
                          },
                          {
                            const: 'NPR',
                            title: 'NPR',
                          },
                          {
                            const: 'NZD',
                            title: 'NZD',
                          },
                          {
                            const: 'OMR',
                            title: 'OMR',
                          },
                          {
                            const: 'PAB',
                            title: 'PAB',
                          },
                          {
                            const: 'PEN',
                            title: 'PEN',
                          },
                          {
                            const: 'PGK',
                            title: 'PGK',
                          },
                          {
                            const: 'PHP',
                            title: 'PHP',
                          },
                          {
                            const: 'PKR',
                            title: 'PKR',
                          },
                          {
                            const: 'PLN',
                            title: 'PLN',
                          },
                          {
                            const: 'PYG',
                            title: 'PYG',
                          },
                          {
                            const: 'QAR',
                            title: 'QAR',
                          },
                          {
                            const: 'RON',
                            title: 'RON',
                          },
                          {
                            const: 'RSD',
                            title: 'RSD',
                          },
                          {
                            const: 'RUB',
                            title: 'RUB',
                          },
                          {
                            const: 'RWF',
                            title: 'RWF',
                          },
                          {
                            const: 'SAR',
                            title: 'SAR',
                          },
                          {
                            const: 'SBD',
                            title: 'SBD',
                          },
                          {
                            const: 'SCR',
                            title: 'SCR',
                          },
                          {
                            const: 'SDG',
                            title: 'SDG',
                          },
                          {
                            const: 'SEK',
                            title: 'SEK',
                          },
                          {
                            const: 'SGD',
                            title: 'SGD',
                          },
                          {
                            const: 'SHP',
                            title: 'SHP',
                          },
                          {
                            const: 'SLL',
                            title: 'SLL',
                          },
                          {
                            const: 'SOS',
                            title: 'SOS',
                          },
                          {
                            const: 'SRD',
                            title: 'SRD',
                          },
                          {
                            const: 'SSP',
                            title: 'SSP',
                          },
                          {
                            const: 'STN',
                            title: 'STN',
                          },
                          {
                            const: 'SVC',
                            title: 'SVC',
                          },
                          {
                            const: 'SYP',
                            title: 'SYP',
                          },
                          {
                            const: 'SZL',
                            title: 'SZL',
                          },
                          {
                            const: 'THB',
                            title: 'THB',
                          },
                          {
                            const: 'TJS',
                            title: 'TJS',
                          },
                          {
                            const: 'TMT',
                            title: 'TMT',
                          },
                          {
                            const: 'TND',
                            title: 'TND',
                          },
                          {
                            const: 'TOP',
                            title: 'TOP',
                          },
                          {
                            const: 'TRY',
                            title: 'TRY',
                          },
                          {
                            const: 'TTD',
                            title: 'TTD',
                          },
                          {
                            const: 'TWD',
                            title: 'TWD',
                          },
                          {
                            const: 'TZS',
                            title: 'TZS',
                          },
                          {
                            const: 'UAH',
                            title: 'UAH',
                          },
                          {
                            const: 'UGX',
                            title: 'UGX',
                          },
                          {
                            const: 'USD',
                            title: 'USD',
                          },
                          {
                            const: 'USN',
                            title: 'USN',
                          },
                          {
                            const: 'UYI',
                            title: 'UYI',
                          },
                          {
                            const: 'UYU',
                            title: 'UYU',
                          },
                          {
                            const: 'UYW',
                            title: 'UYW',
                          },
                          {
                            const: 'UZS',
                            title: 'UZS',
                          },
                          {
                            const: 'VES',
                            title: 'VES',
                          },
                          {
                            const: 'VND',
                            title: 'VND',
                          },
                          {
                            const: 'VUV',
                            title: 'VUV',
                          },
                          {
                            const: 'WST',
                            title: 'WST',
                          },
                          {
                            const: 'XAF',
                            title: 'XAF',
                          },
                          {
                            const: 'XAG',
                            title: 'XAG',
                          },
                          {
                            const: 'XAU',
                            title: 'XAU',
                          },
                          {
                            const: 'XBA',
                            title: 'XBA',
                          },
                          {
                            const: 'XBB',
                            title: 'XBB',
                          },
                          {
                            const: 'XBC',
                            title: 'XBC',
                          },
                          {
                            const: 'XBD',
                            title: 'XBD',
                          },
                          {
                            const: 'XCD',
                            title: 'XCD',
                          },
                          {
                            const: 'XDR',
                            title: 'XDR',
                          },
                          {
                            const: 'XOF',
                            title: 'XOF',
                          },
                          {
                            const: 'XPD',
                            title: 'XPD',
                          },
                          {
                            const: 'XPF',
                            title: 'XPF',
                          },
                          {
                            const: 'XPT',
                            title: 'XPT',
                          },
                          {
                            const: 'XSU',
                            title: 'XSU',
                          },
                          {
                            const: 'XTS',
                            title: 'XTS',
                          },
                          {
                            const: 'XUA',
                            title: 'XUA',
                          },
                          {
                            const: 'XXX',
                            title: 'XXX',
                          },
                          {
                            const: 'YER',
                            title: 'YER',
                          },
                          {
                            const: 'ZAR',
                            title: 'ZAR',
                          },
                          {
                            const: 'ZMW',
                            title: 'ZMW',
                          },
                          {
                            const: 'ZWL',
                            title: 'ZWL',
                          },
                        ],
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.bankInformation.currencyCode',
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
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              default: {},
                              required: ['data'],
                              properties: {
                                data: {
                                  type: 'object',
                                  default: {},
                                  required: ['additionalInfo'],
                                  properties: {
                                    additionalInfo: {
                                      type: 'object',
                                      default: {},
                                      required: ['bankInformation'],
                                      properties: {
                                        bankInformation: {
                                          type: 'object',
                                          default: {},
                                          required: [
                                            'country',
                                            'name',
                                            'holderName',
                                            'accountNumber',
                                            'currencyCode',
                                          ],
                                          properties: {
                                            name: {
                                              type: 'string',
                                            },
                                            country: {
                                              type: 'string',
                                            },
                                            holderName: {
                                              type: 'string',
                                            },
                                            currencyCode: {
                                              type: 'string',
                                            },
                                            accountNumber: {
                                              type: 'string',
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              name: 'Bank name is required.',
                                              country: 'Bank Country is required.',
                                              holderName: 'Holder name is required.',
                                              currencyCode: 'Account currency is required',
                                              accountNumber: 'Account number is required.',
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
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'bank_information',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  default: {},
                  required: ['data'],
                  properties: {
                    data: {
                      type: 'object',
                      default: {},
                      required: ['additionalInfo'],
                      properties: {
                        additionalInfo: {
                          type: 'object',
                          default: {},
                          required: ['bankInformation'],
                          properties: {
                            bankInformation: {
                              type: 'object',
                              default: {},
                              required: [
                                'country',
                                'name',
                                'holderName',
                                'accountNumber',
                                'currencyCode',
                              ],
                              properties: {
                                name: {
                                  type: 'string',
                                },
                                country: {
                                  type: 'string',
                                },
                                holderName: {
                                  type: 'string',
                                },
                                currencyCode: {
                                  type: 'string',
                                },
                                accountNumber: {
                                  type: 'string',
                                },
                              },
                              errorMessage: {
                                required: {
                                  name: 'Bank name is required.',
                                  country: 'Bank Country is required.',
                                  holderName: 'Holder name is required.',
                                  currencyCode: 'Account currency is required',
                                  accountNumber: 'Account number is required.',
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
            },
          },
        ],
      },
      {
        name: 'Company Ownership',
        type: 'page',
        number: 6,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'json-schema',
                  value: {
                    type: 'object',
                    required: ['entity'],
                    properties: {
                      entity: {
                        type: 'object',
                        properties: {
                          data: {
                            type: 'object',
                            properties: {
                              additionalInfo: {
                                if: {
                                  properties: {
                                    thereNoCompaniesWithMoreThan25: {
                                      enum: [true],
                                    },
                                  },
                                },
                                else: {
                                  required: ['ubos', 'associatedCompanies'],
                                  properties: {
                                    associatedCompanies: {
                                      minItems: 1,
                                    },
                                  },
                                  errorMessage: {
                                    required: {
                                      ubos: 'UBOs are required.',
                                      associatedCompanies: 'Mark the checkbox or add a company.',
                                    },
                                  },
                                },
                                then: {
                                  required: ['ubos'],
                                  errorMessage: {
                                    required: {
                                      ubos: 'UBOs are required.',
                                    },
                                  },
                                },
                                type: 'object',
                                default: {},
                                properties: {
                                  ubos: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      required: ['firstName', 'lastName', 'email'],
                                      properties: {
                                        email: {
                                          type: 'string',
                                          format: 'email',
                                          maxLength: 100,
                                          errorMessage: {
                                            format: 'Invalid email address.',
                                            maxLength: 'Email should not exceed 100 characters.',
                                          },
                                        },
                                        lastName: {
                                          type: 'string',
                                          maxLength: 50,
                                          minLength: 2,
                                          errorMessage: {
                                            maxLength: 'Last name should not exceed 50 characters.',
                                            minLength:
                                              'Last name must be at least 2 characters long.',
                                          },
                                        },
                                        firstName: {
                                          type: 'string',
                                          maxLength: 50,
                                          minLength: 2,
                                          errorMessage: {
                                            maxLength:
                                              'First name should not exceed 50 characters.',
                                            minLength:
                                              'First name must be at least 2 characters long.',
                                          },
                                        },
                                        additionalInfo: {
                                          type: 'object',
                                          default: {},
                                          required: ['role', 'dateOfBirth'],
                                          properties: {
                                            role: {
                                              type: 'string',
                                            },
                                            dateOfBirth: {
                                              type: 'string',
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              role: 'This field is required.',
                                              dateOfBirth: 'This field is required.',
                                            },
                                          },
                                        },
                                      },
                                      errorMessage: {
                                        required: {
                                          email: 'Email is required.',
                                          lastName: 'Last name is required.',
                                          firstName: 'First name is required.',
                                        },
                                      },
                                    },
                                    minItems: 1,
                                    errorMessage: {
                                      minItems: 'UBOs are required.',
                                    },
                                  },
                                  associatedCompanies: {
                                    type: 'array',
                                    items: {
                                      type: 'object',
                                      required: ['registrationNumber', 'country', 'companyName'],
                                      properties: {
                                        country: {
                                          type: 'string',
                                          pattern: '^[A-Z]{2}$',
                                          maxLength: 2,
                                          minLength: 2,
                                          errorMessage: {
                                            pattern: 'errorMessage.maxLength.pattern',
                                            maxLength:
                                              'Country code should have exactly 2 characters.',
                                            minLength:
                                              'Country code should have exactly 2 characters.',
                                          },
                                        },
                                        companyName: {
                                          type: 'string',
                                          maxLength: 100,
                                          minLength: 2,
                                          errorMessage: {
                                            maxLength:
                                              'Company name should not exceed 100 characters.',
                                            minLength:
                                              'Company name should have at least 2 characters.',
                                          },
                                        },
                                        additionalInfo: {
                                          type: 'object',
                                          default: {},
                                          required: [
                                            'associationRelationship',
                                            'mainRepresentative',
                                          ],
                                          properties: {
                                            mainRepresentative: {
                                              type: 'object',
                                              default: {},
                                              required: ['firstName', 'lastName', 'email'],
                                              properties: {
                                                email: {
                                                  type: 'string',
                                                  format: 'email',
                                                  maxLength: 100,
                                                  errorMessage: {
                                                    format: 'Invalid email address.',
                                                    maxLength:
                                                      'Email should not exceed 100 characters.',
                                                  },
                                                },
                                                lastName: {
                                                  type: 'string',
                                                  maxLength: 50,
                                                  minLength: 2,
                                                  errorMessage: {
                                                    maxLength:
                                                      'Last name should not exceed 50 characters.',
                                                    minLength:
                                                      'Last name must be at least 2 characters long.',
                                                  },
                                                },
                                                firstName: {
                                                  type: 'string',
                                                  maxLength: 50,
                                                  minLength: 2,
                                                  errorMessage: {
                                                    maxLength:
                                                      'First name should not exceed 50 characters.',
                                                    minLength:
                                                      'First name must be at least 2 characters long.',
                                                  },
                                                },
                                              },
                                              errorMessage: {
                                                required: {
                                                  email: 'Email is required.',
                                                  lastName: 'Last name is required.',
                                                  firstName: 'First name is required.',
                                                },
                                              },
                                            },
                                            associationRelationship: {
                                              type: 'string',
                                            },
                                          },
                                          errorMessage: {
                                            required: {
                                              mainRepresentative: 'This field is required.',
                                              associationRelationship: 'This field is required.',
                                            },
                                          },
                                        },
                                        registrationNumber: {
                                          type: 'string',
                                          maxLength: 20,
                                          minLength: 4,
                                          errorMessage: {
                                            maxLength:
                                              'errorMessage.maxLength.companyRegistrationNumber',
                                            minLength:
                                              'errorMessage.minLength.companyRegistrationNumber',
                                          },
                                        },
                                      },
                                      errorMessage: {
                                        required: {
                                          country: 'Country is required.',
                                          companyName: 'Company name is required.',
                                          registrationNumber:
                                            'Company registration number is required.',
                                        },
                                      },
                                    },
                                    errorMessage: {
                                      minItems: 'Mark the checkbox or add a company.',
                                    },
                                  },
                                  thereNoCompaniesWithMoreThan25: {
                                    type: 'boolean',
                                    default: false,
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
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Company Ownership',
                    },
                  },
                  {
                    type: 'h3',
                    options: {
                      text: 'Shareholders',
                      classNames: ['padding-top-10'],
                    },
                  },
                ],
              },
              {
                name: 'im-shareholder-checkbox-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: ['im-shareholder-checkbox'],
                  },
                },
                elements: [
                  {
                    name: 'im-shareholder-checkbox',
                    type: 'checkbox',
                    options: {
                      label: 'I own 25% or more of the company',
                      uiSchema: {
                        'ui:label': false,
                      },
                      jsonFormDefinition: {
                        type: 'boolean',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.imShareholder',
                  },
                ],
              },
              {
                name: 'checkbox-description-1',
                type: 'description',
                options: {
                  descriptionRaw:
                    'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.',
                },
              },
              {
                name: 'ubos-form',
                type: 'json-form',
                options: {
                  uiSchema: {
                    titleTemplate: 'UBO {{INDEX}}',
                  },
                  description:
                    'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.',
                  insertionParams: {
                    schema: {
                      email: 'entity.data.additionalInfo.mainRepresentative.email',
                      lastName: 'entity.data.additionalInfo.mainRepresentative.lastName',
                      firstName: 'entity.data.additionalInfo.mainRepresentative.firstName',
                    },
                    insertWhen: [
                      {
                        type: 'json-logic',
                        value: {
                          '==': [
                            {
                              var: 'entity.data.additionalInfo.imShareholder',
                            },
                            true,
                          ],
                        },
                      },
                    ],
                    removeWhen: [
                      {
                        type: 'json-logic',
                        value: {
                          if: [
                            {
                              var: 'entity.data.additionalInfo.imShareholder',
                            },
                            false,
                            true,
                          ],
                        },
                      },
                    ],
                    destination: 'entity.data.additionalInfo.ubos',
                    disableElements: [
                      {
                        atIndex: 0,
                        elementName: 'ubos:first-name-input',
                      },
                      {
                        atIndex: 0,
                        elementName: 'ubos:last-name-input',
                      },
                      {
                        atIndex: 0,
                        elementName: 'ubos:email-input',
                      },
                    ],
                    insertionStrategy: 'array',
                    bindingAnchorDestination: 'additionalInfo.__isGeneratedAutomatically',
                  },
                  jsonFormDefinition: {
                    type: 'array',
                    title: 'Shareholder',
                    required: [
                      'ubos:first-name-input',
                      'ubos:last-name-input',
                      'ubos:title-input',
                      'ubos:email-input',
                      'ubos:date-of-birth-input',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'ubos:first-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'First Name',
                      label: 'First Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].firstName',
                  },
                  {
                    name: 'ubos:last-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'Last Name',
                      label: 'Last Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].lastName',
                  },
                  {
                    name: 'ubos:title-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'CEO / Manager / Partner',
                      label: 'Title',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.role',
                  },
                  {
                    name: 'ubos:date-of-birth-input',
                    type: 'json-form:date',
                    options: {
                      hint: 'DD/MM/YYYY',
                      label: 'Date of Birth',
                      uiSchema: {
                        'ui:field': 'DateInput',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.ubos[{INDEX}].additionalInfo.dateOfBirth',
                  },
                  {
                    name: 'ubos:email-input',
                    type: 'json-form:email',
                    options: {
                      hint: 'name@companyhk.com',
                      label: 'Email',
                      jsonFormDefinition: {
                        type: 'string',
                        format: 'email',
                      },
                    },
                    valueDestination: 'entity.data.additionalInfo.ubos[{INDEX}].email',
                  },
                ],
                valueDestination: 'entity.data.additionalInfo.ubos',
              },
              {
                type: 'divider',
              },
              {
                type: 'h3',
                options: {
                  text: 'Associated companies',
                  classNames: ['padding-top-10'],
                },
              },
              {
                type: 'description',
                options: {
                  descriptionRaw: 'Add all companies that own more than 25% of the company.',
                },
              },
              {
                name: 'there-no-companies-with-more-than-25-form',
                type: 'json-form',
                elements: [
                  {
                    name: 'there-no-companies-with-more-than-25',
                    type: 'checkbox',
                    options: {
                      label: 'There are no companies with more than 25%',
                      uiSchema: {
                        'ui:label': false,
                      },
                      jsonFormDefinition: {
                        type: 'boolean',
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-logic',
                        value: {
                          if: [
                            {
                              '>=': [
                                {
                                  var: 'entity.data.additionalInfo.associatedCompanies.length',
                                },
                                1,
                              ],
                            },
                            false,
                            true,
                          ],
                        },
                      },
                    ],
                    valueDestination: 'entity.data.additionalInfo.thereNoCompaniesWithMoreThan25',
                  },
                ],
              },
              {
                name: 'companies-form',
                type: 'json-form',
                options: {
                  canAdd: [
                    {
                      type: 'json-logic',
                      value: {
                        '!==': [
                          {
                            var: 'entity.data.additionalInfo.thereNoCompaniesWithMoreThan25',
                          },
                          true,
                          false,
                        ],
                      },
                    },
                  ],
                  uiSchema: {
                    titleTemplate: 'Associated company {{INDEX}}',
                  },
                  description:
                    'Add all of the natural persons that own or control, <br /><b>directly or indirectly</b> more than 25% of the company.',
                  jsonFormDefinition: {
                    type: 'array',
                    title: 'Shareholder',
                    required: [
                      'associatedCompanies:company-registration-number-input',
                      'associatedCompanies:company-country-input',
                      'associatedCompanies:company-legal-name-input',
                      'associatedCompanies:company-association-relationship-input',
                      'associatedCompanies:company-main-representative-first-name-input',
                      'associatedCompanies:company-main-representative-last-name-input',
                      'associatedCompanies:company-main-representative-email-input',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'associatedCompanies:company-registration-number-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'CRN12345678',
                      label: 'Company Registration Number',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].registrationNumber',
                  },
                  {
                    name: 'associatedCompanies:company-country-input',
                    type: 'dropdown',
                    options: {
                      hint: 'United Kingdom',
                      label: 'Registered Country',
                      uiSchema: {
                        'ui:field': 'CountryPicker',
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].country',
                  },
                  {
                    name: 'associatedCompanies:company-legal-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'OpenAI Technologies, Inc.',
                      label: 'Company Legal Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].companyName',
                  },
                  {
                    name: 'associatedCompanies:company-association-relationship-input',
                    type: 'json-form:date',
                    options: {
                      hint: 'Parent of / Subsidiary of / Sister company of',
                      label: 'Relationship',
                      uiSchema: {
                        'ui:field': 'RelationshipDropdown',
                        'ui:label': true,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                      companyNameDestination: 'entity.data.companyName',
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.associationRelationship',
                  },
                  {
                    name: 'associatedCompanies:company-main-representative-first-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'John',
                      label: 'Representative First Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.firstName',
                  },
                  {
                    name: 'associatedCompanies:company-main-representative-last-name-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'Deo',
                      label: 'Representative Last Name',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.lastName',
                  },
                  {
                    name: 'associatedCompanies:company-main-representative-email-input',
                    type: 'json-form:text',
                    options: {
                      hint: 'example@example.com',
                      label: 'Representative Email',
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination:
                      'entity.data.additionalInfo.associatedCompanies[{INDEX}].additionalInfo.mainRepresentative.email',
                  },
                ],
                valueDestination: 'entity.data.additionalInfo.associatedCompanies',
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Continue',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'json-schema',
                        value: {
                          type: 'object',
                          required: ['entity'],
                          properties: {
                            entity: {
                              type: 'object',
                              properties: {
                                data: {
                                  type: 'object',
                                  properties: {
                                    additionalInfo: {
                                      if: {
                                        properties: {
                                          thereNoCompaniesWithMoreThan25: {
                                            enum: [true],
                                          },
                                        },
                                      },
                                      else: {
                                        required: ['ubos', 'associatedCompanies'],
                                        properties: {
                                          associatedCompanies: {
                                            minItems: 1,
                                          },
                                        },
                                        errorMessage: {
                                          required: {
                                            ubos: 'UBOs are required.',
                                            associatedCompanies:
                                              'Mark the checkbox or add a company.',
                                          },
                                        },
                                      },
                                      then: {
                                        required: ['ubos'],
                                        errorMessage: {
                                          required: {
                                            ubos: 'UBOs are required.',
                                          },
                                        },
                                      },
                                      type: 'object',
                                      default: {},
                                      properties: {
                                        ubos: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: ['firstName', 'lastName', 'email'],
                                            properties: {
                                              email: {
                                                type: 'string',
                                                format: 'email',
                                                maxLength: 100,
                                                errorMessage: {
                                                  format: 'Invalid email address.',
                                                  maxLength:
                                                    'Email should not exceed 100 characters.',
                                                },
                                              },
                                              lastName: {
                                                type: 'string',
                                                maxLength: 50,
                                                minLength: 2,
                                                errorMessage: {
                                                  maxLength:
                                                    'Last name should not exceed 50 characters.',
                                                  minLength:
                                                    'Last name must be at least 2 characters long.',
                                                },
                                              },
                                              firstName: {
                                                type: 'string',
                                                maxLength: 50,
                                                minLength: 2,
                                                errorMessage: {
                                                  maxLength:
                                                    'First name should not exceed 50 characters.',
                                                  minLength:
                                                    'First name must be at least 2 characters long.',
                                                },
                                              },
                                              additionalInfo: {
                                                type: 'object',
                                                default: {},
                                                required: ['role', 'dateOfBirth'],
                                                properties: {
                                                  role: {
                                                    type: 'string',
                                                  },
                                                  dateOfBirth: {
                                                    type: 'string',
                                                  },
                                                },
                                                errorMessage: {
                                                  required: {
                                                    role: 'This field is required.',
                                                    dateOfBirth: 'This field is required.',
                                                  },
                                                },
                                              },
                                            },
                                            errorMessage: {
                                              required: {
                                                email: 'Email is required.',
                                                lastName: 'Last name is required.',
                                                firstName: 'First name is required.',
                                              },
                                            },
                                          },
                                          minItems: 1,
                                          errorMessage: {
                                            minItems: 'UBOs are required.',
                                          },
                                        },
                                        associatedCompanies: {
                                          type: 'array',
                                          items: {
                                            type: 'object',
                                            required: [
                                              'registrationNumber',
                                              'country',
                                              'companyName',
                                            ],
                                            properties: {
                                              country: {
                                                type: 'string',
                                                pattern: '^[A-Z]{2}$',
                                                maxLength: 2,
                                                minLength: 2,
                                                errorMessage: {
                                                  pattern: 'errorMessage.maxLength.pattern',
                                                  maxLength:
                                                    'Country code should have exactly 2 characters.',
                                                  minLength:
                                                    'Country code should have exactly 2 characters.',
                                                },
                                              },
                                              companyName: {
                                                type: 'string',
                                                maxLength: 100,
                                                minLength: 2,
                                                errorMessage: {
                                                  maxLength:
                                                    'Company name should not exceed 100 characters.',
                                                  minLength:
                                                    'Company name should have at least 2 characters.',
                                                },
                                              },
                                              additionalInfo: {
                                                type: 'object',
                                                default: {},
                                                required: [
                                                  'associationRelationship',
                                                  'mainRepresentative',
                                                ],
                                                properties: {
                                                  mainRepresentative: {
                                                    type: 'object',
                                                    default: {},
                                                    required: ['firstName', 'lastName', 'email'],
                                                    properties: {
                                                      email: {
                                                        type: 'string',
                                                        format: 'email',
                                                        maxLength: 100,
                                                        errorMessage: {
                                                          format: 'Invalid email address.',
                                                          maxLength:
                                                            'Email should not exceed 100 characters.',
                                                        },
                                                      },
                                                      lastName: {
                                                        type: 'string',
                                                        maxLength: 50,
                                                        minLength: 2,
                                                        errorMessage: {
                                                          maxLength:
                                                            'Last name should not exceed 50 characters.',
                                                          minLength:
                                                            'Last name must be at least 2 characters long.',
                                                        },
                                                      },
                                                      firstName: {
                                                        type: 'string',
                                                        maxLength: 50,
                                                        minLength: 2,
                                                        errorMessage: {
                                                          maxLength:
                                                            'First name should not exceed 50 characters.',
                                                          minLength:
                                                            'First name must be at least 2 characters long.',
                                                        },
                                                      },
                                                    },
                                                    errorMessage: {
                                                      required: {
                                                        email: 'Email is required.',
                                                        lastName: 'Last name is required.',
                                                        firstName: 'First name is required.',
                                                      },
                                                    },
                                                  },
                                                  associationRelationship: {
                                                    type: 'string',
                                                  },
                                                },
                                                errorMessage: {
                                                  required: {
                                                    mainRepresentative: 'This field is required.',
                                                    associationRelationship:
                                                      'This field is required.',
                                                  },
                                                },
                                              },
                                              registrationNumber: {
                                                type: 'string',
                                                maxLength: 20,
                                                minLength: 4,
                                                errorMessage: {
                                                  maxLength:
                                                    'errorMessage.maxLength.companyRegistrationNumber',
                                                  minLength:
                                                    'errorMessage.minLength.companyRegistrationNumber',
                                                },
                                              },
                                            },
                                            errorMessage: {
                                              required: {
                                                country: 'Country is required.',
                                                companyName: 'Company name is required.',
                                                registrationNumber:
                                                  'Company registration number is required.',
                                              },
                                            },
                                          },
                                          errorMessage: {
                                            minItems: 'Mark the checkbox or add a company.',
                                          },
                                        },
                                        thereNoCompaniesWithMoreThan25: {
                                          type: 'boolean',
                                          default: false,
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
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'company_ownership',
        pageValidation: [
          {
            type: 'json-schema',
            value: {
              type: 'object',
              required: ['entity'],
              properties: {
                entity: {
                  type: 'object',
                  properties: {
                    data: {
                      type: 'object',
                      properties: {
                        additionalInfo: {
                          if: {
                            properties: {
                              thereNoCompaniesWithMoreThan25: {
                                enum: [true],
                              },
                            },
                          },
                          else: {
                            required: ['ubos', 'associatedCompanies'],
                            properties: {
                              associatedCompanies: {
                                minItems: 1,
                              },
                            },
                            errorMessage: {
                              required: {
                                ubos: 'UBOs are required.',
                                associatedCompanies: 'Mark the checkbox or add a company.',
                              },
                            },
                          },
                          then: {
                            required: ['ubos'],
                            errorMessage: {
                              required: {
                                ubos: 'UBOs are required.',
                              },
                            },
                          },
                          type: 'object',
                          default: {},
                          properties: {
                            ubos: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['firstName', 'lastName', 'email'],
                                properties: {
                                  email: {
                                    type: 'string',
                                    format: 'email',
                                    maxLength: 100,
                                    errorMessage: {
                                      format: 'Invalid email address.',
                                      maxLength: 'Email should not exceed 100 characters.',
                                    },
                                  },
                                  lastName: {
                                    type: 'string',
                                    maxLength: 50,
                                    minLength: 2,
                                    errorMessage: {
                                      maxLength: 'Last name should not exceed 50 characters.',
                                      minLength: 'Last name must be at least 2 characters long.',
                                    },
                                  },
                                  firstName: {
                                    type: 'string',
                                    maxLength: 50,
                                    minLength: 2,
                                    errorMessage: {
                                      maxLength: 'First name should not exceed 50 characters.',
                                      minLength: 'First name must be at least 2 characters long.',
                                    },
                                  },
                                  additionalInfo: {
                                    type: 'object',
                                    default: {},
                                    required: ['role', 'dateOfBirth'],
                                    properties: {
                                      role: {
                                        type: 'string',
                                      },
                                      dateOfBirth: {
                                        type: 'string',
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        role: 'This field is required.',
                                        dateOfBirth: 'This field is required.',
                                      },
                                    },
                                  },
                                },
                                errorMessage: {
                                  required: {
                                    email: 'Email is required.',
                                    lastName: 'Last name is required.',
                                    firstName: 'First name is required.',
                                  },
                                },
                              },
                              minItems: 1,
                              errorMessage: {
                                minItems: 'UBOs are required.',
                              },
                            },
                            associatedCompanies: {
                              type: 'array',
                              items: {
                                type: 'object',
                                required: ['registrationNumber', 'country', 'companyName'],
                                properties: {
                                  country: {
                                    type: 'string',
                                    pattern: '^[A-Z]{2}$',
                                    maxLength: 2,
                                    minLength: 2,
                                    errorMessage: {
                                      pattern: 'errorMessage.maxLength.pattern',
                                      maxLength: 'Country code should have exactly 2 characters.',
                                      minLength: 'Country code should have exactly 2 characters.',
                                    },
                                  },
                                  companyName: {
                                    type: 'string',
                                    maxLength: 100,
                                    minLength: 2,
                                    errorMessage: {
                                      maxLength: 'Company name should not exceed 100 characters.',
                                      minLength: 'Company name should have at least 2 characters.',
                                    },
                                  },
                                  additionalInfo: {
                                    type: 'object',
                                    default: {},
                                    required: ['associationRelationship', 'mainRepresentative'],
                                    properties: {
                                      mainRepresentative: {
                                        type: 'object',
                                        default: {},
                                        required: ['firstName', 'lastName', 'email'],
                                        properties: {
                                          email: {
                                            type: 'string',
                                            format: 'email',
                                            maxLength: 100,
                                            errorMessage: {
                                              format: 'Invalid email address.',
                                              maxLength: 'Email should not exceed 100 characters.',
                                            },
                                          },
                                          lastName: {
                                            type: 'string',
                                            maxLength: 50,
                                            minLength: 2,
                                            errorMessage: {
                                              maxLength:
                                                'Last name should not exceed 50 characters.',
                                              minLength:
                                                'Last name must be at least 2 characters long.',
                                            },
                                          },
                                          firstName: {
                                            type: 'string',
                                            maxLength: 50,
                                            minLength: 2,
                                            errorMessage: {
                                              maxLength:
                                                'First name should not exceed 50 characters.',
                                              minLength:
                                                'First name must be at least 2 characters long.',
                                            },
                                          },
                                        },
                                        errorMessage: {
                                          required: {
                                            email: 'Email is required.',
                                            lastName: 'Last name is required.',
                                            firstName: 'First name is required.',
                                          },
                                        },
                                      },
                                      associationRelationship: {
                                        type: 'string',
                                      },
                                    },
                                    errorMessage: {
                                      required: {
                                        mainRepresentative: 'This field is required.',
                                        associationRelationship: 'This field is required.',
                                      },
                                    },
                                  },
                                  registrationNumber: {
                                    type: 'string',
                                    maxLength: 20,
                                    minLength: 4,
                                    errorMessage: {
                                      maxLength: 'errorMessage.maxLength.companyRegistrationNumber',
                                      minLength: 'errorMessage.minLength.companyRegistrationNumber',
                                    },
                                  },
                                },
                                errorMessage: {
                                  required: {
                                    country: 'Country is required.',
                                    companyName: 'Company name is required.',
                                    registrationNumber: 'Company registration number is required.',
                                  },
                                },
                              },
                              errorMessage: {
                                minItems: 'Mark the checkbox or add a company.',
                              },
                            },
                            thereNoCompaniesWithMoreThan25: {
                              type: 'boolean',
                              default: false,
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
        ],
      },
      {
        name: 'Company Documents',
        type: 'page',
        number: 7,
        actions: [
          {
            type: 'definitionEvent',
            params: {
              eventName: 'NEXT',
            },
            dispatchOn: {
              rules: [
                {
                  type: 'destination-engine',
                  value: [
                    {
                      required: true,
                      documentId: 'document-bank-statement',
                      destination: 'pages[0].ballerineFileId',
                      errorMessage: 'Bank Statement is Required',
                    },
                    {
                      required: true,
                      documentId: 'document-company-structure',
                      destination: 'pages[0].ballerineFileId',
                      errorMessage: 'Company structure is Required',
                    },
                    {
                      required: true,
                      documentId: 'document-certificate-of-registration',
                      destination: 'pages[0].ballerineFileId',
                      errorMessage: 'Certificate of Registration is Required',
                    },
                  ],
                },
              ],
              uiEvents: [
                {
                  event: 'onClick',
                  uiElementName: 'next-page-button',
                },
              ],
            },
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
                      text: 'Company Documents',
                    },
                  },
                  {
                    type: 'h3',
                    options: {
                      text: 'Merchant Company Documents',
                    },
                  },
                ],
              },
              {
                name: 'company-documents-form',
                type: 'json-form',
                options: {
                  jsonFormDefinition: {
                    required: [
                      'document-bank-statement',
                      'document-company-structure',
                      'document-certificate-of-registration',
                    ],
                  },
                },
                elements: [
                  {
                    name: 'document-bank-statement',
                    type: 'document',
                    options: {
                      label: 'Bank Statement',
                      uiSchema: {
                        'ui:field': 'DocumentInput',
                      },
                      description: 'Not older than 6 months',
                      documentData: {
                        id: 'document-bank-statement',
                        type: 'bank_statement',
                        issuer: {
                          country: 'GH',
                        },
                        version: '1',
                        category: 'proof_of_address',
                        properties: {},
                        issuingVersion: 1,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'documents[0].pages[0].ballerineFileId',
                  },
                  {
                    name: 'document-company-structure',
                    type: 'document',
                    options: {
                      label: 'Company structure (directors & legal representatives)',
                      uiSchema: {
                        'ui:field': 'DocumentInput',
                      },
                      description: 'Notarized document',
                      documentData: {
                        id: 'document-company-structure',
                        type: 'payslip',
                        issuer: {
                          country: 'GH',
                        },
                        version: '1',
                        category: 'proof_of_employment',
                        properties: {},
                        issuingVersion: 1,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'documents[1].pages[0].ballerineFileId',
                  },
                  {
                    name: 'document-certificate-of-registration',
                    type: 'document',
                    options: {
                      label: 'Certificate of Registration',
                      uiSchema: {
                        'ui:field': 'DocumentInput',
                      },
                      documentData: {
                        id: 'document-certificate-of-registration',
                        type: 'certificate_of_registration',
                        issuer: {
                          country: 'GH',
                        },
                        version: '1',
                        category: 'proof_of_registration',
                        properties: {},
                        issuingVersion: 1,
                      },
                      jsonFormDefinition: {
                        type: 'string',
                      },
                    },
                    valueDestination: 'documents[2].pages[0].ballerineFileId',
                  },
                ],
              },
              {
                name: 'accuracy-description',
                type: 'description',
                options: {
                  descriptionRaw:
                    "By clicking 'Finish', an email containing an identity verification link will be sent to the shareholders listed.",
                },
              },
              {
                name: 'controls-container',
                type: 'container',
                options: {
                  align: 'right',
                },
                elements: [
                  {
                    name: 'next-page-button',
                    type: 'submit-button',
                    options: {
                      text: 'Finish',
                      uiDefinition: {
                        classNames: ['align-right', 'padding-top-10'],
                      },
                    },
                    availableOn: [
                      {
                        type: 'destination-engine',
                        value: [
                          {
                            required: true,
                            documentId: 'document-bank-statement',
                            destination: 'pages[0].ballerineFileId',
                            errorMessage: 'Bank Statement is Required',
                          },
                          {
                            required: true,
                            documentId: 'document-company-structure',
                            destination: 'pages[0].ballerineFileId',
                            errorMessage: 'Company structure is Required',
                          },
                          {
                            required: true,
                            documentId: 'document-certificate-of-registration',
                            destination: 'pages[0].ballerineFileId',
                            errorMessage: 'Certificate of Registration is Required',
                          },
                        ],
                      },
                      {
                        type: 'jmespath',
                        value: '!contains(uiState.elements.*.isLoading,`true`)',
                      },
                      {
                        type: 'json-logic',
                        value: {
                          '==': [
                            {
                              var: 'entity.data.additionalInfo.hasConfirmed',
                            },
                            true,
                            false,
                          ],
                        },
                      },
                      {
                        type: 'json-logic',
                        value: {
                          '!==': [
                            {
                              var: 'uiState.isLoading',
                            },
                            true,
                            false,
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
        stateName: 'company_documents',
        pageValidation: [
          {
            type: 'destination-engine',
            value: [
              {
                required: true,
                documentId: 'document-bank-statement',
                destination: 'pages[0].ballerineFileId',
                errorMessage: 'Bank Statement is Required',
              },
              {
                required: true,
                documentId: 'document-company-structure',
                destination: 'pages[0].ballerineFileId',
                errorMessage: 'Company structure is Required',
              },
              {
                required: true,
                documentId: 'document-certificate-of-registration',
                destination: 'pages[0].ballerineFileId',
                errorMessage: 'Certificate of Registration is Required',
              },
            ],
          },
        ],
      },
    ],
  },
  definition: {
    definition: {
      id: 'dynamic_collection_flow',
      states: {
        finish: {
          type: 'final',
        },
        bank_information: {
          on: {
            NEXT: 'company_ownership',
            PREVIOUS: 'company_activity',
          },
        },
        company_activity: {
          on: {
            NEXT: 'bank_information',
            PREVIOUS: 'business_address_information',
          },
        },
        personal_details: {
          on: {
            NEXT: 'company_information',
          },
        },
        company_documents: {
          on: {
            NEXT: 'finish',
            PREVIOUS: 'company_ownership',
          },
        },
        company_ownership: {
          on: {
            NEXT: 'company_documents',
            PREVIOUS: 'bank_information',
          },
        },
        company_information: {
          on: {
            NEXT: 'business_address_information',
            PREVIOUS: 'personal_details',
          },
        },
        business_address_information: {
          on: {
            NEXT: 'company_activity',
            PREVIOUS: 'company_information',
          },
        },
      },
      context: {},
      initial: 'personal_details',
      predictableActionArguments: true,
    },
    extensions: {
      apiPlugins: [
        {
          url: '{flowConfig.apiUrl}/api/v1/collection-flow/end-user?token={flowConfig.tokenId}',
          name: 'update_end_user',
          method: 'POST',
          headers: {
            Authorization: 'Bearer {flowConfig.tokenId}',
          },
          request: {
            transform: [
              {
                mapping:
                  '{\n              firstName: entity.data.additionalInfo.mainRepresentative.firstName,\n              lastName: entity.data.additionalInfo.mainRepresentative.lastName,\n              additionalInfo: {title: entity.data.additionalInfo.mainRepresentative.additionalInfo.jobTitle},\n              phone: entity.data.additionalInfo.mainRepresentative.phone,\n              dateOfBirth: entity.data.additionalInfo.mainRepresentative.dateOfBirth\n              }',
                transformer: 'jmespath',
              },
            ],
          },
          pluginKind: 'api',
          stateNames: [],
        },
      ],
    },
    definitionType: 'statechart-json',
  },
};

const context = {
  entity: {
    data: {
      additionalInfo: {
        mainRepresentative: {
          email: 'test@gmail.com',
          lastName: 'Doe',
          firstName: 'John',
          additionalInfo: {},
        },
      },
    },
    type: 'business',
    ballerineEntityId: 'ckkt3rv4z4004qxtte4vz9e97',
  },
  metadata: {
    token: '12345678-1234-1234-1234-123456789012',
    webUiSDKUrl: 'http://localhost:5202',
    collectionFlowUrl: 'http://localhost:5201',
  },
  documents: [],
  workflowId: 'kyb_with_associated_companies_example',
};

const customer = {
  id: 'customer-1',
  name: 'customer-1',
  displayName: 'Customer 1',
  logoImageUri: 'https://cdn.ballerine.io/images/ballerine_logo.svg',
  faviconImageUri: '',
  country: 'GB',
  language: 'en',
  websiteUrl: null,
  projects: [
    {
      id: 'project-1',
      name: 'Project 1',
      customerId: 'customer-1',
    },
  ],
  subscriptions: null,
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: App,
    children: [
      {
        path: '',
        element: <Navigate to="/overview" replace />,
      },
      {
        path: '/auth/signin',
        Component: SignIn,
      },
      {
        path: 'overview',
        // TODO: get rid of this hook and rework routing to use authenticated layout
        Component: withSessionProtected(Overview),
      },
      {
        path: 'workflows',
        Component: withSessionProtected(Workflows),
      },
      {
        path: 'workflow-definitions',
        Component: withSessionProtected(WorkflowDefinitions),
      },
      {
        path: 'workflow-definitions/:id',
        Component: withSessionProtected(WorkflowDefinition),
      },
      {
        path: 'filters',
        Component: withSessionProtected(Filters),
      },
      {
        path: 'ui-definitions',
        Component: withSessionProtected(UIDefinitions),
      },
      {
        path: 'alert-definitions',
        Component: withSessionProtected(AlertDefinitions),
      },
    ],
  },
]);
