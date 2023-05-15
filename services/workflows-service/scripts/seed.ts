import * as dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { parseSalt, Salt } from '../src/auth/password/password.service';
import { hash } from 'bcrypt';
import { customSeed } from './custom-seed';
import { businessIds, endUserIds, generateBusiness, generateEndUser } from './generate-end-user';

if (require.main === module) {
  dotenv.config();

  const { BCRYPT_SALT } = process.env;

  if (!BCRYPT_SALT) {
    throw new Error('BCRYPT_SALT environment variable must be defined');
  }

  const salt = parseSalt(BCRYPT_SALT);

  seed(salt).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

async function seed(bcryptSalt: Salt) {
  console.info('Seeding database...');

  const client = new PrismaClient();
  const data = {
    email: 'admin@admin.com',
    firstName: 'admin',
    lastName: 'admin',
    password: await hash('admin', bcryptSalt),
    roles: ['user'],
  };
  await client.user.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  });

  const manualMachineId = 'MANUAL_REVIEW_0002zpeid7bq9aaa';
  const manualMachineVersion = 1;

  const onboardingMachineKycId = 'COLLECT_DOCS_b0002zpeid7bq9aaa';
  const onboardingMachineKybId = 'COLLECT_DOCS_b0002zpeid7bq9bbb';
  const riskScoreMachineKybId = 'risk-score-improvement-dev';

  const user = await client.endUser.create({
    data: {
      id: '43a0a298-0d02-4a2e-a8cc-73c06b465310',
      firstName: 'Nadia',
      lastName: 'Comaneci',
      email: 'nadia@ballerine.com',
      correlationId: '1',
      dateOfBirth: '2000-11-04T12:45:51.695Z',
    },
  });
  const faker = require('faker');

  function createMockContextData() {
    let mockData = {
      entity: {
        entityType: 'business',
        entityData: {},
        additionalDetails: {},
        ballerineEntityId: faker.datatype.uuid(),
        id: faker.datatype.uuid(),
      },
      documents: [
        {
          category: 'ID',
          type: 'photo',
          issuer: {
            type: 'government',
            name: 'Government',
            country: faker.address.country(),
            city: faker.address.city(),
            additionalDetails: {},
          },
          issuingVersion: 1,
          decision: {
            status: 'revision',
            rejectionReason: '',
            revisionReason: 'Blurry image',
          },
          version: 1,
          pages: [
            {
              ballerineFileId: faker.datatype.uuid(),
              provider: 'http',
              uri: faker.internet.url(),
              type: 'jpg',
              data: '',
              metadata: {
                side: 'front',
                pageNumber: '1',
              },
            },
            {
              ballerineFileId: faker.datatype.uuid(),
              provider: 'http',
              uri: faker.internet.url(),
              type: 'jpg',
              data: '',
              metadata: {
                side: 'back',
                pageNumber: '1',
              },
            },
          ],
          properties: {
            fullName: {
              type: 'string',
              value: faker.name.findName(),
            },
            dateOfBirth: {
              type: 'date',
              value: faker.date.past(30).toISOString().split('T')[0],
            },
            nationality: {
              type: 'string',
              value: faker.address.country(),
            },
          },
        },
        {
          category: 'incorporation',
          type: 'certificate',
          issuer: {
            type: 'government',
            name: 'Government',
            country: faker.address.country(),
            city: faker.address.city(),
            additionalDetails: {},
          },
          issuingVersion: 1,
          decision: {
            status: 'approved',
            rejectionReason: '',
            revisionReason: '',
          },
          version: 1,
          pages: [
            {
              ballerineFileId: faker.datatype.uuid(),
              provider: 'http',
              uri: faker.internet.url(),
              type: 'pdf',
              data: '',
              metadata: {},
            },
          ],
          properties: {
            companyName: {
              type: 'string',
              value: faker.company.companyName(),
            },
            registrationNumber: {
              type: 'string',
              value: faker.finance.account(9),
            },
            issueDate: {
              type: 'date',
              value: faker.date.past(20).toISOString().split('T')[0],
            },
            registeredAddress: {
              type: 'string',
              value: faker.address.streetAddress(),
            },
            businessType: {
              type: 'string',
              value: faker.company.bs(),
            },
          },
        },
      ],
    };
    return mockData;
    ƒ;
  }

  const riskScoreWorkflowContext = {
    entity: {
      entityType: 'business',
      entityData: {
        name: 'Tech Solutions Inc.',
        businessNumber: '123456789',
        registeredAddress: '123 Tech Lane, Techville, USA',
      },
      additionalDetails: {
        businessType: 'IT Solutions',
        numberOfEmployees: '100',
      },
      ballerineEntityId: 'B123456',
      id: 'T123456',
    },
    documents: [
      {
        category: 'Identification Document',
        type: 'ID Card',
        issuer: {
          type: 'Government',
          name: 'Techville City Council',
          country: 'USA',
          city: 'Techville',
          additionalDetails: {
            department: 'Identification and Passport Services',
          },
        },
        issuingVersion: 1,
        decision: {
          status: 'revision',
          rejectionReason: '',
          revisionReason: 'Blurry image',
        },
        version: 1,
        pages: [
          {
            ballerineFileId: 'BF123456',
            provider: 'http',
            uri: 'http://example.com/id_front.jpg',
            type: 'jpg',
            data: '',
            metadata: {
              side: 'front',
              pageNumber: '1',
            },
          },
          {
            ballerineFileId: 'BF123457',
            provider: 'http',
            uri: 'http://example.com/id_back.jpg',
            type: 'jpg',
            data: '',
            metadata: {
              side: 'back',
              pageNumber: '2',
            },
          },
        ],
        properties: {
          cardNumber: {
            type: 'string',
            value: 'ID987654321',
          },
          issueDate: {
            type: 'date',
            value: '2020-01-01',
          },
          expiryDate: {
            type: 'date',
            value: '2030-12-31',
          },
          name: {
            type: 'string',
            value: 'John Doe',
          },
          address: {
            type: 'string',
            value: '123 Tech Lane, Techville',
          },
          dateOfBirth: {
            type: 'date',
            value: '1980-01-01',
          },
        },
      },
      {
        category: 'Registration Document',
        type: 'Certificate of Incorporation',
        issuer: {
          type: 'Government',
          name: 'Techville City Council',
          country: 'USA',
          city: 'Techville',
          additionalDetails: {
            department: 'Business Registration',
          },
        },
        issuingVersion: 1,
        decision: {
          status: 'approved',
          rejectionReason: '',
          revisionReason: '',
        },
        version: 1,
        pages: [
          {
            ballerineFileId: 'BF123458',
            provider: 'http',
            uri: 'http://example.com/certificate.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              pageNumber: '1',
            },
          },
        ],
        properties: {
          companyName: {
            type: 'string',
            value: 'Tech Solutions Inc.',
          },
          registrationNumber: {
            type: 'string',
            value: '123456789',
          },
          issueDate: {
            type: 'date',
            value: '2000-01-01',
          },
          registeredAddress: {
            type: 'string',
            value: '123 Tech Lane, Techville',
          },
          businessType: {
            type: 'string',
            value: 'IT Solutions',
          },
        },
      },
    ],
  };

  // Risk score improvment
  await client.workflowDefinition.create({
    data: {
      id: 'risk-score-improvement-dev', // should be auto generated normally
      name: 'risk-score-improvement',
      version: 1,
      definitionType: 'statechart-json',
      contextSchema: {
        type: 'json-schema',
        schema: {
          $schema: 'http://json-schema.org/draft-07/schema#',
          type: 'object',
          properties: {
            entity: {
              type: 'object',
              properties: {
                entityType: {
                  type: 'string',
                  enum: ['individual', 'business'],
                },
                entityData: {
                  type: 'object',
                },
                additionalDetails: {
                  type: 'object',
                },
                ballerineEntityId: {
                  type: 'string',
                },
                id: {
                  type: 'string',
                },
              },
              required: ['entityType', 'id'],
              additionalProperties: false, // added
            },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: {
                    type: 'string',
                  },
                  type: {
                    type: 'string',
                  },
                  issuer: {
                    type: 'object',
                    properties: {
                      type: {
                        type: 'string',
                      },
                      name: {
                        type: 'string',
                      },
                      country: {
                        type: 'string',
                      },
                      city: {
                        type: 'string',
                      },
                      additionalDetails: {
                        type: 'object',
                      },
                    },
                    required: ['type', 'name', 'country', 'city'],
                    additionalProperties: false, // added
                  },
                  issuingVersion: {
                    type: 'integer',
                  },
                  decision: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        enum: ['new', 'pending', 'revision', 'approved', 'rejected'],
                      },
                      rejectionReason: {
                        oneOf: [
                          {
                            type: 'string',
                            enum: [
                              'Suspicious document',
                              'Document does not match customer profile',
                              'Potential identity theft',
                              'Fake or altered document',
                              'Document on watchlist or blacklist',
                            ],
                          },
                          {
                            type: 'string',
                          },
                        ],
                      },
                      revisionReason: {
                        oneOf: [
                          {
                            type: 'string',
                            enum: [
                              'Blurry image',
                              'Missing page',
                              'Invalid document',
                              'Expired document',
                              'Unreadable document',
                            ],
                          },
                          {
                            type: 'string',
                          },
                        ],
                      },
                    },
                    additionalProperties: false, // added
                  },
                  version: {
                    type: 'integer',
                  },
                  pages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ballerineFileId: { type: 'string' },
                        provider: {
                          type: 'string',
                          enum: ['gcs', 'http', 'stream', 'base64', 'ftp'],
                        },
                        uri: {
                          type: 'string',
                          format: 'uri', // added
                        },
                        type: {
                          type: 'string',
                          enum: ['pdf', 'png', 'jpg'],
                        },
                        data: {
                          type: 'string',
                        },
                        metadata: {
                          type: 'object',
                          properties: {
                            side: {
                              type: 'string',
                            },
                            pageNumber: {
                              type: 'string',
                            },
                          },
                          additionalProperties: false, // added
                        },
                      },
                      required: ['provider', 'uri', 'type'],
                      additionalProperties: false, // added
                    },
                  },
                  properties: {
                    type: 'object',
                    additionalProperties: {
                      oneOf: [
                        {
                          type: 'string',
                        },
                        {
                          type: 'object',
                          properties: {
                            type: {
                              type: 'string',
                              enum: ['date'],
                            },
                            value: {
                              type: 'string',
                              format: 'date',
                            },
                          },
                          required: ['type', 'value'],
                          additionalProperties: false,
                        },
                      ],
                    },
                  },
                },
                required: ['category', 'type', 'issuer', 'version', 'pages', 'properties'],
                additionalProperties: false, // added
              },
            },
          },
          required: ['entity', 'documents'],
          additionalProperties: false, // added
        },
      },
      definition: {
        id: 'risk-score-improvement',
        initial: 'idle',
        states: {
          review: {
            on: {
              idle: {
                target: 'review',
              },
              review: {
                target: ['rejected', 'approved', 'revision'],
              },
              revision: {
                target: ['rejected', 'approved', 'review'],
              },
            },
          },
          approved: {
            type: 'final',
          },
          rejected: {
            type: 'final',
          },
        },
      },
    },
  });

  // Manual Review
  await client.workflowDefinition.create({
    data: {
      id: manualMachineId,
      name: 'manual_review',
      version: manualMachineVersion,
      definitionType: 'statechart-json',
      definition: {
        id: 'Manual Review',
        initial: 'review',
        states: {
          review: {
            on: {
              approve: {
                target: 'approved',
              },
              reject: {
                target: 'rejected',
              },
              resubmit: {
                target: 'review',
              },
            },
          },
          approved: {
            type: 'final',
          },
          rejected: {
            type: 'final',
          },
        },
      },
      persistStates: [],
      submitStates: [],
    },
  });

  // KYC
  await client.workflowDefinition.create({
    data: {
      id: onboardingMachineKycId, // should be auto generated normally
      reviewMachineId: manualMachineId,
      name: 'kyc',
      version: 1,
      definitionType: 'statechart-json',
      definition: {
        id: 'kyc',
        predictableActionArguments: true,
        initial: 'welcome',

        context: {
          documents: [],
        },

        states: {
          welcome: {
            on: {
              USER_NEXT_STEP: 'document_selection',
            },
          },
          document_selection: {
            on: {
              USER_PREV_STEP: 'welcome',
              USER_NEXT_STEP: 'document_photo',
            },
          },
          document_photo: {
            on: {
              USER_PREV_STEP: 'document_selection',
              USER_NEXT_STEP: 'document_review',
            },
          },
          document_review: {
            on: {
              USER_PREV_STEP: 'document_photo',
              USER_NEXT_STEP: 'selfie',
            },
          },
          selfie: {
            on: {
              USER_PREV_STEP: 'document_review',
              USER_NEXT_STEP: 'selfie_review',
            },
          },
          selfie_review: {
            on: {
              USER_PREV_STEP: 'selfie',
              USER_NEXT_STEP: 'final',
            },
          },
          final: {
            type: 'final',
          },
        },
      },
      persistStates: [
        {
          state: 'document_review',
          persistence: 'BACKEND',
        },
        {
          state: 'document_selection',
          persistence: 'BACKEND',
        },
        {
          state: 'final',
          persistence: 'BACKEND',
        },
      ],
      submitStates: [
        {
          state: 'document_photo',
        },
      ],
    },
  });

  // KYB
  await client.workflowDefinition.create({
    data: {
      id: onboardingMachineKybId, // should be auto generated normally
      reviewMachineId: manualMachineId,
      name: 'kyb',
      version: 1,
      definitionType: 'statechart-json',
      definition: {
        id: 'kyb',
        predictableActionArguments: true,
        initial: 'welcome',

        context: {
          documents: [],
        },

        states: {
          welcome: {
            on: {
              USER_NEXT_STEP: 'document_selection',
            },
          },
          document_selection: {
            on: {
              USER_PREV_STEP: 'welcome',
              USER_NEXT_STEP: 'document_photo',
            },
          },
          document_photo: {
            on: {
              USER_PREV_STEP: 'document_selection',
              USER_NEXT_STEP: 'document_review',
            },
          },
          document_review: {
            on: {
              USER_PREV_STEP: 'document_photo',
              USER_NEXT_STEP: 'certificate_of_incorporation',
            },
          },
          certificate_of_incorporation: {
            on: {
              USER_PREV_STEP: 'document_review',
              USER_NEXT_STEP: 'certificate_of_incorporation_review',
            },
          },
          certificate_of_incorporation_review: {
            on: {
              USER_PREV_STEP: 'certificate_of_incorporation',
              USER_NEXT_STEP: 'selfie',
            },
          },
          selfie: {
            on: {
              USER_PREV_STEP: 'certificate_of_incorporation_review',
              USER_NEXT_STEP: 'selfie_review',
            },
          },
          selfie_review: {
            on: {
              USER_PREV_STEP: 'selfie',
              USER_NEXT_STEP: 'final',
            },
          },
          final: {
            type: 'final',
          },
        },
      },
      persistStates: [
        {
          state: 'document_review',
          persistence: 'BACKEND',
        },
        {
          state: 'document_selection',
          persistence: 'BACKEND',
        },
        {
          state: 'final',
          persistence: 'BACKEND',
        },
      ],
      submitStates: [
        {
          state: 'document_photo',
        },
      ],
    },
  });

  await client.$transaction(
    endUserIds.map(id =>
      client.endUser.create({
        data: generateEndUser({
          id,
          workflowDefinitionId: manualMachineId,
          workflowDefinitionVersion: manualMachineVersion,
          context: {},
        }),
      }),
    ),
  );

  await client.$transaction(
    businessIds.map(id => {
      const exampleWf = {
        workflowDefinitionId: onboardingMachineKybId,
        workflowDefinitionVersion: manualMachineVersion,
        context: {},
      };
      const riskWf = () => ({
        workflowDefinitionId: riskScoreMachineKybId,
        workflowDefinitionVersion: 1,
        context: createMockContextData(),
      });

      return client.business.create({
        data: generateBusiness({
          id,
          workflow: Math.random() > 0.5 ? riskWf() : exampleWf,
        }),
      });
    }),
  );

  // TODO: create business with enduser attched to them
  // await client.business.create({
  //   data: {
  //     ...generateBusiness({}),
  //     endUsers: {
  //       create: [
  //         {
  //           assignedBy: 'Bob',
  //           assignedAt: new Date(),
  //           endUser: {
  //             create: {
  //                 ...generateEndUser({}),
  //             },
  //           },
  //         },
  //       ],
  //     },
  //   },
  // });

  void client.$disconnect();

  console.info('Seeding database with custom seed...');
  customSeed();

  console.info('Seeded database successfully');
}
