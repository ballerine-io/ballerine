import * as dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import { Business, EndUser, Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { customSeed } from './custom-seed';
import {
  businessIds,
  businessRiskIds,
  endUserIds,
  generateBusiness,
  generateEndUser,
} from './generate-end-user';
import { defaultContextSchema } from '@ballerine/common';
import { Salt } from '../src/auth/password/password.service';
import { env } from '../src/env';
import { generateUserNationalId } from './generate-user-national-id';
import { generateDynamicDefinitionForE2eTest } from './workflows/e2e-dynamic-url-example';
import { generateKycForE2eTest } from './workflows/kyc-dynamic-process-example';
import { generateParentKybWithKycs } from './workflows/parent-kyb-workflow';
import { generateKybDefintion } from './workflows';
import { generateKycSessionDefinition } from './workflows/kyc-email-process-example';
import { generateParentKybWithSessionKycs } from './workflows/parent-kyb-kyc-session-workflow';

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

function generateAvatarImageUri(imageTemplate: string, countOfBusiness: number, pdf = false) {
  if (pdf) {
    return `https://backoffice-demo.ballerine.app/images/mock-documents/set_1_doc_pdf.pdf`;
  }

  if (countOfBusiness < 4) {
    return `https://backoffice-demo.ballerine.app/images/mock-documents/${imageTemplate}`;
  }

  return faker.image.people(1000, 2000, true);
}

async function seed(bcryptSalt: Salt) {
  console.info('Seeding database...');
  const client = new PrismaClient();
  await generateDynamicDefinitionForE2eTest(client);
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

  const kycManualMachineId = 'MANUAL_REVIEW_0002zpeid7bq9aaa';
  const kybManualMachineId = 'MANUAL_REVIEW_0002zpeid7bq9bbb';
  const manualMachineVersion = 1;

  const onboardingMachineKycId = 'COLLECT_DOCS_b0002zpeid7bq9aaa';
  const onboardingMachineKybId = 'COLLECT_DOCS_b0002zpeid7bq9bbb';
  const riskScoreMachineKybId = 'risk-score-improvement-dev';

  // KYB Flows
  const onboardingMachineId = 'kyb-onboarding';
  const riskScoreMachineId = 'kyb-risk-score';

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
    const imageUri3 = generateAvatarImageUri(
      `set_${countOfBusiness}_selfie.png`,
      countOfBusiness,
      true,
    );

    const mockData = {
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

    return mockData;
  };

  async function createMockEndUserContextData(endUserId: string, countOfIndividual: number) {
    const correlationId = faker.datatype.uuid();
    const imageUri1 = generateAvatarImageUri(
      `set_${countOfIndividual}_doc_front.png`,
      countOfIndividual,
    );
    const imageUri2 = generateAvatarImageUri(
      `set_${countOfIndividual}_doc_face.png`,
      countOfIndividual,
    );
    const imageUri3 = generateAvatarImageUri(
      `set_${countOfIndividual}_selfie.png`,
      countOfIndividual,
      true,
    );

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
          additionalInfo: { customParam: 'customValue' },
        } satisfies Partial<EndUser>,
        ballerineEntityId: endUserId,
        id: correlationId,
      },
      documents: [
        {
          id: faker.datatype.uuid(),
          category: 'id',
          type: 'photo',
          issuer: {
            type: 'government',
            name: 'Government',
            country: 'CA',
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
            firstName: faker.name.firstName(),
            middleName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            authority: faker.company.name(),
            placeOfIssue: faker.address.city(),
            issueDate: faker.date.past(10).toISOString().split('T')[0],
            expires: faker.date.future(10).toISOString().split('T')[0],
            dateOfBirth: faker.date.past(20).toISOString().split('T')[0],
            placeOfBirth: faker.address.city(),
            sex: faker.helpers.arrayElement(['male', 'female', 'other']),
          },
        },
        {
          id: faker.datatype.uuid(),
          category: 'selfie',
          type: 'photo',
          issuer: {
            type: 'government',
            name: 'Government',
            country: 'CA',
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
              data: '',
              ballerineFileId: await persistImageFile(client, imageUri3),
              metadata: {},
            },
          ],
          properties: {
            firstName: faker.name.firstName(),
            middleName: faker.name.firstName(),
            lastName: faker.name.lastName(),
            authority: faker.company.name(),
            placeOfIssue: faker.address.city(),
            issueDate: faker.date.past(10).toISOString().split('T')[0],
            expires: faker.date.future(10).toISOString().split('T')[0],
            dateOfBirth: faker.date.past(20).toISOString().split('T')[0],
            placeOfBirth: faker.address.city(),
            sex: faker.helpers.arrayElement(['male', 'female', 'other']),
          },
        },
      ],
    };

    return mockData;
  }

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

  const baseManualReviewDefinition = {
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
            revision: {
              target: 'revision',
            },
          },
        },
        approved: {
          type: 'final',
        },
        rejected: {
          type: 'final',
        },
        revision: {
          on: {
            review: {
              target: 'review',
            },
          },
        },
      },
    },
    persistStates: [],
    submitStates: [],
  } as const satisfies Prisma.WorkflowDefinitionUncheckedCreateInput;

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
        allowMultipleActiveWorkflows: true,
      },
      contextSchema: {
        type: 'json-schema',
        schema: defaultContextSchema,
      },
      definition: {
        id: 'risk-score-improvement',
        initial: baseManualReviewDefinition.definition.initial,
        states: baseManualReviewDefinition.definition.states,
      },
    },
  });

  // KYC Manual Review (workflowLevelResolution false)
  await client.workflowDefinition.create({
    data: {
      ...baseManualReviewDefinition,
      id: kycManualMachineId,
      config: {
        workflowLevelResolution: false,
      },
    },
  });

  // KYB Manual Review (workflowLevelResolution true)
  await client.workflowDefinition.create({
    data: {
      ...baseManualReviewDefinition,
      id: kybManualMachineId,
      config: {
        workflowLevelResolution: true,
      },
    },
  });

  // KYC
  await client.workflowDefinition.create({
    data: {
      id: onboardingMachineKycId, // should be auto generated normally
      reviewMachineId: kycManualMachineId,
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
      reviewMachineId: kybManualMachineId,
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

  await createFilter('Onboarding - Businesses with enriched data', 'businesses', {
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

  await createFilter('Onboarding - Individuals', 'individuals', {
    select: {
      id: true,
      status: true,
      assigneeId: true,
      context: true,
      createdAt: true,
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
      endUser: {
        select: {
          id: true,
          correlationId: true,
          endUserType: true,
          approvalState: true,
          stateReason: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          avatarUrl: true,
          additionalInfo: true,
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
      workflowDefinitionId: kycManualMachineId,
      endUserId: { not: null },
    },
  });

  // KYB Onboarding
  await client.workflowDefinition.create({
    data: {
      id: onboardingMachineId,
      name: 'kyb_onboarding',
      version: 1,
      definitionType: 'statechart-json',
      config: {
        workflowLevelResolution: true,
        completedWhenTasksResolved: false,
        allowMultipleActiveWorkflows: false,
      },
      definition: {
        id: 'kyb_onboarding',
        predictableActionArguments: true,
        initial: 'review',

        context: {
          documents: [],
        },

        states: {
          review: {
            on: {
              approve: {
                target: 'approved',
              },
              reject: {
                target: 'rejected',
              },
              revision: {
                target: 'revision',
              },
            },
          },
          approved: {
            type: 'final',
          },
          rejected: {
            type: 'final',
          },
          revision: {
            on: {
              review: {
                target: 'review',
              },
            },
          },
        },
      },
    },
  });

  // KYB Risk Score Improvement
  await client.workflowDefinition.create({
    data: {
      id: riskScoreMachineId,
      name: 'kyb_risk_score',
      version: 1,
      definitionType: 'statechart-json',
      config: {
        workflowLevelResolution: false,
        completedWhenTasksResolved: true,
        allowMultipleActiveWorkflows: true,
      },
      definition: {
        id: 'kyb_risk_score',
        predictableActionArguments: true,
        initial: 'review',

        context: {
          documents: [],
        },

        states: {
          review: {
            on: {
              approve: {
                target: 'approved',
              },
              reject: {
                target: 'rejected',
              },
              revision: {
                target: 'revision',
              },
            },
          },
          approved: {
            type: 'final',
          },
          rejected: {
            type: 'final',
          },
          revision: {
            on: {
              review: {
                target: 'review',
              },
            },
          },
        },
      },
    },
  });

  await createFilter('Risk Score Improvement - Individuals', 'individuals', {
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
      endUser: {
        select: {
          id: true,
          correlationId: true,
          endUserType: true,
          approvalState: true,
          stateReason: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          dateOfBirth: true,
          avatarUrl: true,
          additionalInfo: true,
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
      workflowDefinitionId: riskScoreMachineKybId,
      endUserId: { not: null },
    },
  });

  await createFilter('Risk Score Improvement - Businesses', 'businesses', {
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
      workflowDefinitionId: riskScoreMachineKybId,
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

  await client.$transaction(async () =>
    endUserIds.map(async (id, index) =>
      client.endUser.create({
        /// I tried to fix that so I can run through ajv, currently it doesn't like something in the schema (anyOf  )
        data: generateEndUser({
          id,
          workflow: {
            workflowDefinitionId: kycManualMachineId,
            workflowDefinitionVersion: manualMachineVersion,
            context: await createMockEndUserContextData(id, index + 1),
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
  await generateKybDefintion(client);
  await generateKycSessionDefinition(client);
  await generateParentKybWithSessionKycs(client);
  await generateKycForE2eTest(client);
  await generateParentKybWithKycs(client);
  console.info('Seeded database successfully');
}
