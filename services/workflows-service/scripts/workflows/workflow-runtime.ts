import { faker } from '@faker-js/faker';
import { Prisma, PrismaClient, WorkflowRuntimeDataStatus } from '@prisma/client';
import { generateBusiness, generateEndUser } from '../generate-end-user';
import { CustomerCreateDto } from '@/customer/dtos/customer-create';

type Workflow = {
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
    website: string;
    industry: string;
    taxIdentificationNumber: string;
    vatNumber: string;
    numberOfEmployees: number;
    businessPurpose: string;
    proofOfAddress: string;
    proofOfAddressIssuerCountry: string;
    documents: {
      registrationDocument: string;
      financialStatement: string;
    };
    shareholderStructure: Array<{
      name: string;
      ownershipPercentage: number;
    }>;
  };
  ubos: Array<{
    id: string;
    nationalId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth: Date;
    avatarUrl: string;
    gender: 'M' | 'F';
    nationality: string;
    decision: 'approved' | 'declined' | 'resubmission_requested';
    decisionReason: string | null;
    withAml: boolean;
    selfie: string;
    passport: {
      front: string;
      back: string;
      issuerCountryCode: string;
    };
  }>;
};

const workflows: Workflow[] = [
  {
    business: {
      id: faker.datatype.uuid(),
      name: 'SolTech S.L.',
      registrationNumber: 'B-12345678',
      legalForm: 'Sociedad Limitada (S.L.)',
      countryOfIncorporation: 'Spain',
      dateOfIncorporation: new Date('2017-03-15'),
      address: 'Calle Tecnología 15, 28013 Madrid',
      addressComponents: {
        country: 'Spain',
        locality: 'Madrid',
        postalCode: '28013',
        region: 'Madrid',
        streetAddress: 'Calle Tecnología 15',
      },
      jurisdictionCode: 'ES',
      proofOfAddress: 'url_al_comprobante_de_domicilio.pdf',
      proofOfAddressIssuerCountry: 'Spain',
      phoneNumber: '+34 910 123 456',
      email: 'contacto@soltech.es',
      website: 'www.soltech.es',
      industry: 'Renewable Energy',
      taxIdentificationNumber: 'ESB12345678',
      vatNumber: 'ESA12345678',
      numberOfEmployees: 60,
      businessPurpose: 'Desarrollo y venta de soluciones de energía renovable.',
      documents: {
        registrationDocument: 'url_al_documento_de_registro.pdf',
        financialStatement: 'url_al_estado_financiero_2022.pdf',
      },
      shareholderStructure: [
        {
          name: 'Maria González',
          ownershipPercentage: 80,
        },
      ],
    },
    ubos: [
      {
        id: faker.datatype.uuid(),
        nationalId: faker.random.numeric(10),
        decision: 'approved',
        decisionReason: null,
        withAml: false,
        nationality: 'Spain',
        gender: 'F',
        firstName: 'Maria',
        lastName: 'González',
        email: 'maria.gonzalez@email.es',
        phoneNumber: '+34 910 123 457',
        dateOfBirth: new Date('1984-06-10'),
        avatarUrl: 'url_al_avatar_maria_gonzalez.jpg',
        selfie: 'url_al_selfie_maria_gonzalez.jpg',
        passport: {
          front: 'url_al_pasaporte_delantero_maria_gonzalez.jpg',
          back: 'url_al_pasaporte_trasero_maria_gonzalez.jpg',
          issuerCountryCode: 'ES',
        },
      },
    ],
  },
];

