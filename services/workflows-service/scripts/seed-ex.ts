import { hash } from 'bcrypt';
import { faker } from '@faker-js/faker';
import { StateTag } from '@ballerine/common';
import { Business, Prisma, PrismaClient } from '@prisma/client';

import { customSeed } from './custom-seed';
import { generateUserNationalId } from './generate-user-national-id';

const devconExampleWorkflow = {
  id: 'devcon_example_workflow',
  name: 'devcon_example_workflow',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'devcon_example_workflow',
    predictableActionArguments: true,
    initial: 'collect',
    context: {
      documents: [],
    },
    states: {
      collect: {
        on: {
          start: 'manual_review',
        },
      },
      manual_review: {
        tags: [StateTag.MANUAL_REVIEW],
        on: {
          approve: 'approved',
          reject: 'rejected',
        },
      },
      rejected: {
        tags: [StateTag.REJECTED],
        type: 'final' as const,
      },
      approved: {
        tags: [StateTag.APPROVED],
        type: 'final' as const,
      },
    },
    extensions: {
      apiPlugins: [],

      commonPlugins: [],
    },
    config: {},
  },
};

const generateParentKybWithSessionKycs = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: devconExampleWorkflow,
  });
};

// check if the workflow is already seeded
const isSeeded = async (prismaClient: PrismaClient) => {
  const workflow = await prismaClient.workflowDefinition.findUnique({
    where: {
      id: devconExampleWorkflow.id,
    },
  });

  return !!workflow;
};

const trySeed = async () => {
  const isAlreadySeeded = await isSeeded(new PrismaClient());
  if (isAlreadySeeded) {
    console.info('Database already seeded. skipping seed...');
    return;
  }

  seed(10).catch(error => {
    console.error(error);
    process.exit(1);
  });
};

trySeed();

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

function generateAvatarImageUri(imageTemplate: string, countOfBusiness: number, pdf = false) {
  if (pdf) {
    return `https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_pdf.pdf`;
  }

  if (countOfBusiness < 4) {
    return `https://backoffice-demo.ballerine.app/images/mock-documents/${imageTemplate}`;
  }

  return faker.image.people(1000, 2000, true);
}

