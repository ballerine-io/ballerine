import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Business, EndUser, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { customSeed } from './custom-seed';
import {
  businessIds,
  businessRiskIds,
  endUserIds,
  generateBusiness,
  generateEndUser,
} from './generate-end-user';
import defaultContextSchema from '../src/workflow/schemas/default-context-schema.json';
import { Salt } from '../src/auth/password/password.service';
import { env } from '../src/env';
import { generateUserNationalId } from './generate-user-national-id';

if (require.main === module) {
  dotenv.config();

  seed(env.BCRYPT_SALT).catch(error => {
    console.error(error);
    process.exit(1);
  });
}

const persistImageFile = async (client: PrismaClient, uri: string) => {
  const file = await client.file.create({
    data: {
      userId: '',
      fileNameOnDisk: uri,
      uri: uri,
    },
  });

  return file.id;
};

function generateAvatarImageUri(imageTemplate: string, countOfBusiness: number) {
  if (countOfBusiness < 4) {
    return `https://backoffice-demo.ballerine.app/images/mock-documents/${imageTemplate}`;
  } else {
    return faker.image.people(1000, 2000);
  }
}

async function seed(bcryptSalt: Salt) {
  console.info('Seeding database...');
  const client = new PrismaClient();
  const users = [
    {
      email: 'agent1@ballerine.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: await hash('agent1', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'agent2@ballerine.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: await hash('agent2', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'agent3@ballerine.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: await hash('agent3', bcryptSalt),
      roles: ['user'],
    },
    {
      email: 'admin@admin.com',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      password: await hash('admin', bcryptSalt),
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

  const createMockBusinessContextData = async (businessId: string, countOfBusiness: number) => {
    const correlationId = faker.datatype.uuid();
    const imageUri1 = generateAvatarImageUri(
      `set_${countOfBusiness}_doc_front.png`,
      countOfBusiness,
    );
    const imageUri2 = generateAvatarImageUri(
      `set_${countOfBusiness}_doc_face.png`,
      countOfBusiness,
    );
    const imageUri3 = generateAvatarImageUri(`set_${countOfBusiness}_selfie.png`, countOfBusiness);

    const mockData = {
      entity: {
        type: 'business',
        data: {
          companyName: faker.company.companyName(),
          registrationNumber: faker.finance.account(9),
          legalForm: faker.company.bs(),
          countryOfIncorporation: faker.address.country(),
          // @ts-expect-error - business type expects a date and not a string.
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
        } satisfies Partial<Business>,
        additionalDetails: {},
        ballerineEntityId: businessId,
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

          version: 1,
          pages: [
            {
              provider: 'http',
              uri: imageUri1,
              type: 'jpg',
              data: '',
              ballerineFileId: await persistImageFile(client, imageUri1),
              metadata: {
                side: 'front',
                pageNumber: '1',
              },
            },
            {
              provider: 'http',
              uri: imageUri2,
              type: 'jpg',
              data: '',
              ballerineFileId: await persistImageFile(client, imageUri2),
              metadata: {
                side: 'back',
                pageNumber: '1',
              },
            },
          ],
          properties: {
            userNationalId: generateUserNationalId(),
            docNumber: faker.finance.account(9),
            userAddress: faker.address.streetAddress(),
            website: faker.internet.url(),
            expiryDate: faker.date.future(10).toISOString().split('T')[0],
            email: faker.internet.email(),
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

          version: 1,
          pages: [
            {
              provider: 'http',
              uri: imageUri3,
              type: 'pdf',
              ballerineFileId: await persistImageFile(client, imageUri3),
              data: '',
              metadata: {},
            },
          ],
          properties: {
            userNationalId: generateUserNationalId(),
            docNumber: faker.finance.account(9),
            userAddress: faker.address.streetAddress(),
            website: faker.internet.url(),
            expiryDate: faker.date.future(10).toISOString().split('T')[0],
            email: faker.internet.email(),
          },
        },
      ],
    };

    return mockData;
  };

  function createMockEndUserContextData(endUserId: string) {
    const correlationId = faker.datatype.uuid();
    const mockData = {
      entity: {
        type: 'individual',
        data: {
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          approvalState: 'NEW',
          phone: faker.phone.number(),
          stateReason: 'Poor quality of documents',
          // @ts-expect-error - end user type expects a date and not a string.
          dateOfBirth: faker.date.past(20).toISOString(),
        } satisfies Partial<EndUser>,
        additionalDetails: {},
        ballerineEntityId: endUserId,
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

          version: 1,
          pages: [
            {
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
            userNationalId: generateUserNationalId(),
            docNumber: faker.finance.account(9),
            userAddress: faker.address.streetAddress(),
            website: faker.internet.url(),
            expiryDate: faker.date.future(10).toISOString().split('T')[0],
            email: faker.internet.email(),
          },
        },
        {
          category: 'selfie',
          type: 'certificate',
          issuer: {
            type: 'government',
            name: 'Government',
            country: faker.address.country(),
            city: faker.address.city(),
            additionalDetails: {},
          },
          issuingVersion: 1,

          version: 1,
          pages: [
            {
              provider: 'http',
              uri: faker.internet.url(),
              type: 'pdf',
              data: '',
              metadata: {},
            },
          ],
          properties: {
            userNationalId: generateUserNationalId(),
            docNumber: faker.finance.account(9),
            userAddress: faker.address.streetAddress(),
            website: faker.internet.url(),
            expiryDate: faker.date.future(10).toISOString().split('T')[0],
            email: faker.internet.email(),
          },
        },
      ],
    };

    return mockData;
  }

  // Risk score improvement
  await client.workflowDefinition.create({
    data: {
      id: 'risk-score-improvement-dev', // should be auto generated normally
      name: 'risk-score-improvement',
      version: 1,
      definitionType: 'statechart-json',
      config: {
        completedWhenTasksResolved: true,
        workflowLevelResolution: false,
      },
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
          idle: {},
          approved: {
            type: 'final',
          },
          rejected: {
            type: 'final',
          },
          revision: {},
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

  // await client.filter.create({
  //   data: {
  //     entity: 'individuals',
  //     name: 'Individuals',
  //     query: {
  //       select: {
  //         id: true,
  //         correlationId: true,
  //         verificationId: true,
  //         endUserType: true,
  //         approvalState: true,
  //         stateReason: true,
  //         jsonData: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         phone: true,
  //         dateOfBirth: true,
  //         avatarUrl: true,
  //         additionalInfo: true,
  //         createdAt: true,
  //         updatedAt: true,
  //         workflowRuntimeData: {
  //           select: {
  //             id: true,
  //             status: true,
  //             assigneeId: true,
  //             createdAt: true,
  //             workflowDefinition: {
  //               select: {
  //                 id: true,
  //                 name: true,
  //               },
  //             },
  //           },
  //         },
  //       },
  //       where: {
  //         workflowRuntimeData: {
  //           some: {
  //             workflowDefinition: {
  //               is: {
  //                 id: manualMachineId,
  //               },
  //             },
  //           },
  //         },
  //       },
  //     },
  //   },
  // });

  await client.filter.create({
    data: {
      entity: 'businesses',
      name: 'Risk Score Improvement',
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
              createdAt: true,
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
                  id: riskScoreMachineKybId,
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
        /// I tried to fix that so I can run through ajv, currently it doesn't like something in the schema (anyOf  )
        data: generateEndUser({
          id,
          workflow: {
            workflowDefinitionId: manualMachineId,
            workflowDefinitionVersion: manualMachineVersion,
            context: createMockEndUserContextData(id),
          },
        }),
      }),
    ),
  );

  await client.$transaction(async tx => {
    businessRiskIds.map(async (id, index) => {
      const riskWf = async () => ({
        workflowDefinitionId: riskScoreMachineKybId,
        workflowDefinitionVersion: 1,
        context: await createMockBusinessContextData(id, index + 1),
        createdAt: faker.date.recent(2),
      });

      return client.business.create({
        data: generateBusiness({
          id,
          workflow: await riskWf(),
        }),
      });
    });

    businessIds.map(async id => {
      const exampleWf = {
        workflowDefinitionId: onboardingMachineKybId,
        workflowDefinitionVersion: manualMachineVersion,
        // Would not display data in the backoffice UI
        context: {},
        createdAt: faker.date.recent(2),
      };

      return client.business.create({
        data: generateBusiness({
          id,
          workflow: exampleWf,
        }),
      });
    });
  });

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
