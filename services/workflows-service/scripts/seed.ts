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
    }
  ]
  for (const user of users) {
    await client.user.upsert({
      where: { email: user.email },
      update: {},
      create: user,
    })
  }

  const manualMachineId = 'MANUAL_REVIEW_0002zpeid7bq9aaa';
  const manualMachineVersion = 1;

  const onboardingMachineKycId = 'COLLECT_DOCS_b0002zpeid7bq9aaa';
  const onboardingMachineKybId = 'COLLECT_DOCS_b0002zpeid7bq9bbb';

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
    businessIds.map(id =>
      client.business.create({
        data: generateBusiness({
          id,
          workflowDefinitionId: onboardingMachineKybId,
          workflowDefinitionVersion: manualMachineVersion,
          context: {},
        }),
      }),
    ),
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
