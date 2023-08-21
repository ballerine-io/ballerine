import { faker } from '@faker-js/faker';
import { PrismaClient, WorkflowRuntimeDataStatus } from '@prisma/client';
import { generateBusiness, generateEndUser } from '../generate-end-user';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';

export const createDemoMockData = async (
  prismaClient: PrismaClient,
  customerCreateModel: CustomerCreateDto,
  createdCustomer: { projects: { id: string }[] },
) => {
  await createMockParentWithChildWorkflow(
    prismaClient,
    customerCreateModel.name,
    true,
    createdCustomer.projects[0]!.id,
  );
  await createMockParentWithChildWorkflow(
    prismaClient,
    customerCreateModel.name,
    true,
    createdCustomer.projects[0]!.id,
  );
  await createMockParentWithChildWorkflow(
    prismaClient,
    customerCreateModel.name,
    false,
    createdCustomer.projects[0]!.id,
  );
  await createMockParentWithChildWorkflow(
    prismaClient,
    customerCreateModel.name,
    false,
    createdCustomer.projects[0]!.id,
  );
};

export const createMockParentWithChildWorkflow = async (
  prismaClient: PrismaClient,
  customerName: string,
  withAml: boolean,
  projectId: string,
) => {
  const companyName = faker.company.name();
  const businessId = faker.datatype.uuid();
  const endUserId = faker.datatype.uuid();

  const parentRuntimeInformation = generateParentRuntimeInformation(
    businessId,
    companyName,
    projectId,
  );
  // @ts-ignore
  const businessWithWorkflowInformation = generateBusiness({
    id: businessId,
    workflow: {
      workflowDefinitionId: parentRuntimeInformation.workflowDefinitionId,
      workflowDefinitionVersion: parentRuntimeInformation.workflowDefinitionVersion,
      context: parentRuntimeInformation.context,
    },
    projectId: projectId,
  });
  const business = await prismaClient.business.create({
    data: businessWithWorkflowInformation,
    select: { workflowRuntimeData: true },
  });
  const childWorkflowRuntimeInformation = generateChildRuntimeInformation(
    endUserId,
    customerName,
    companyName,
    withAml,
    projectId,
    business.workflowRuntimeData[0]!.id,
  );
  const endUserWithWorkflowInformation = generateEndUser({
    id: endUserId,
    workflow: {
      workflowDefinitionId: childWorkflowRuntimeInformation.workflowDefinitionId,
      workflowDefinitionVersion: childWorkflowRuntimeInformation.workflowDefinitionVersion,
      context: childWorkflowRuntimeInformation.context,
      parentRuntimeId: business.workflowRuntimeData[0]!.id,
    },
    projectId: projectId,
  });
  // @ts-ignore
  await prismaClient.endUser.create({ data: endUserWithWorkflowInformation });
  const childPage = childWorkflowRuntimeInformation.context.documents[0]!.pages[0]!;
  const parentPage = parentRuntimeInformation.context.documents[0]!.pages[0]!;
  await prismaClient.file.create({
    data: {
      id: childPage.ballerineFileId,
      userId: faker.datatype.uuid(),
      uri: childPage.uri,
      fileNameOnDisk: childPage.uri,
      projectId: projectId,
    },
  });
  await prismaClient.file.create({
    data: {
      id: parentPage.ballerineFileId,
      userId: faker.datatype.uuid(),
      uri: parentPage.uri,
      fileNameOnDisk: parentPage.uri,
      projectId: projectId,
    },
  });
};

export const generateChildRuntimeInformation = (
  endUserId: string,
  customerName: string,
  companyName: string,
  withAml: boolean,
  projectId: string,
  parentWorkflowId: string,
) => {
  return {
    workflowDefinitionId: 'kyc_email_session_example',
    workflowDefinitionVersion: 1,
    context: createKycRuntime(customerName, companyName, withAml),
    state: 'kyc_manual_review',
    status: WorkflowRuntimeDataStatus.active,
    createdAt: faker.date.recent(2),
    updatedAt: faker.date.recent(2),
    createdBy: 'SYSTEM',
    resolvedAt: null,
    config: {
      callbackResult: {
        deliverEvent: 'KYC_DONE',
        transformers: [{ mapping: '{data: @}', transformer: 'jmespath' }],
      },
    },
    parentRuntimeDataId: parentWorkflowId,
    projectId: projectId,
  };
};

