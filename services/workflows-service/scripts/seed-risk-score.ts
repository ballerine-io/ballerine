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
                entityType: { type: 'string', enum: ['individual', 'business'] },
                additionalDetails: { type: 'object' },
                ballerineEid: { type: 'string' }, // Ballerine Entity ID
                id: { type: 'string' },
              },
              required: ['entityType', 'ballerineId', 'id'],
            },
            documents: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  category: { type: 'string' },
                  type: { type: 'string' },
                  issuer: {
                    type: 'object',
                    properties: {
                      type: { type: 'string' },
                      name: { type: 'string' },
                      country: { type: 'string' },
                      city: { type: 'string' },
                      additionalDetails: { type: 'object' },
                    },
                    required: ['type', 'name', 'country', 'city'],
                  },
                  issuingVersion: { type: 'integer' },
                  currentApprovalState: {
                    type: 'string',
                    enum: ['new', 'pending', 'resubmit', 'approved', 'rejected'],
                  },
                  version: { type: 'integer' },
                  pages: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        provider: {
                          type: 'string',
                          enum: ['gcs', 'http', 'stream', 'base64', 'ftp'],
                        },
                        uri: { type: 'string' },
                        type: { type: 'string', enum: ['pdf', 'png', 'jpg'] },
                        data: { type: 'string' },
                        metadata: {
                          type: 'object',
                          properties: {
                            side: { type: 'string' },
                            pageNumber: { type: 'string' },
                          },
                        },
                      },
                      required: ['provider', 'uri', 'type'],
                    },
                  },
                  propertiesSchema: { type: 'object' },
                },
                required: [
                  'category',
                  'type',
                  'issuer',
                  'issuingVersion',
                  'currentApprovalState',
                  'version',
                  'pages',
                  'propertiesSchema',
                ],
              },
            },
          },
          required: ['entity', 'documents'],
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
      additionalDetails: {
        industry: 'Financial Services',
        size: '51-200 employees',
      },
      ballerineEid: 'BID20230001',
      id: '2023-001',
    },
    documents: [
      {
        category: 'Registration',
        type: 'Certificate of Incorporation',
        issuer: {
          type: 'Government',
          name: 'Registrar of Companies',
          country: 'USA',
          city: 'Delaware',
          additionalDetails: {
            address: 'John G Townsend Bldg, Dover, DE 19901, USA',
          },
        },
        issuingVersion: 1,
        currentApprovalState: 'new',
        version: 1,
        pages: [
          {
            provider: 'http',
            uri: 'http://example.com/document1.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              side: 'front',
              pageNumber: '1',
            },
          },
          {
            provider: 'http',
            uri: 'http://example.com/document1-2.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              side: 'back',
              pageNumber: '2',
            },
          },
        ],
        propertiesSchema: {
          incorporationDate: '2022-01-01',
          businessName: 'My Business Inc.',
          registrationNumber: '1234567',
        },
      },
      {
        category: 'Financial',
        type: 'Annual Report',
        issuer: {
          type: 'Private',
          name: 'My Business Inc.',
          country: 'USA',
          city: 'New York',
          additionalDetails: {
            address: '123 Wall Street, New York, NY 10005, USA',
          },
        },
        issuingVersion: 1,
        currentApprovalState: 'new',
        version: 1,
        pages: [
          {
            provider: 'gcs',
            uri: 'gs://example-bucket/document2.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              pageNumber: '1',
            },
          },
          {
            provider: 'gcs',
            uri: 'gs://example-bucket/document2-2.pdf',
            type: 'pdf',
            data: '',
            metadata: {
              pageNumber: '2',
            },
          },
        ],
        propertiesSchema: {
          fiscalYear: '2022',
          totalRevenue: '10M USD',
          netIncome: '2M USD',
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