async function seed(bcryptSalt: number | string) {
  console.info('Seeding database....');
  const client = new PrismaClient();
  const users = [
    {
      email: 'admin@admin.com',
      firstName: 'Devcon',
      lastName: 'Agent 1',
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

  // const user = await client.endUser.create({
  //   data: {
  //     id: '43a0a298-0d02-4a2e-a8cc-73c06b465310',
  //     firstName: 'Nadia',
  //     lastName: 'Comaneci',
  //     email: 'nadia@ballerine.com',
  //     correlationId: '1',
  //     dateOfBirth: '2000-11-04T12:45:51.695Z',
  //   },
  // });

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
    const imageUri3 = generateAvatarImageUri(
      `set_${countOfBusiness}_selfie.png`,
      countOfBusiness,
      true,
    );

    return {
      entity: {
        type: 'business',
        data: {
          companyName: faker.company.name(),
          registrationNumber: faker.finance.account(9),
          legalForm: faker.company.bs(),
          countryOfIncorporation: faker.address.country(),
          // @ts-expect-error - business type expects a date and not a string.
          dateOfIncorporation: faker.date.past(20).toISOString(),
          address: faker.address.streetAddress(),
          phoneNumber: faker.phone.number(),
          email: faker.internet.email(),
          website: faker.internet.url(),
          industry: faker.company.catchPhrase(),
          taxIdentificationNumber: faker.finance.account(12),
          vatNumber: faker.finance.account(9),
          numberOfEmployees: faker.datatype.number(1000),
          businessPurpose: faker.company.catchPhraseDescriptor(),
          approvalState: 'NEW',
          additionalInfo: { customParam: 'customValue' },
        } satisfies Partial<Business>,
        ballerineEntityId: businessId,
        id: correlationId,
      },
      documents: [
        {
          id: faker.datatype.uuid(),
          category: 'proof_of_employment',
          type: 'payslip',
          issuer: {
            type: 'government',
            name: 'Government',
            country: 'GH',
            city: faker.address.city(),
            additionalInfo: { customParam: 'customValue' },
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
            nationalIdNumber: generateUserNationalId(),
            docNumber: faker.random.alphaNumeric(9),
            employeeName: faker.name.fullName(),
            position: faker.name.jobTitle(),
            salaryAmount: faker.finance.amount(1000, 10000),
            issuingDate: faker.date.past(10).toISOString().split('T')[0],
          },
        },
        {
          id: faker.datatype.uuid(),
          category: 'proof_of_address',
          type: 'mortgage_statement',
          issuer: {
            type: 'government',
            name: 'Government',
            country: 'GH',
            city: faker.address.city(),
            additionalInfo: { customParam: 'customValue' },
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
            nationalIdNumber: generateUserNationalId(),
            docNumber: faker.random.alphaNumeric(9),
            employeeName: faker.name.fullName(),
            position: faker.name.jobTitle(),
            salaryAmount: faker.finance.amount(1000, 10000),
            issuingDate: faker.date.past(10).toISOString().split('T')[0],
          },
        },
      ],
    };
  };

  function createFilter(
    name: string,
    entity: 'individuals' | 'businesses',
    query: Prisma.WorkflowRuntimeDataFindManyArgs,
  ) {
    return client.filter.create({
      data: {
        entity,
        name,
        query: query as any,
      },
    });
  }

  await createFilter('Onboarding - Businesses', 'businesses', {
    select: {
      id: true,
      status: true,
      assigneeId: true,
      createdAt: true,
      context: true,
      state: true,
      workflowDefinition: {
        select: {
          id: true,
          name: true,
          contextSchema: true,
          config: true,
          definition: true,
        },
      },
      business: {
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
          createdAt: true,
          updatedAt: true,
        },
      },
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
    },
    where: {
      workflowDefinitionId: 'dynamic_external_request_example',
      businessId: { not: null },
    },
  });

  await createFilter("KYB with UBO's", 'businesses', {
    select: {
      id: true,
      status: true,
      assigneeId: true,
      createdAt: true,
      context: true,
      state: true,
      workflowDefinition: {
        select: {
          id: true,
          name: true,
          contextSchema: true,
          config: true,
          definition: true,
        },
      },
      business: {
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
          createdAt: true,
          updatedAt: true,
        },
      },
      assignee: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      },
      childWorkflowsRuntimeData: true,
    },
    where: {
      workflowDefinitionId: 'kyb_parent_kyc_session_example',
      businessId: { not: null },
    },
  });

  // await client.$transaction(async () =>
  //   endUserIds.map(async (id, index) =>
  //     client.endUser.create({
  //       /// I tried to fix that so I can run through ajv, currently it doesn't like something in the schema (anyOf  )
  //       data: generateEndUser({
  //         id,
  //         workflow: {
  //           workflowDefinitionId: kycManualMachineId,
  //           workflowDefinitionVersion: manualMachineVersion,
  //           context: await createMockEndUserContextData(id, index + 1),
  //         },
  //       }),
  //     }),
  //   ),
  // );

  // await client.$transaction(async tx => {
  //   businessRiskIds.map(async (id, index) => {
  //     const riskWf = async () => ({
  //       workflowDefinitionId: riskScoreMachineKybId,
  //       workflowDefinitionVersion: 1,
  //       context: await createMockBusinessContextData(id, index + 1),
  //       createdAt: faker.date.recent(2),
  //     });

  //     return client.business.create({
  //       data: generateBusiness({
  //         id,
  //         workflow: await riskWf(),
  //       }),
  //     });
  //   });

  // businessIds.map(async id => {
  //   const exampleWf = {
  //     workflowDefinitionId: onboardingMachineKybId,
  //     workflowDefinitionVersion: manualMachineVersion,
  //     // Would not display data in the backoffice UI
  //     context: {},
  //     createdAt: faker.date.recent(2),
  //   };

  //   return client.business.create({
  //     data: generateBusiness({
  //       id,
  //       workflow: exampleWf,
  //     }),
  //   });
  // });
  // });

  void client.$disconnect();

  console.info('Seeding database with custom seed...');
  customSeed();
  await generateParentKybWithSessionKycs(client);
  console.info('Seeded database successfully');
}