export const generateParentRuntimeInformation = (
  businessId: string,
  companyName: string,
  projectId: string,
) => {
  return {
    businessId: businessId,
    workflowDefinitionId: 'kyb_parent_kyc_session_example',
    workflowDefinitionVersion: 1,
    context: generateParentRuntimeContext(companyName),
    state: 'manual_review',
    status: WorkflowRuntimeDataStatus.active,
    createdAt: faker.date.recent(2),
    updatedAt: faker.date.recent(2),
    createdBy: 'SYSTEM',
    resolvedAt: null,
    config: {
      childCallbackResults: [
        {
          definitionId: 'kyc_email_session_example',
          deliverEvent: 'KYC_RESPONDED',
          transformers: [
            {
              mapping:
                '{childEntity: entity.data, vendorResult: pluginsOutput.kyc_session.kyc_session_1.result}',
              transformer: 'jmespath',
            },
          ],
          persistenceStates: ['kyc_manual_review'],
        },
      ],
    },
    projectId: projectId,
  };
};

export const createKycRuntime = (customerName: string, companyName: string, withAml: boolean) => ({
  entity: {
    id: faker.datatype.uuid(),
    data: {
      email: faker.internet.email(),
      lastName: faker.name.lastName(),
      firstName: faker.name.firstName(),
      additionalInfo: {
        companyName: companyName,
        customerCompany: customerName,
      },
    },
    type: 'individual',
  },
  documents: [
    {
      id: faker.datatype.uuid(),
      type: 'identification_document',
      pages: [
        {
          uri: faker.image.people(),
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        city: null,
        name: null,
        country: 'IL',
        issuingVersion: null,
        additionalDetails: {
          validFrom: faker.date.past().toISOString(),
          firstIssue: null,
          validUntil: faker.date.future().toISOString(),
        },
      },
      category: 'passport',
      properties: {
        idNumber: faker.datatype.number().toString(),
        validFrom: faker.date.past().toISOString(),
        expiryDate: faker.date.future().toISOString(),
        firstIssue: null,
        validUntil: faker.date.future().toISOString(),
      },
    },
  ],
  pluginsOutput: {
    kyc_session: {
      kyc_session_1: {
        type: 'kyc',
        result: {
          aml: withAml
            ? createAmlData(2)
            : {
                hits: [],
                endUserId: faker.datatype.uuid(),
                matchStatus: 'no_match',
              },
          entity: {
            data: {
              lastName: faker.name.lastName(),
              firstName: faker.name.firstName(),
              nationalId: faker.datatype.number().toString(),
              dateOfBirth: faker.date.past().toISOString(),
              additionalInfo: {
                gender: 'M',
                addresses: [],
                nationality: 'IL',
                yearOfBirth: null,
                placeOfBirth: null,
              },
            },
            type: 'individual',
          },
          decision: {
            status: 'approved',
            riskLabels: [],
            decisionReason: null,
            metadata: {
              id: faker.datatype.uuid(),
              url: faker.internet.url(),
            },
          },
        },
        vendor: 'veriff',
      },
    },
  },
  workflowRuntimeId: faker.datatype.uuid(),
});

const createAmlData = (numberOfHits: number) => {
  const hits = Array.from({ length: numberOfHits }, () => ({
    aka: [faker.name.fullName(), faker.name.fullName(), faker.name.fullName()],
    countries: [faker.address.country(), faker.address.country(), faker.address.country()],
    matchTypes: [
      faker.helpers.arrayElement(['unknown', 'year_of_birth', 'full_name', 'last_name']),
      faker.helpers.arrayElement(['unknown', 'year_of_birth', 'full_name', 'last_name']),
    ],
    dateOfBirth: faker.date.between('1970-01-01', '2000-01-01').toISOString().split('T')[0],
    dateOfDeath: null,
    matchedName: faker.name.fullName(),
    listingsRelatedToMatch: {
      pep: [],
      warnings: [],
      sanctions: [
        {
          sourceUrl:
            'http://www.treasury.gov/resource-center/sanctions/SDN-List/Pages/default.aspx',
          sourceName: 'OFAC SDN List',
        },
      ],
      fitnessProbity: [],
    },
  }));

  return {
    attemptId: faker.datatype.uuid(),
    vendorData: '123123-my-vendor-data',
    checkType: 'initial_result',
    matchStatus: 'possible_match',
    searchTerm: {
      name: faker.name.fullName(),
      year: faker.date.past().getFullYear().toString(),
    },
    totalHits: numberOfHits,
    createdAt: faker.date.recent().toISOString(),
    hits: hits,
  };
};

const generateParentRuntimeContext = (companyName: string) => {
  return {
    entity: {
      id: `company_id_${faker.datatype.number()}`,
      data: {
        companyName: companyName,
        additionalInfo: {
          ubos: [
            {
              entity: {
                id: faker.datatype.uuid(),
                data: {
                  email: faker.internet.email(),
                  lastName: faker.name.lastName(),
                  firstName: faker.name.firstName(),
                  additionalInfo: {
                    companyName: faker.company.name(),
                    customerCompany: faker.random.word(),
                  },
                },
                type: 'individual',
              },
            },
          ],
          registrationNumber: faker.random.alphaNumeric(8),
          countryOfIncorporation: faker.address.country(),
          taxIdentificationNumber: faker.random.alphaNumeric(8),
        },
      },
      type: 'business',
    },
    documents: [
      {
        id: faker.datatype.uuid(),
        type: 'unknown',
        pages: [
          {
            uri: faker.image.business(),
            type: 'png',
            metadata: { side: 'front', pageNumber: '1' },
            provider: 'http',
            ballerineFileId: faker.random.alphaNumeric(20),
          },
        ],
        issuer: { country: faker.address.countryCode() },
        version: '1',
        category: 'proof_of_Address',
        properties: { docNumber: '1234', userAddress: faker.address.streetAddress() },
        issuingVersion: 1,
      },
    ],
    pluginsOutput: {
      open_corporates: {
        name: companyName,
        source: {
          url: faker.internet.url(),
          publisher: faker.company.name(),
          retrievedAt: faker.date.past().toISOString(),
        },
        isBranch: faker.datatype.boolean(),
        officers: Array.from({ length: faker.datatype.number({ min: 1, max: 5 }) }, () => ({
          name: faker.name.fullName(),
          address: faker.address.streetAddress(),
          endDate: faker.date.past().toISOString(),
          position: faker.name.jobTitle(),
          startDate: faker.date.past().toISOString(),
          isInactive: faker.datatype.boolean(),
          occupation: faker.random.word(),
          currentStatus: faker.helpers.arrayElement([null, 'active']),
        })),
        agentName: faker.name.fullName(),
        industries: Array.from({ length: faker.datatype.number({ min: 1, max: 3 }) }, () => ({
          uid: faker.datatype.uuid(),
          code: faker.random.alphaNumeric(4),
          description: faker.company.catchPhrase(),
          codeSchemeId: faker.random.word(),
          codeSchemeName: faker.random.word(),
        })),
        isInactive: faker.datatype.boolean(),
        companyType: 'Private Limited Company',
        identifiers: [
          {
            uid: faker.random.numeric(),
            identifierSystemCode: faker.random.alphaNumeric(6),
            identifierSystemName: faker.random.word(),
          },
        ],
        registryUrl: faker.internet.url(),
        branchStatus: null,
        companyNumber: faker.random.alphaNumeric(8),
        currentStatus: 'Active',
        previousNames: [
          {
            type: null,
            endDate: faker.date.past().toISOString(),
            language: null,
            startDate: faker.date.past().toISOString(),
            companyName: faker.company.name(),
          },
        ],
        dissolutionDate: null,
        alternativeNames: [],
        jurisdictionCode: 'gb',
        incorporationDate: faker.date.past().toISOString(),
        numberOfEmployees: faker.random.numeric(),
        registeredAddress: {
          region: null,
          country: faker.address.country(),
          locality: faker.address.city(),
          postalCode: faker.address.zipCode(),
          streetAddress: faker.address.streetAddress(),
        },
        registeredAddressInFull: faker.address.streetAddress(),
      },
    },
    childWorkflows: {
      kyc_email_session_example: {
        [faker.random.alphaNumeric(20)]: {
          result: {
            childEntity: {
              email: faker.internet.email(),
              lastName: faker.name.lastName(),
              firstName: faker.name.firstName(),
              additionalInfo: {
                companyName: faker.company.name(),
                customerCompany: faker.random.word(),
              },
            },
            vendorResult: {
              aml: {
                hits: [],
                endUserId: faker.random.alphaNumeric(40),
                matchStatus: 'no_match',
              },
              entity: {
                data: {
                  lastName: faker.name.lastName(),
                  firstName: faker.name.firstName(),
                  nationalId: faker.random.alphaNumeric(10),
                  dateOfBirth: faker.date.past().toISOString(),
                  additionalInfo: {
                    gender: faker.helpers.arrayElement(['M', 'F']),
                    addresses: [],
                    nationality: faker.address.countryCode(),
                    yearOfBirth: null,
                    placeOfBirth: null,
                  },
                },
                type: 'individual',
              },
              decision: {
                status: 'approved',
                riskLabels: [],
                decisionReason: null,
              },
              metadata: {
                id: faker.datatype.uuid(),
                url: faker.internet.url(),
              },
            },
          },
          status: 'active',
          entityId: faker.datatype.uuid(),
        },
      },
    },
    workflowRuntimeId: faker.random.alphaNumeric(20),
  };
};
