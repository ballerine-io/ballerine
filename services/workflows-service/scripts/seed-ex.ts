import { faker } from '@faker-js/faker';
import { Business, Customer, EndUser, Prisma, PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';
import { customSeed } from './custom-seed';

import { generateUserNationalId } from './generate-user-national-id';
import {
  companyInformationSchema,
  companyInformationUISchema,
} from './workflows/schemas/company-information.schema';
import { getCountriesList } from './workflows/utils/countries';

const devconExampleWorkflowBeforeChanges = {
  id: 'devcon_example_workflow',
  name: 'devcon_example_workflow',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'devcon_example_workflow',
    predictableActionArguments: true,
    initial: 'data_collection',
    context: {
      documents: [],
    },
    states: {
      data_collection: {
        on: {
          start: 'manual_review',
        },
        metadata: {
          uiSettings: {
            multiForm: {
              documents: [
                {
                  id: 'registration-certificate',
                  name: 'registrationCertificate',
                  type: 'file',
                },
              ],
              steps: [
                {
                  id: 'personalInformation',
                  title: 'Personal information',
                  description: 'Please provide your personal information',
                  formSchema: {
                    type: 'object',
                    title: 'Personal information',
                    properties: {
                      name: {
                        type: 'object',
                        title: '',
                        properties: {
                          firstName: {
                            title: 'Name',
                            type: 'string',
                            minLength: 1,
                          },
                          lastName: {
                            title: '',
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['firstName', 'lastName'],
                      },
                      title: {
                        title: 'Title',
                        type: 'string',
                        minLength: 1,
                      },
                      birthDate: {
                        type: 'string',
                        title: 'Date of Birth',
                        minLength: 1,
                      },
                      personalPhoneNumber: {
                        type: 'string',
                        title: 'Phone Number',
                        minLength: 1,
                      },
                      companyCheck: {
                        title: 'I have the signing authority for this company',
                        type: 'boolean',
                      },
                    },
                    required: ['name', 'title', 'birthDate', 'phoneNumber'],
                  },
                  uiSchema: {
                    'ui:order': [
                      'name',
                      'title',
                      'birthDate',
                      'personalPhoneNumber',
                      'companyCheck',
                      '*',
                    ],
                    personalPhoneNumber: {
                      'ui:field': 'PhoneInput',
                      'ui:label': true,
                    },
                    birthDate: {
                      'ui:field': 'DateInput',
                      'ui:label': true,
                    },
                    name: {
                      'ui:order': ['firstName', 'lastName'],
                      firstName: {
                        'ui:placeholder': 'First Name',
                        'ui:label': true,
                      },
                      lastName: {
                        'ui:placeholder': 'Last Name',
                        'ui:label': false,
                      },
                    },
                    title: {
                      'ui:placeholder': 'CEO / Manager / Partner',
                    },
                    email: {
                      'ui:placeholder': 'john@example.com',
                    },
                    'ui:options': {
                      submitButtonOptions: {
                        submitText: 'Continue',
                      },
                    },
                  },
                  defaultData: {
                    title: '',
                    name: {
                      firstName: '',
                      lastName: '',
                    },
                    birthDate: '',
                    phoneNumber: '',
                    companyCheck: false,
                  },
                  key: 'personalInformation',
                },
                {
                  id: 'companyInformation',
                  key: 'companyInformation',
                  title: 'Business Information',
                  description: 'Please provide information about your company',
                  formSchema: {
                    type: 'object',
                    title: 'Company Information',
                    properties: {
                      registrationNumber: {
                        title: 'Company Registration Number',
                        type: 'string',
                      },
                      companyCountry: {
                        title: 'Registered Country',
                        type: 'string',
                        oneOf: getCountriesList().map(countryData => ({
                          const: countryData.isoCode,
                          title: countryData.fullName,
                        })),
                      },
                      state: {
                        title: 'Jurisdiction / State',
                        type: 'string',
                      },
                      companyName: {
                        title: 'Company Legal Name',
                        type: 'string',
                        minLength: 1,
                      },
                      vat: {
                        title: 'VAT Number',
                        type: 'string',
                      },
                      companyType: {
                        title: 'Company Type',
                        type: 'string',
                        minLength: 1,
                      },
                      registrationDate: {
                        title: 'Date of Establishment',
                        type: 'string',
                        minLength: 1,
                      },
                    },
                    required: [
                      'registrationNumber',
                      'companyType',
                      'state',
                      'companyName',
                      'registrationDate',
                    ],
                  },
                  uiSchema: {
                    'ui:order': [
                      'registrationNumber',
                      'companyCountry',
                      'state',
                      'companyName',
                      'vat',
                      'companyType',
                      'registrationDate',
                      '*',
                    ],
                    'ui:options': {
                      submitButtonOptions: {
                        submitText: 'Continue',
                      },
                    },
                    registrationNumber: {
                      'ui:placeholder': 'CRN12345678',
                    },
                    companyCountry: {
                      'ui:placeholder': 'Select country',
                    },
                    companyName: {
                      'ui:placeholder': 'OpenAI Technologies, Inc.',
                    },
                    vat: {
                      'ui:placeholder': 'US-VAT-98765432',
                    },
                    companyType: {
                      'ui:placeholder': 'Corporation',
                      'ui:field': 'AutocompleteInput',
                      'ui:label': true,
                      options: [
                        {
                          title: 'Partnership',
                          const: 'Partnership',
                        },
                        {
                          title: 'Sole Proprietorship',
                          const: 'Sole Proprietorship',
                        },
                        {
                          title: 'General Partnership (GP)',
                          const: 'General Partnership (GP)',
                        },
                        {
                          title: 'Limited Partnership (LP)',
                          const: 'Limited Partnership (LP)',
                        },
                        {
                          title: 'Limited Liability Partnership (LLP)',
                          const: 'Limited Liability Partnership (LLP)',
                        },
                        {
                          title: 'Corporation',
                          const: 'Corporation',
                        },
                        {
                          title: 'C Corporation (C Corp)',
                          const: 'C Corporation (C Corp)',
                        },
                        {
                          title: 'S Corporation (S Corp)',
                          const: 'S Corporation (S Corp)',
                        },
                        {
                          title: 'Professional Corporation (PC)',
                          const: 'Professional Corporation (PC)',
                        },
                        { title: 'Incorporated (Inc.)', const: 'Incorporated (Inc.)' },
                        {
                          title: 'Limited Liability Company (LLC)',
                          const: 'Limited Liability Company (LLC)',
                        },
                        {
                          title: 'Public Limited Company (PLC)',
                          const: 'Public Limited Company (PLC)',
                        },
                        {
                          title: 'Private Limited Company (Ltd)',
                          const: 'Private Limited Company (Ltd)',
                        },
                        { title: 'Co-operative (Co-op)', const: 'Co-operative (Co-op)' },
                        {
                          title: 'Business Trust',
                          const: 'Business Trust',
                        },
                        {
                          title: 'Joint Venture',
                          const: 'Joint Venture',
                        },
                        {
                          title: 'Unlimited Company',
                          const: 'Unlimited Company',
                        },
                        {
                          title: 'Trust',
                          const: 'Trust',
                        },
                        {
                          title: 'Holding Company',
                          const: 'Holding Company',
                        },
                      ].sort((a, b) => a.title.localeCompare(b.title)),
                    },
                    registrationDate: {
                      'ui:field': 'DateInput',
                      'ui:label': true,
                    },
                  },
                  defaultData: {
                    registrationNumber: '',
                    companyCountry: '',
                    companyName: '',
                    companyType: '',
                    state: '',
                    vat: '',
                    registrationDate: '',
                  },
                },
                {
                  id: 'businessDocuments',
                  key: 'companyDocuments',
                  title: 'Business Documents',
                  description: 'Please provide business documents',
                  formSchema: {
                    type: 'object',
                    properties: {
                      registrationCertificate: {
                        title: 'Company Certificate of Registration',
                        type: 'object',
                      },
                    },
                  },
                  uiSchema: {
                    'ui:options': {
                      submitButtonOptions: {
                        submitText: 'Submit',
                      },
                    },
                    registrationCertificate: {
                      'ui:field': 'FileInput',
                    },
                  },
                  defaultData: {
                    registrationCertificate: null,
                  },
                },
              ],
            },
          },
        },
      },
      manual_review: {
        on: {
          approve: 'approved',
          reject: 'rejected',
        },
      },
      rejected: {
        type: 'final',
      },
      approved: {
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

const devconExampleWorkflowAfterChanges = {
  id: 'devcon_example_workflow1',
  name: 'devcon_example_workflow1',
  version: 1,
  definitionType: 'statechart-json',
  definition: {
    id: 'devcon_example_workflow1',
    predictableActionArguments: true,
    initial: 'data_collection',
    context: {
      documents: [],
    },
    states: {
      data_collection: {
        on: {
          start: 'process_documents',
        },
        metadata: {
          uiSettings: {
            multiForm: {
              documents: [
                {
                  name: 'registrationCertificate',
                  type: 'file',
                },
              ],
              steps: [
                {
                  title: 'Personal information',
                  description: 'Please provide your personal information',
                  formSchema: {
                    type: 'object',
                    title: 'Personal information',
                    properties: {
                      name: {
                        type: 'object',
                        title: '',
                        properties: {
                          firstName: {
                            title: 'Name',
                            type: 'string',
                            minLength: 1,
                          },
                          lastName: {
                            title: '',
                            type: 'string',
                            minLength: 1,
                          },
                        },
                        required: ['firstName', 'lastName'],
                      },
                      title: {
                        title: 'Title',
                        type: 'string',
                        minLength: 1,
                      },
                      birthDate: {
                        type: 'string',
                        title: 'Date of Birth',
                        minLength: 1,
                      },
                      personalPhoneNumber: {
                        type: 'string',
                        title: 'Phone Number',
                        minLength: 1,
                      },
                      companyCheck: {
                        title: 'I have the signing authority for this company',
                        type: 'boolean',
                      },
                    },
                    required: ['name', 'title', 'birthDate', 'phoneNumber'],
                  },
                  uiSchema: {
                    'ui:order': [
                      'name',
                      'title',
                      'birthDate',
                      'personalPhoneNumber',
                      'companyCheck',
                    ],
                    personalPhoneNumber: {
                      'ui:field': 'PhoneInput',
                      'ui:label': true,
                    },
                    birthDate: {
                      'ui:field': 'DateInput',
                      'ui:label': true,
                    },
                    name: {
                      'ui:order': ['firstName', 'lastName'],
                      firstName: {
                        'ui:placeholder': 'First Name',
                        'ui:label': true,
                      },
                      lastName: {
                        'ui:placeholder': 'Last Name',
                        'ui:label': false,
                      },
                    },
                    title: {
                      'ui:placeholder': 'CEO / Manager / Partner',
                    },
                    email: {
                      'ui:placeholder': 'john@example.com',
                    },
                    'ui:options': {
                      submitButtonOptions: {
                        submitText: 'Continue',
                      },
                    },
                  },
                  defaultData: {
                    title: '',
                    name: {
                      firstName: '',
                      lastName: '',
                    },
                    birthDate: '',
                    phoneNumber: '',
                    companyCheck: false,
                  },
                  key: 'personalInformation',
                },
              ],
            },
          },
        },
      },
      process_documents: {
        on: {
          API_CALL_SUCCESS: [
            {
              target: 'approved',
              cond: {
                type: 'json-logic',
                options: {
                  rule: {
                    '>': [{ var: 'pluginsOutput.business_data_vendor.name_fuzziness_score' }, 0.5],
                  },
                  onFailed: {
                    manualReviewReason: 'Company name and Registered Business name do not match',
                  },
                },
              },
            },
            {
              target: 'manual_review',
            },
          ],
          API_CALL_ERROR: 'manual_review',
        },
      },
      manual_review: {
        on: {
          approve: 'approved',
          reject: 'rejected',
          revision: 'data_collection',
        },
      },
      rejected: {
        type: 'final',
      },
      approved: {
        type: 'final',
      },
    },
    extensions: {
      apiPlugins: [
        {
          name: 'llm_ocr_extraction',
          pluginKind: 'api',
          url: 'https://unified-api-test.eu.ballerine.app/ocr/extract',
          method: 'POST',
          headers: {
            authorization: 'Bearer {secret.UNIFIED_API_TOKEN}',
          },
          stateNames: ['process_documents'],
          successAction: 'API_CALL_SUCCESS',
          errorAction: 'API_CALL_ERROR',
          request: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: `{images: [{remote: {imageUri: documents[0].pages[0].uri}}], schema: { type:'object', properties: { name: {type: 'string'}}}}`,
              },
            ],
            schema: {}, // OPTIONAL
          },
          response: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: '@', // jmespath
              },
            ],
            schema: {}, // OPTIONAL
          },
        },
        {
          name: 'webhook_final_results',
          url: 'https://webhook.site/91f5bfc1-79d2-4fea-b9d6-a0fe7ce905d5',
          method: 'POST',
          stateNames: ['approved', 'rejected'],
          request: {
            transform: [
              {
                transformer: 'jmespath',
                mapping: '{workflow_decision: state, data: @}',
              },
            ],
          },
        },
      ],
      commonPlugins: [],
    },
    config: {},
  },
};