export const createDemoMockData = async ({
  prismaClient,
  customer: { name: customerName },
  projects,
}: {
  prismaClient: PrismaClient;
  customer: CustomerCreateDto;
  projects: Array<{ id: string }>;
}) => {
  for (const { id: projectId } of projects) {
    for (const { business, ubos } of workflows) {
      await createMockParentWithChildWorkflow({
        prismaClient,
        customerName,
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
  projectId,
  business,
  ubos,
}: {
  prismaClient: PrismaClient;
  customerName: string;
  projectId: string;
  business: Workflow['business'];
  ubos: Workflow['ubos'];
}) => {
  const parentRuntimeInformation = generateParentRuntimeInformation({
    businessId: business.id,
    companyName: customerName,
    projectId,
    business,
    ubos,
  });
  const businessWithWorkflowInformation = generateBusiness({
    projectId: projectId,
    ...business,
    workflow: {
      workflowDefinitionId: parentRuntimeInformation.workflowDefinitionId,
      workflowDefinitionVersion: parentRuntimeInformation.workflowDefinitionVersion,
      context: parentRuntimeInformation.context as unknown as Prisma.InputJsonValue,
    },
  });
  parentRuntimeInformation.context.documents[0]!.pages.forEach(async file => {
    await prismaClient.file.create({
      data: {
        id: file.ballerineFileId,
        userId: faker.datatype.uuid(),
        uri: file.uri,
        fileNameOnDisk: file.uri,
        projectId: projectId,
      },
    });
  });

  for (const ubo of ubos) {
    const businessRecord = await prismaClient.business.create({
      data: businessWithWorkflowInformation,
      select: { workflowRuntimeData: true },
    });
    const childWorkflowRuntimeInformation = generateChildRuntimeInformation({
      customerName: customerName,
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
  projectId,
  parentWorkflowId,
}: {
  customerName: string;
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

export const generateParentRuntimeInformation = ({
  businessId,
  companyName,
  projectId,
  business,
  ubos,
}: {
  businessId: string;
  companyName: string;
  projectId: string;
  business: Workflow['business'];
  ubos: Workflow['ubos'];
}) => {
  return {
    businessId: businessId,
    workflowDefinitionId: 'kyb_parent_kyc_session_example',
    workflowDefinitionVersion: 1,
    context: generateParentRuntimeContext({ companyName, business, ubos }),
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
  ubo,
}: {
  customerName: string;
  ubo: Workflow['ubos'][number];
}) => ({
  entity: {
    id: ubo.id,
    data: {
      firstName: ubo.firstName,
      lastName: ubo.lastName,
      email: ubo.email,
      additionalInfo: {
        companyName: customerName,
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
          uri: ubo.passport.front,
          type: 'png',
          metadata: { side: 'front', pageNumber: '1' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
        {
          uri: ubo.passport.back,
          type: 'png',
          metadata: { side: 'back', pageNumber: '2' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
        {
          uri: ubo.selfie,
          type: 'png',
          metadata: { side: 'selfie', pageNumber: '3' },
          provider: 'http',
          ballerineFileId: faker.random.alphaNumeric(20),
        },
      ],
      issuer: {
        city: null,
        name: null,
        country: ubo.passport.issuerCountryCode,
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
          aml: createAmlData({ ubo }),
          entity: {
            data: {
              firstName: ubo.firstName,
              lastName: ubo.lastName,
              nationalId: ubo.nationalId,
              dateOfBirth: ubo.dateOfBirth,
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

const generateParentRuntimeContext = ({
  companyName,
  ubos,
  business,
}: {
  companyName: string;
  ubos: Workflow['ubos'];
  business: Workflow['business'];
}) => {
  return {
    entity: {
      id: `company_id_${faker.datatype.number()}`,
      data: {
        companyName: companyName,
        additionalInfo: {
          ubos: ubos.map(ubo => ({
            entity: {
              id: ubo.id,
              type: 'individual',
              data: {
                firstName: ubo.firstName,
                lastName: ubo.lastName,
                email: ubo.email,
                additionalInfo: {
                  companyName: companyName,
                  customerCompany: companyName,
                },
              },
            },
          })),
          registrationNumber: business.registrationNumber,
          countryOfIncorporation: business.countryOfIncorporation,
          taxIdentificationNumber: business.taxIdentificationNumber,
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
            uri: business.proofOfAddress,
            type: 'png',
            metadata: { side: 'front', pageNumber: '1' },
            provider: 'http',
            ballerineFileId: faker.random.alphaNumeric(20),
          },
        ],
        issuer: { country: business.proofOfAddressIssuerCountry },
        version: '1',
        category: 'proof_of_address',
        properties: {},
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
        isBranch: false,
        officers: [],
        agentName: null,
        industries: [],
        isInactive: false,
        companyType: 'Private Limited Company',
        identifiers: [],
        registryUrl: faker.internet.url(),
        branchStatus: null,
        companyNumber: business.registrationNumber,
        currentStatus: 'Active',
        previousNames: [],
        dissolutionDate: null,
        alternativeNames: [],
        jurisdictionCode: business.jurisdictionCode,
        incorporationDate: business.dateOfIncorporation.toISOString(),
        numberOfEmployees: business.numberOfEmployees,
        registeredAddress: {
          region: business.addressComponents.region,
          country: business.addressComponents.country,
          locality: business.addressComponents.locality,
          postalCode: business.addressComponents.postalCode,
          streetAddress: business.addressComponents.streetAddress,
        },
        registeredAddressInFull: business.address,
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
                additionalInfo: {
                  companyName: companyName,
                  customerCompany: companyName,
                },
              },
              vendorResult: {
                aml: createAmlData({ ubo }),
                entity: {
                  data: {
                    firstName: ubo.firstName,
                    lastName: ubo.lastName,
                    nationalId: ubo.nationalId,
                    dateOfBirth: ubo.dateOfBirth,
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
    workflowRuntimeId: faker.random.alphaNumeric(20),
  };
};
