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

  // mock context:
  const mockContext = {
    entity: {
      entityType: 'business',
      entityData: {
        businessName: 'Tech Solutions Inc.',
        businessAddress: '123 Tech Lane, Techville',
        businessNumber: '123456789',
      },
      additionalDetails: {
        industry: 'Technology',
        numberOfEmployees: '50',
      },
      ballerineEntityId: 'B123456',
      id: 'E123456',
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
          status: 'pending',
          rejectionReason: '',
          revisionReason: '',
        },
        approvalStatus: 'new',
        version: 1,
        pages: [
          {
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
            type: 'number',
            value: '987654321',
          },
          issueDate: {
            type: 'date',
            value: '2020-01-01',
          },
          expiryDate: {
            type: 'date',
            value: '2030-12-31',
          },
          name: 'John Doe',
          address: '123 Tech Lane, Techville',
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
          status: 'pending',
          rejectionReason: '',
          revisionReason: '',
        },
        approvalStatus: 'new',
        version: 1,
        pages: [
          {
            provider: 'http',
            uri: 'http://example.com/certificate.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              side: 'front',
              pageNumber: '1',
            },
          },
        ],
        properties: {
          companyName: 'Tech Solutions Inc.',
          companyNumber: '123456789',
          issueDate: {
            type: 'date',
            value: '2020-01-01',
          },
          directors: 'John Doe, Jane Doe',
          registeredAddress: '123 Tech Lane, Techville',
        },
      },
    ],
  };
  // await client.$transaction(
  //   endUserIds.map(id =>
  //     client.endUser.create({
  //       data: generateEndUser({
  //         id,
  //         workflowDefinitionId: manualMachineId,
  //         workflowDefinitionVersion: manualMachineVersion,
  //         context: {},
  //       }),
  //     }),
  //   ),
  // );

  // await client.$transaction(
  //   businessIds.map(id =>
  //     client.business.create({
  //       data: generateBusiness({
  //         id,
  //         workflowDefinitionId: onboardingMachineKybId,
  //         workflowDefinitionVersion: manualMachineVersion,
  //         context: {},
  //       }),
  //     }),
  //   ),
  // );

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
