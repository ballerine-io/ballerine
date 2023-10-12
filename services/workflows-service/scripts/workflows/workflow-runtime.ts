import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient, WorkflowRuntimeDataStatus } from '@prisma/client';
import { generateBusiness, generateEndUser } from '../generate-end-user';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';
import { workflows } from './mock-workflows';

export type Workflow = {
  business: {
    id: string;
    name: string;
    registrationNumber: string;
    legalForm: string;
    countryOfIncorporation: string;
    jurisdictionCode: string;
    dateOfIncorporation: Date;
    address: string;
    addressComponents: {
      region: string;
      country: string;
      locality: string;
      postalCode: string;
      streetAddress: string;
    };
    phoneNumber: string;
    email: string;
    website: string; // URL
    industry: string;
    taxIdentificationNumber: string;
    vatNumber: string;
    numberOfEmployees: number;
    businessPurpose: string;
    proofOfAddress: string; // URL
    proofOfAddressIssuerCountry: string;
    bankStatement: string; // URL
    companyStructure: string; // URL
    registrationCertificate: string; // URL
    shareholderStructure: Array<{
      name: string;
      ownershipPercentage: number;
    }>;
    bankInformation: {
      holder: string;
      account: number;
      country: string;
      bankName: string;
      currency: string;
    };
    companyActivity: {
      model: string;
      volumeAmount: number;
      transactionValue: number;
    };
  };
  ubos: Array<{
    id: string;
    nationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    title: string;
    dateOfBirth: Date;
    avatarUrl: string; // URL
    gender: 'M' | 'F';
    nationality: string;
    decision: 'approved' | 'declined' | 'resubmission_requested';
    decisionReason: string | null;
    withAml: boolean;
    selfie: string; // URL
    passport: {
      front: string; // URL
      back?: string; // URL
      issuerCountryCode: string;
    };
  }>;
};

export const createDemoMockData = async ({
  prismaClient,
  customer: { name: customerName, displayName: customerDisplayName },
  projects,
}: {
  prismaClient: PrismaClient;
  customer: CustomerCreateDto;
  projects: Array<{ id: string }>;
}) => {
  for (const { id: projectId } of projects) {
    for (const { business, ubos } of workflows()) {
      await createMockParentWithChildWorkflow({
        prismaClient,
        customerName,
        customerDisplayName,
        projectId,
        business,
        ubos,
      });
    }
  }
};

export const createMockParentWithChildWorkflow = async ({
  prismaClient,
  customerName,
  customerDisplayName,
  projectId,
  business,
  ubos,
}: {
  prismaClient: PrismaClient;
  customerName: string;
  customerDisplayName: string;
  projectId: string;
  business: Workflow['business'];
  ubos: Workflow['ubos'];
}) => {
  const parentRuntimeInformation = await generateParentRuntimeInformation({
    businessId: business.id,
    customerName,
    customerDisplayName,
    projectId,
    business,
    ubos,
    prismaClient,
  });
  const businessWithWorkflowInformation = generateBusiness({
    projectId: projectId,
    ...business,
    workflow: {
      workflowDefinitionId: parentRuntimeInformation.workflowDefinitionId,
      workflowDefinitionVersion: parentRuntimeInformation.workflowDefinitionVersion,
      state: 'manual_review',
      context: parentRuntimeInformation.context as unknown as Prisma.InputJsonValue,
    },
  });
  const businessRecord = await prismaClient.business.create({
    data: businessWithWorkflowInformation,
    select: { workflowRuntimeData: true },
  });

  for (const ubo of ubos) {
    const childWorkflowRuntimeInformation = generateChildRuntimeInformation({
      customerName,
      customerDisplayName,
      projectId: projectId,
      parentWorkflowId: businessRecord.workflowRuntimeData[0]!.id,
      ubo,
    });
    const endUserWithWorkflowInformation = generateEndUser({
      id: ubo.id,
      workflow: {
        workflowDefinitionId: childWorkflowRuntimeInformation.workflowDefinitionId,
        workflowDefinitionVersion: childWorkflowRuntimeInformation.workflowDefinitionVersion,
        context: childWorkflowRuntimeInformation.context as unknown as Prisma.InputJsonValue,
        parentRuntimeId: businessRecord.workflowRuntimeData[0]!.id,
        state: 'manual_review',
      },
      projectId: projectId,
    });
    await prismaClient.endUser.create({ data: endUserWithWorkflowInformation });
    childWorkflowRuntimeInformation.context.documents[0]!.pages.forEach(async childPage => {
      await prismaClient.file.create({
        data: {
          id: childPage.ballerineFileId,
          userId: faker.datatype.uuid(),
          uri: childPage.uri,
          fileNameOnDisk: childPage.uri,
          projectId: projectId,
        },
      });
    });
  }
};

