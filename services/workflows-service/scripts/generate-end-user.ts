import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { EndUserAmlHitsSchema, StateTag } from '@ballerine/common';
import { z } from 'zod';

export const endUserIds = [
  'ckkt3qnv40001qxtt7nmj9r2r',
  'ckkt3r0v40002qxtt8sxk7fvi',
  'ckkt3rhxr0003qxtt5x6h5j1w',
  'ckkt3rv4z0004qxtte4vz9e9e',
  'ckkt3s3ha0005qxttdz5yxg7p',
  'ckkt3sc1n0006qxtt9e9u7y6z',
  'ckkt3sjz40007qxtt3nqj80jt',
  'ckkt3st0r0008qxtt5rxj0wgg',
  'ckkt3swf20009qxttgx0p6x60',
  'ckkt3t2bw000aqxtt0hj4pw4c',
  'ckkt3t2bw000aqxtt0hj4pw4d',
  'ckkt3t2bw000aqxtt0hj4pw4e',
  'ckkt3t2bw000aqxtt0hj4pw4f',
  'ckkt3t2bw000aqxtt0hj4pw4g',
  'ckkt3t2bw000aqxtt0hj4pw4h',
  'ckkt3t2bw000aqxtt0hj4pw4i',
];

export const businessRiskIds = [
  'ckkt3qnv41001qxtt7nmj9r26',
  'ckkt3r0v42002qxtt8sxk7fv9',
  'ckkt3rhxr3003qxtt5x6h5j18',
  'ckkt3rv4z4004qxtte4vz9e19',
  'ckkt3s3ha5005qxttdz5yxg20',
  'ckkt3sc1n6006qxtt9e9u7y21',
  'ckkt3sjz70007qxtt3nqj80j22',
  'ckkt3st0r8008qxtt5rxj0wg23',
  'ckkt3swf90009qxttgx0p6x24',
  'ckkt3t2bw000aqxtt0hj4pw25',
  'ckkt3t2bw000aqxtt0hj4pw26',
  'ckkt3t2bw000aqxtt0hj4pw27',
  'ckkt3t2bw000aqxtt0hj4pw28',
  'ckkt3t2bw000aqxtt0hj4pw29',
];
export const businessIds = [
  'ckkt3rv4z4004qxtte4vz9e97',
  'ckkt3s3ha5005qxttdz5yxg76',
  'ckkt3sc16006qxtt9e9u7y65',
  'ckkt3sjz70007qxtt3nqj80j4',
  'ckkt3st080008qxtt5rxj0wg3',
  'ckkt3swf90009qxttgx0p6x62',
  'ckkt3t2b1000aqxtt0hj4pw41',
];

export const generateBusiness = ({
  id: id = faker.string.uuid(),
  correlationId = faker.string.uuid(),
  companyName = faker.company.name(),
  registrationNumber = faker.string.uuid(),
  legalForm = faker.company.companySuffix(),
  countryOfIncorporation = faker.location.country(),
  dateOfIncorporation = faker.date.past({ years: 10 }),
  address = faker.location.streetAddress(),
  phoneNumber = faker.phone.number('+##########'),
  email = faker.internet.email(),
  website = faker.internet.url(),
  industry = faker.company.buzzPhrase(),
  taxIdentificationNumber = faker.finance.accountNumber(10),
  vatNumber = `VAT${faker.finance.accountNumber(8)}`,
  numberOfEmployees = faker.number.int({ min: 1, max: 1000 }),
  businessPurpose = faker.company.catchPhrase(),
  shareholderStructure = [
    {
      name: faker.person.fullName(),
      ownershipPercentage: Number(faker.finance.amount(0, 100, 2)),
    },
  ],
  workflow,
  projectId,
}: {
  id?: string;
  correlationId?: string;
  companyName?: string;
  registrationNumber?: string;
  legalForm?: string;
  countryOfIncorporation?: string;
  dateOfIncorporation?: Date;
  address?: string;
  phoneNumber?: string;
  email?: string;
  website?: string;
  industry?: string;
  taxIdentificationNumber?: string;
  vatNumber?: string;
  numberOfEmployees?: number;
  businessPurpose?: string;
  shareholderStructure?: Array<{
    name: string;
    ownershipPercentage: number;
  }>;
  workflow?: {
    runtimeId?: string;
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
    state: string;
  };
  projectId: string;
}): Prisma.BusinessCreateInput => {
  const data: Prisma.BusinessCreateInput = {
    id,
    correlationId,
    companyName,
    registrationNumber,
    legalForm,
    countryOfIncorporation,
    dateOfIncorporation,
    address,
    phoneNumber,
    email,
    website,
    industry,
    taxIdentificationNumber,
    vatNumber,
    numberOfEmployees,
    businessPurpose,
    shareholderStructure: JSON.stringify(shareholderStructure),
    project: { connect: { id: projectId } },
    approvalState: 'PROCESSING',
  };

  if (workflow) {
    const { runtimeId, workflowDefinitionId, workflowDefinitionVersion, context, state } = workflow;
    data.workflowRuntimeData = {
      create: {
        id: runtimeId,
        workflowDefinitionVersion,
        context,
        workflowDefinitionId,
        createdAt: faker.date.recent({ days: 2 }),
        projectId: projectId,
        state: state,
        tags: [StateTag.MANUAL_REVIEW],
      },
    };
  }

  return data;
};

