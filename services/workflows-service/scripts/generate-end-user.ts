import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { StateTag } from '@ballerine/common';

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
  id,
  companyName = faker.company.name(),
  registrationNumber = faker.datatype.uuid(),
  legalForm = faker.company.companySuffix(),
  countryOfIncorporation = faker.address.country(),
  dateOfIncorporation = faker.date.past(10),
  address = faker.address.streetAddress(),
  phoneNumber = faker.phone.number('+##########'),
  email = faker.internet.email(),
  website = faker.internet.url(),
  industry = faker.company.bs(),
  taxIdentificationNumber = faker.finance.account(10),
  vatNumber = `VAT${faker.finance.account(8)}`,
  numberOfEmployees = faker.datatype.number({ min: 1, max: 1000 }),
  businessPurpose = faker.company.catchPhrase(),
  shareholderStructure = [
    {
      name: faker.name.fullName(),
      ownershipPercentage: Number(faker.finance.amount(0, 100, 2)),
    },
  ],
  documents = {
    registrationDocument: faker.system.filePath(),
    financialStatement: faker.system.filePath(),
  },
  workflow,
  projectId,
}: {
  id: string;
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
  documents?: {
    registrationDocument: string;
    financialStatement: string;
  };
  workflow: {
    runtimeId?: string;
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
    state: string;
  };
  projectId: string;
}): Prisma.BusinessCreateInput => {
  const { runtimeId, workflowDefinitionId, workflowDefinitionVersion, context, state } = workflow;

  return {
    id,
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
    documents: JSON.stringify(documents),
    shareholderStructure: JSON.stringify(shareholderStructure),
    project: { connect: { id: projectId } },
    approvalState: 'PROCESSING',
    workflowRuntimeData: {
      create: {
        id: runtimeId,
        workflowDefinitionVersion,
        context,
        workflowDefinitionId,
        createdAt: faker.date.recent(2),
        projectId: projectId,
        state: state,
        tags: [StateTag.MANUAL_REVIEW],
      },
    },
  };
};

export const generateEndUser = ({
  id,
  correlationId = faker.datatype.uuid(),
  firstName = faker.name.firstName(),
  lastName = faker.name.lastName(),
  email = faker.internet.email(firstName, lastName),
  phone = faker.phone.number('+##########'),
  dateOfBirth = faker.date.past(60),
  avatarUrl = faker.image.avatar(),
  workflow,
  projectId,
}: {
  id: string;
  correlationId?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  avatarUrl?: string;
  workflow: {
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
    parentRuntimeId?: string;
    state: string;
  };
  projectId: string;
}): Prisma.EndUserCreateInput => {
  const { workflowDefinitionId, workflowDefinitionVersion, context, state } = workflow;
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
    project: { connect: { id: projectId } },
  };

  if (workflowDefinitionId) {
    res = {
      ...res,
      workflowRuntimeData: {
        create: {
          state,
          context,
          projectId,
          workflowDefinitionId,
          workflowDefinitionVersion,
          createdAt: faker.date.recent(2),
          parentRuntimeDataId: workflow.parentRuntimeId,
          tags: [StateTag.MANUAL_REVIEW],
        },
      },
    };
  }

  res.project = { connect: { id: projectId } };

  return res;
};
