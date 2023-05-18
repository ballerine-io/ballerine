import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';

import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { customSeed } from './custom-seed';
import { businessIds, endUserIds, generateBusiness, generateEndUser } from './generate-end-user';
import defaultContextSchema from '../src/workflow/schemas/default-context-schema.json';
import { Salt } from '../src/auth/password/password.service';
import { env } from '../src/env';

if (require.main === module) {
  dotenv.config();

  seed(env.BCRYPT_SALT).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

async function seed(bcryptSalt: Salt) {
  console.info('Seeding database...');

  const client = new PrismaClient();
  const users = [
    {
      email: 'admin@admin.com',
      firstName: 'admin',
      lastName: 'admin',
      password: await hash('admin', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'admin2@admin.com',
      firstName: 'eythan',
      lastName: 'Flex',
      password: await hash('admin2', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'admin3@admin.com',
      firstName: 'Alon',
      lastName: 'MAMI',
      password: await hash('admin3', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'q@q.q',
      firstName: 'Alon',
      lastName: 'MAMI',
      password: await hash('q', bcryptSalt),
      roles: ['user'],
    },
  ];
  for (const user of users) {
    await client.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    });
  }

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

  function createMockContextData() {
    const correlationId = faker.datatype.uuid();
    let mockData = {
      entity: {
        type: 'business',
        data: {
          companyName: faker.company.companyName(),
          registrationNumber: faker.finance.account(9),
          legalForm: faker.company.bs(),
          countryOfIncorporation: faker.address.country(),
          dateOfIncorporation: faker.date.past(20).toISOString(),
          address: faker.address.streetAddress(),
          phoneNumber: faker.phone.phoneNumber(),
          email: faker.internet.email(),
          website: faker.internet.url(),
          industry: faker.company.catchPhrase(),
          taxIdentificationNumber: faker.finance.account(12),
          vatNumber: faker.finance.account(9),
          numberOfEmployees: faker.datatype.number(1000),
          businessPurpose: faker.company.catchPhraseDescriptor(),
          approvalState: 'NEW',
        },
        additionalDetails: {},
        ballerineEntityId: faker.datatype.uuid(),
        id: correlationId,
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
            fullName: faker.name.findName(),
            dateOfBirth: faker.date.past(30).toISOString().split('T')[0],
            nationality: faker.address.country(),
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
            companyName: faker.company.companyName(),
            registrationNumber: faker.finance.account(9),
            issueDate: faker.date.past(20).toISOString().split('T')[0],
            registeredAddress: faker.address.streetAddress(),
            businessType: faker.company.bs(),
          },
        },
      ],
    };

    return mockData;
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
        schema: defaultContextSchema,
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

  await client.filter.create({
    data: {
      entity: 'individuals',
      name: 'Individuals',
      query: {
        select: {
          id: true,
          correlationId: true,
          verificationId: true,
          endUserType: true,
          approvalState: true,
          stateReason: true,
          jsonData: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          avatarUrl: true,
          additionalInfo: true,
          createdAt: true,
          updatedAt: true,
          workflowRuntimeData: {
            select: {
              id: true,
              status: true,
              assigneeId: true,
              workflowDefinition: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        where: {
          workflowRuntimeData: {
            some: {
              workflowDefinition: {
                is: {
                  id: manualMachineId,
                },
              },
            },
          },
        },
      },
    },
  });

  await client.filter.create({
    data: {
      entity: 'businesses',
      name: 'Businesses',
      query: {
        select: {
          id: true,
          companyName: true,
          registrationNumber: true,
          legalForm: true,
          countryOfIncorporation: true,
          dateOfIncorporation: true,
          address: true,
          phoneNumber: true,
          email: true,
          website: true,
          industry: true,
          taxIdentificationNumber: true,
          vatNumber: true,
          shareholderStructure: true,
          numberOfEmployees: true,
          businessPurpose: true,
          documents: true,
          approvalState: true,
          workflowRuntimeData: {
            select: {
              id: true,
              status: true,
              assigneeId: true,
              workflowDefinition: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          createdAt: true,
          updatedAt: true,
        },
        where: {
          workflowRuntimeData: {
            some: {
              workflowDefinition: {
                is: {
                  id: manualMachineId,
                },
              },
            },
          },
        },
      },
    },
  });

  await client.$transaction(
    endUserIds.map(id =>
      client.endUser.create({
        /// i tryed to fix that so i can run through ajv, currently it dosent like something in the schema (anyOf  )
        data: generateEndUser({
          id,
          workflow: {
            workflowDefinitionId: manualMachineId,
            workflowDefinitionVersion: manualMachineVersion,
            context: {},
          },
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