export const generateEndUser = ({
  id = faker.string.uuid(),
  correlationId = faker.string.uuid(),
  firstName = faker.person.firstName(),
  lastName = faker.person.lastName(),
  email = faker.internet.email(firstName, lastName),
  phone = faker.phone.number('+##########'),
  dateOfBirth = faker.date.past({ years: 60 }),
  avatarUrl = faker.image.avatar(),
  workflow,
  projectId,
  connectBusinesses,
}: {
  id?: string;
  correlationId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  workflow?: {
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
    parentRuntimeId?: string;
    state: string;
  };
  projectId: string;
  connectBusinesses?: boolean;
}): Prisma.EndUserCreateInput => {
  let res: Prisma.EndUserCreateInput = {
    id,
    correlationId,
    firstName,
    lastName,
    approvalState: 'PROCESSING',
    email,
    phone,
    dateOfBirth,
    avatarUrl,
    activeMonitorings: Array.from({ length: faker.number.int({ min: 0, max: 3 }) }, () => ({
      type: 'aml',
      vendor: 'veriff',
      monitoredUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 3)).toISOString(),
      sessionId: faker.string.uuid(),
    })),
    amlHits: Array.from(
      { length: faker.number.int({ min: 0, max: 3 }) },
      () =>
        ({
          vendor: 'veriff',
          matchedName: faker.person.fullName(),
          countries: [faker.location.country()],
          warnings: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceName: faker.company.name(),
              sourceUrl: faker.internet.url(),
            },
          ],
          sanctions: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceUrl: faker.internet.url(),
              sourceName: faker.company.name(),
            },
          ],
          fitnessProbity: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceName: faker.company.name(),
              sourceUrl: faker.internet.url(),
            },
          ],
          pep: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceUrl: faker.internet.url(),
              sourceName: faker.company.name(),
            },
          ],
          adverseMedia: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceName: faker.company.name(),
              sourceUrl: faker.internet.url(),
            },
          ],
          other: [
            {
              date: faker.date.recent({ days: 2 }).toISOString(),
              sourceName: faker.company.name(),
              sourceUrl: faker.internet.url(),
            },
          ],
          matchTypes: ['PEP'],
        } satisfies z.infer<typeof EndUserAmlHitsSchema>[number]),
    ),
    project: { connect: { id: projectId } },
    ...(connectBusinesses && {
      businesses: {
        connect: businessIds.map(id => ({ id })),
      },
    }),
  };

  res.project = { connect: { id: projectId } };

  if (!workflow) {
    return res;
  }

  const { workflowDefinitionId, workflowDefinitionVersion, context, state } = workflow;

  if (!workflowDefinitionId) {
    return res;
  }

  return {
    ...res,
    workflowRuntimeData: {
      create: {
        state,
        context,
        projectId,
        workflowDefinitionId,
        workflowDefinitionVersion,
        createdAt: faker.date.recent({ days: 2 }),
        parentRuntimeDataId: workflow.parentRuntimeId,
        tags: [StateTag.MANUAL_REVIEW],
      },
    },
  };
};