const generateParentKybWithSessionKycs = async (prismaClient: PrismaClient) => {
  return await prismaClient.workflowDefinition.create({
    data: devconExampleWorkflowBeforeChanges,
  });
};

// check if the workflow is already seeded
const isSeeded = async (prismaClient: PrismaClient) => {
  const workflow = await prismaClient.workflowDefinition.findUnique({
    where: {
      id: devconExampleWorkflowBeforeChanges.id,
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

async function createCustomer(
  client: PrismaClient,
  id: string,
  apiKey: string,
  logoImageUri: string,
) {
  return await client.customer.create({
    data: {
      id: `customer-${id}`,
      name: `Customer ${id}`,
      displayName: `Customer ${id}`,
      authenticationConfiguration: {
        apiType: 'API_KEY',
        authValue: apiKey,
        validUntil: '',
        isValid: '',
      },
      logoImageUri: logoImageUri,
      country: 'GB',
      language: 'en',
    },
  });
}
async function createProject(client: PrismaClient, customer: Customer, id: string) {
  return client.project.create({
    data: {
      id: `project-${id}`,
      name: `Project ${id}`,
      customerId: customer.id,
    },
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

async function seed(bcryptSalt: number | string) {
  console.info('Seeding database....');
  const client = new PrismaClient();
  const customer = await createCustomer(
    client,
    '1',
    'secret',
    'https://empirestartups.com/wp-content/uploads/2023/07/logo_fintech_devcon.png',
  );
  const customer2 = await createCustomer(
    client,
    '2',
    `secret-2`,
    'https://empirestartups.com/wp-content/uploads/2023/02/fintechdevcon2023.png',
  );
  const project1 = await createProject(client, customer, '1');
  const users = [
    {
      email: 'admin@admin.com',
      firstName: 'DevCon',
      lastName: 'Dev',
      password: await hash('admin', bcryptSalt),
      roles: ['user'],
      userToProjects: {
        create: { projectId: project1.id },
      },
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

  function createFilter(
    name: string,
    entity: 'individuals' | 'businesses',
    query: Prisma.WorkflowRuntimeDataFindManyArgs,
    projectId: string,
  ) {
    return client.filter.create({
      data: {
        entity,
        name,
        query: query as any,
        projectId: projectId,
      },
    });
  }

  await createFilter(
    'KYB with LLM Workshop cases',
    'businesses',
    {
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
        workflowDefinitionId: 'devcon_example_workflow',
        businessId: { not: null },
      },
    },
    project1.id,
  );

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
