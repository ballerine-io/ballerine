import { JSONSchema7 } from 'json-schema';

export const rootSchema: JSONSchema7 = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  definitions: {
    User: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        firstName: {
          type: 'string',
        },
        lastName: {
          type: 'string',
        },
        email: {
          type: 'string',
        },
        phone: {
          type: ['string', 'null'],
        },
        password: {
          type: 'string',
        },
        roles: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
      },
    },
    EndUser: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        correlationId: {
          type: 'string',
        },
        verificationId: {
          type: ['string', 'null'],
        },
        endUserType: {
          type: ['string', 'null'],
        },
        approvalState: {
          type: 'string',
          default: 'NEW',
          enum: ['APPROVED', 'REJECTED', 'PROCESSING', 'NEW'],
        },
        stateReason: {
          type: ['string', 'null'],
        },
        jsonData: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        firstName: {
          type: ['string', 'null'],
        },
        lastName: {
          type: ['string', 'null'],
        },
        email: {
          type: ['string', 'null'],
        },
        phone: {
          type: ['string', 'null'],
        },
        dateOfBirth: {
          type: ['string', 'null'],
          format: 'date-time',
        },
        avatarUrl: {
          type: ['string', 'null'],
        },
        additionalInfo: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        workflowRuntimeData: {
          type: 'array',
          items: {
            $ref: '#/definitions/WorkflowRuntimeData',
          },
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
        business: {
          anyOf: [
            {
              $ref: '#/definitions/Business',
            },
            {
              type: 'null',
            },
          ],
        },
        businessId: {
          type: ['string', 'null'],
        },
      },
    },
    Business: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
        companyName: {
          type: 'string',
        },
        registrationNumber: {
          type: 'string',
        },
        legalForm: {
          type: 'string',
        },
        countryOfIncorporation: {
          type: 'string',
        },
        dateOfIncorporation: {
          type: ['string', 'null'],
          format: 'date-time',
        },
        address: {
          type: 'string',
        },
        phoneNumber: {
          type: ['string', 'null'],
        },
        email: {
          type: ['string', 'null'],
        },
        website: {
          type: ['string', 'null'],
        },
        industry: {
          type: 'string',
        },
        taxIdentificationNumber: {
          type: ['string', 'null'],
        },
        vatNumber: {
          type: ['string', 'null'],
        },
        endUsers: {
          type: 'array',
          items: {
            $ref: '#/definitions/EndUser',
          },
        },
        shareholderStructure: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        numberOfEmployees: {
          type: ['integer', 'null'],
        },
        businessPurpose: {
          type: ['string', 'null'],
        },
        documents: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        approvalState: {
          type: 'string',
          default: 'PROCESSING',
          enum: ['APPROVED', 'REJECTED', 'PROCESSING', 'NEW'],
        },
      },
    },
    WorkflowDefinition: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        reviewMachineId: {
          type: ['string', 'null'],
        },
        name: {
          type: 'string',
        },
        version: {
          type: 'integer',
          default: 1,
        },
        definitionType: {
          type: 'string',
        },
        definition: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        supportedPlatforms: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        extensions: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        backend: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        persistStates: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        submitStates: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
        createdBy: {
          type: 'string',
          default: 'SYSTEM',
        },
        workflowRuntimeData: {
          type: 'array',
          items: {
            $ref: '#/definitions/WorkflowRuntimeData',
          },
        },
      },
    },
    WorkflowRuntimeData: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        endUser: {
          $ref: '#/definitions/EndUser',
        },
        endUserId: {
          type: 'string',
        },
        workflowDefinition: {
          $ref: '#/definitions/WorkflowDefinition',
        },
        workflowDefinitionId: {
          type: 'string',
        },
        workflowDefinitionVersion: {
          type: 'integer',
        },
        context: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        state: {
          type: ['string', 'null'],
        },
        status: {
          type: 'string',
          default: 'created',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        updatedAt: {
          type: 'string',
          format: 'date-time',
        },
        createdBy: {
          type: 'string',
          default: 'SYSTEM',
        },
      },
    },
    File: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        userId: {
          type: 'string',
        },
        fileNameOnDisk: {
          type: 'string',
        },
        createdAt: {
          type: 'string',
          format: 'date-time',
        },
        createdBy: {
          type: 'string',
          default: 'SYSTEM',
        },
      },
    },
    Policy: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        version: {
          type: 'integer',
        },
        tasks: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
        rulesSets: {
          type: ['number', 'string', 'boolean', 'object', 'array', 'null'],
        },
      },
    },
  },
  type: 'object',
  properties: {
    user: {
      $ref: '#/definitions/User',
    },
    endUser: {
      $ref: '#/definitions/EndUser',
    },
    business: {
      $ref: '#/definitions/Business',
    },
    workflowDefinition: {
      $ref: '#/definitions/WorkflowDefinition',
    },
    workflowRuntimeData: {
      $ref: '#/definitions/WorkflowRuntimeData',
    },
    file: {
      $ref: '#/definitions/File',
    },
    policy: {
      $ref: '#/definitions/Policy',
    },
  },
};