export const generateChildRuntimeInformation = ({
  ubo,
  customerName,
  customerDisplayName,
  projectId,
  parentWorkflowId,
}: {
  customerName: string;
  customerDisplayName: string;
  projectId: string;
  parentWorkflowId: string;
  ubo: Workflow['ubos'][number];
}) => {
  return {
    workflowDefinitionId: 'kyc_email_session_example',
    workflowDefinitionVersion: 1,
    context: createKycRuntime({
      customerName: customerName,
      ubo: ubo,
      customerDisplayName,
    }),
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

export const generateParentRuntimeInformation = async ({
  businessId,
  customerName,
  customerDisplayName,
  projectId,
  business,
  ubos,
  prismaClient,
}: {
  businessId: string;
  customerName: string;
  customerDisplayName: string;
  projectId: string;
  business: Workflow['business'];
  ubos: Workflow['ubos'];
  prismaClient: PrismaClient;
}) => {
  return {
    businessId: businessId,
    workflowDefinitionId: 'kyb_parent_kyc_session_example',
    workflowDefinitionVersion: 1,
    context: await generateParentRuntimeContext({
      customerName,
      customerDisplayName,
      business,
      ubos,
      projectId,
      prismaClient,
    }),
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

export const createKycRuntime = ({
  customerName,
  customerDisplayName,
  ubo,
}: {
  customerName: string;
  customerDisplayName: string;
  ubo: Workflow['ubos'][number];
}) => ({
  entity: {
    id: ubo.id,
    data: {
      firstName: ubo.firstName,
      lastName: ubo.lastName,
      email: ubo.email,
      dateOfBirth: ubo.dateOfBirth.toISOString(),
      additionalInfo: {
        title: ubo.title,
        companyName: customerName,
        customerCompany: customerDisplayName,
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
          uri: ubo.selfie,
          type: 'png',
          metadata: {
            side: 'face',
          },
          provider: 'file-system',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
        {
          uri: ubo.passport.front,
          type: 'png',
          metadata: {
            side: 'front',
          },
          provider: 'file-system',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
        ...(ubo.passport.back
          ? [
              {
                uri: ubo.passport.back,
                type: 'png',
                metadata: {
                  side: 'back',
                },
                provider: 'base64',
                ballerineFileId: faker.random.alphaNumeric(20),
              },
            ]
          : []),
      ],
      issuer: {
        city: null,
        name: null,
        country: ubo.passport.issuerCountryCode,
        issuingVersion: null,
        additionalInfo: {
          validFrom: faker.date.past().toISOString(),
          validUntil: faker.date.future().toISOString(),
          firstIssue: null,
        },
      },
      category: 'passport',
      properties: {
        idNumber: ubo.nationalId,
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
          aml: createAmlData({ ubo }),
          entity: {
            data: {
              firstName: ubo.firstName,
              lastName: ubo.lastName,
              nationalId: ubo.nationalId,
              dateOfBirth: ubo.dateOfBirth.toISOString().split('T')[0],
              additionalInfo: {
                gender: ubo.gender,
                addresses: [],
                nationality: ubo.nationality,
                yearOfBirth: ubo.dateOfBirth.getFullYear(),
                placeOfBirth: null,
              },
            },
            type: 'individual',
          },
          decision: {
            status: ubo.decision,
            riskLabels: [],
            decisionReason: ubo.decisionReason,
          },
          metadata: {
            id: faker.datatype.uuid(),
            url: faker.internet.url(),
          },
        },
        vendor: 'veriff',
      },
    },
  },
  workflowRuntimeId: faker.datatype.uuid(),
});

const createAmlData = ({ ubo }: { ubo: Workflow['ubos'][number] }) => {
  if (!ubo.withAml) {
    return {
      hits: [],
      endUserId: ubo.id,
      matchStatus: 'no_match',
    };
  }

  return {
    attemptId: faker.datatype.uuid(),
    vendorData: '123123-my-vendor-data',
    checkType: 'initial_result',
    matchStatus: 'possible_match',
    searchTerm: {
      name: `${ubo.firstName} ${ubo.lastName}`,
      year: ubo.dateOfBirth.getFullYear(),
    },
    totalHits: 1,
    createdAt: faker.date.recent().toISOString(),
    hits: [
      {
        aka: [`${ubo.lastName} ${ubo.firstName}`],
        countries: [faker.address.country()],
        matchTypes: [faker.helpers.arrayElement(['year_of_birth', 'full_name', 'last_name'])],
        dateOfBirth: ubo.dateOfBirth.toISOString().split('T')[0],
        dateOfDeath: null,
        matchedName: `${ubo.firstName} ${ubo.lastName}`,
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
          adverseMedia: [],
        },
      },
    ],
  };
};

const generateParentRuntimeContext = async ({
  customerName,
  customerDisplayName,
  ubos,
  business,
  prismaClient,
  projectId,
}: {
  customerName: string;
  customerDisplayName: string;
  ubos: Workflow['ubos'];
  business: Workflow['business'];
  prismaClient: PrismaClient;
  projectId: string;
}) => {
  const documents = [
    {
      id: faker.datatype.uuid(),
      type: 'bank_statement',
      pages: [
        {
          uri: business.bankStatement,
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        country: 'GH',
      },
      version: '1',
      category: 'proof_of_bank_account',
      decision: {
        status: '',
        revisionReason: '',
        rejectionReason: '',
      },
      properties: {
        name: business.bankInformation.bankName,
        country: business.bankInformation.country,
        currency: business.bankInformation.currency,
        holderName: business.bankInformation.holder,
        accountNumber: business.bankInformation.account,
      },
      issuingVersion: 1,
    },
    {
      id: faker.datatype.uuid(),
      type: 'shareholders',
      pages: [
        {
          uri: business.companyStructure,
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        country: 'GH',
      },
      version: '1',
      category: 'company_structure',
      decision: {
        status: '',
        revisionReason: '',
        rejectionReason: '',
      },
      properties: {},
      issuingVersion: 1,
    },
    {
      id: faker.datatype.uuid(),
      type: 'certificate_of_incorporation',
      pages: [
        {
          uri: business.registrationCertificate,
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        country: 'GH',
      },
      version: '1',
      category: 'registration_document',
      decision: {
        status: '',
        revisionReason: '',
        rejectionReason: '',
      },
      properties: {
        vat: business.vatNumber,
        state: business.addressComponents.region,
        country: business.addressComponents.country,
        companyName: business.name,
        companyType: business.legalForm,
        establishmentDate: business.dateOfIncorporation.toISOString().split('T')[0],
      },
      issuingVersion: 1,
    },
    {
      id: faker.datatype.uuid(),
      type: 'water_bill',
      pages: [
        {
          uri: business.proofOfAddress,
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        country: 'GH',
      },
      version: '1',
      category: 'proof_of_address',
      decision: {
        status: '',
        revisionReason: '',
        rejectionReason: '',
      },
      properties: {
        userAddress: business.address,
      },
      issuingVersion: 1,
    },
  ] as const;

  const companyDocuments = {
    addressProof: '',
    bankStatement: '',
    companyStructure: '',
    registrationCertificate: '',
  };

  const map = {
    proof_of_address: 'addressProof',
    proof_of_bank_account: 'bankStatement',
    company_structure: 'companyStructure',
    registration_document: 'registrationCertificate',
  } as const;

  for (const document of documents) {
    for (const page of document.pages) {
      const file = await prismaClient.file.create({
        data: {
          id: page.ballerineFileId,
          userId: faker.datatype.uuid(),
          uri: page.uri,
          fileNameOnDisk: page.uri,
          projectId: projectId,
        },
      });

      companyDocuments[map[document.category]] = file.id;
    }
  }

  return {
    entity: {
      data: {
        email: business.email,
        address: business.address,
        country: business.addressComponents.country,
        website: business.website,
        industry: business.industry,
        legalForm: business.legalForm,
        vatNumber: business.vatNumber,
        companyName: business.name,
        dynamicInfo: {
          ubos: {
            check: true,
            shareholders: [],
          },
          headquarters: {
            city: business.addressComponents.locality,
            phone: business.phoneNumber,
            state: '',
            street: business.addressComponents.streetAddress,
            address: '',
            country: business.addressComponents.country,
            postalCode: business.addressComponents.postalCode,
            streetNumber: '',
          },
          bankInformation: business.bankInformation,
          companyActivity: { industry: business.industry, ...business.companyActivity },
          companyDocuments: companyDocuments,
          companyInformation: {
            vat: business.vatNumber,
            state: business.addressComponents.region,
            companyName: business.name,
            companyType: business.legalForm,
            companyCountry: business.addressComponents.country,
            registrationDate: business.dateOfIncorporation,
            registrationNumber: business.registrationNumber,
          },
          personalInformation: {
            name: {
              firstName: ubos[0]!.firstName,
              lastName: ubos[0]!.lastName,
            },
            title: ubos[0]!.title,
            birthDate: ubos[0]!.dateOfBirth.toISOString(),
            phoneNumber: '',
            companyCheck: true,
            personalPhoneNumber: ubos[0]!.phoneNumber,
          },
        },
        phoneNumber: '',
        additionalInfo: {
          ubos: ubos.map(ubo => ({
            entity: {
              id: ubo.id,
              data: {
                firstName: ubo.firstName,
                lastName: ubo.lastName,
                email: ubo.email,
                dateOfBirth: ubo.dateOfBirth.toISOString(),
                additionalInfo: {
                  title: ubo.title,
                  companyName: customerName,
                  customerCompany: customerDisplayName,
                },
              },
              type: 'individual',
            },
          })),
          mainRepresentative: {
            firstName: ubos[0]!.firstName,
            lastName: ubos[0]!.lastName,
            title: ubos[0]!.title,
            email: ubos[0]!.email,
            phone: ubos[0]!.phoneNumber,
            companyName: business.name,
            dateOfBirth: ubos[0]!.dateOfBirth.toISOString(),
          },
        },
        registrationNumber: business.registrationNumber,
        dateOfIncorporation: business.dateOfIncorporation.toISOString(),
        countryOfIncorporation: business.countryOfIncorporation,
        taxIdentificationNumber: business.taxIdentificationNumber,
      },
      type: 'business',
      endUserId: ubos[0]!.id,
      ballerineEntityId: business.id,
    },
    documents,
    pluginsOutput: {
      open_corporates: {
        companyNumber: business.registrationNumber,
        registeredAddress: business.addressComponents,
        identifiers: [],
        registeredAddressInFull: business.address,
        name: business.name,
        incorporationDate: business.dateOfIncorporation.toISOString(),
        source: {
          url: faker.internet.url(),
          retrievedAt: faker.date.recent().toISOString(),
          publisher: 'Cartwright - Nikolaus',
        },
        officers: [],
        previousNames: [],
        isInactive: false,
        agentName: null,
        industries: [],
        companyType: business.legalForm,
        registryUrl: faker.internet.url(),
        numberOfEmployees: business.numberOfEmployees,
        jurisdictionCode: business.jurisdictionCode,
        isBranch: false,
        dissolutionDate: null,
        branchStatus: null,
        currentStatus: 'Active',
        alternativeNames: [],
      },
    },
    childWorkflows: {
      kyc_email_session_example: Object.fromEntries(
        ubos.map(ubo => [
          faker.datatype.uuid(),
          {
            result: {
              childEntity: {
                firstName: ubo.firstName,
                lastName: ubo.lastName,
                email: ubo.email,
                dateOfBirth: ubo.dateOfBirth.toISOString(),
                additionalInfo: {
                  title: ubo.title,
                  companyName: customerName,
                  customerCompany: customerDisplayName,
                },
              },
              vendorResult: {
                aml: createAmlData({ ubo }),
                entity: {
                  data: {
                    firstName: ubo.firstName,
                    lastName: ubo.lastName,
                    nationalId: ubo.nationalId,
                    dateOfBirth: ubo.dateOfBirth.toISOString().split('T')[0],
                    additionalInfo: {
                      gender: ubo.gender,
                      addresses: [],
                      nationality: ubo.nationality,
                      yearOfBirth: ubo.dateOfBirth.getFullYear(),
                      placeOfBirth: null,
                    },
                  },
                  type: 'individual',
                },
                decision: {
                  status: ubo.decision,
                  riskLabels: [],
                  decisionReason: ubo.decisionReason,
                },
                metadata: {
                  id: faker.datatype.uuid(),
                  url: faker.internet.url(),
                },
              },
            },
            status: 'active',
            entityId: ubo.id,
          },
        ]),
      ),
    },
    workflowRuntimeId: faker.datatype.uuid(),
  };
};
