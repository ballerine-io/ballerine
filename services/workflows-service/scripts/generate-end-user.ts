import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { StateTag } from '@ballerine/common';

export const assignedTo = faker.image.avatar();
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
  'ckkt3t2bw000aqxtt0hj4pw4a',
  'ckkt3t2bw000aqxtt0hj4pw4b',
  'ckkt3t2bw000aqxtt0hj4pw4c',
  'ckkt3t2bw000aqxtt0hj4pw4d',
  'ckkt3t2bw000aqxtt0hj4pw4e',
  'ckkt3t2bw000aqxtt0hj4pw4f',
  'ckkt3t2bw000aqxtt0hj4pw4g',
  'ckkt3t2bw000aqxtt0hj4pw4h',
  'ckkt3t2bw000aqxtt0hj4pw4i',
  'ckkt3t2bw000aqxtt0hj4pw41',
  'ckkt3t2bw000aqxtt0hj4pw42',
  'ckkt3t2bw000aqxtt0hj4pw43',
  'ckkt3t2bw000aqxtt0hj4pw44',
  'ckkt3t2bw000aqxtt0hj4pw45',
  'ckkt3t2bw000aqxtt0hj4pw46',
  'ckkt3t2bw000aqxtt0hj4pw47',
  'ckkt3t2bw000aqxtt0hj4pw48',
  'ckkt3t2bw000aqxtt0hj4pw49',
  'ckkt3t2bw000aqxtt0hj4pw40',
  'ckkt3t2bw000aqxtt0hj4pw4j',
  'ckkt3t2bw000aqxtt0hj4pw4k',
  'ckkt3t2bw000aqxtt0hj4pw4l',
  'ckkt3t2bw000aqxtt0hj4pw4m',
  'ckkt3t2bw000aqxtt0hj4pw4n',
  'ckkt3t2bw000aqxtt0hj4pw4o',
  'ckkt3t2bw000aqxtt0hj4pw4p',
  'ckkt3t2bw000aqxtt0hj4pw4q',
  'ckkt3t2bw000aqxtt0hj4pw4r',
  'ckkt3t2bw000aqxtt0hj4pw4s',
  'ckkt3t2bw000aqxtt0hj4pw4t',
  'ckkt3t2bw000aqxtt0hj4pw4u',
  'ckkt3t2bw000aqxtt0hj4pw4v',
  'ckkt3t2bw000aqxtt0hj4pw4w',
  'ckkt3t2bw000aqxtt0hj4pw4x',
  'ckkt3t2bw000aqxtt0hj4pw4y',
  'ckkt3t2bw000aqxtt0hj4pw4z',
  'ckkt3t2bw000aqxtt0hj4pw4a1',
  'ckkt3t2bw000aqxtt0hj4pw4a2',
  'ckkt3t2bw000aqxtt0hj4pw4a3',
  'ckkt3t2bw000aqxtt0hj4pw4a4',
  'ckkt3t2bw000aqxtt0hj4pw4a5',
  'ckkt3t2bw000aqxtt0hj4pw4a6d',
  'a',
  'aa',
  'aaa',
  'aaaa',
  'aaaaa',
  'aaaaaa',
  'a1',
  'a2',
  'a3',
  'a4',
  'a5',
  'a6',
  '84ee4d57-33a5-4f6e-b21a-462d9e73c1cf',
  '0e7ea66c-6822-4a9f-b19a-12fc7503a65e',
  '505f6c6a-f9ca-4b45-8e95-18f5f0704b3f',
  '0b8e7f1d-6c31-4cd7-9f59-05e0665f5057',
  '264c8d3a-106e-452a-983b-22c06c6564ae',
  '5e460e75-95df-4c8a-8a71-90f134b6ad6f',
  '3db8e017-04f9-4377-9ee7-92c8ab26d53c',
  '1a01e1e2-5e4f-4a79-a415-20a0c7f76923',
  'c7626a35-8c5e-4c52-8d23-c9f7deed47a2',
  '7e7d292d',
  '5bfb32f0',
  'b74b5217',
  'd12681d2',
  '739f004e',
  '6d3a4c03',
  '64793307',
  '8f3d5e09',
  '6ab7d216',
  '1299fdd0',
  '69a85e14',
  '879b',
  'f8cb95b4',
  'edd1abcc',
  'd38350d1',
  '7f7cb3a2',
  'f51f65c8',
  'adbb2d51',
  'fe2354b6',
  'b05f2f97',
  'c0f45e5f',
  '69c09bc7',
  '0e5b2e41',
  'cf5519eb',
  'd07cb836',
  'd24a85c0',
  '2e22e87e',
  'ea5d47fc',
  'f2e94de1',
  '11a67b53',
  '0f006e09',
  '953e42d5',
  'f2cc2d77',
  '37388fb2',
  '8d1aa70e',
  '58f4c983',
  '5117da1d',
  '3f37240b',
  '9e7fc019',
  '18d7ca11',
  'f8377d21',
  'f5a89e2c',
  '53a1e8db',
  '7bdf5a53',
  'cffcdfed',
  '201f961f',
  '48eb18d9',
  '96786903',
  '3c184f5e',
  '7d057e65',
  'bfd85c5b',
  '3993e0f7',
  '028b92dd',
  '9d8e2c5b',
  '8a7f050a',
  '48f1b10c',
  'd32dd768',
  '7c3f13de',
  'ac82fc97',
  '2f897d6f',
  'b71b05c7',
  '3a6ad85d',
  'db6d5b87',
  'cfaaeb24',
  '059b02a4',
  'b2f0c68f',
  '8cc7770e',
  '6f75b19b',
  '3adad468',
  '4227a065',
  'f0e8a558',
  '6dfdc68e',
  'beabf340',
  '5d1c255a',
  '4e56d14d',
  'db82d99c',
  'f7a0d920',
  '22c81d74',
  'bf96d2ab',
  '5db268b0',
  '485eb88b',
  'd29b1eae',
  'f237be10',
  '72a2e478',
  '97b7005d',
  '3486d76f',
  'fcc4e32b',
  '93d4dc16',
  '0ca688c8',
  '1986d2cc',
  '0f98d168',
  '7ebab5eb',
  'aa90dd4d',
  'dc1fd8af',
  'f2cadd4f',
  '60f8e53b',
  'b978d56a',
  '2db8d076',
  'ca4ed5ad',
  'bea7ea53',
  '980ad8c0',
  'c8f1d1aa',
  '8333eef6',
  '890be59b',
  'f947b990',
  'ebc5f6b9',
  'b171faa1',
  '297af57a',
  '3f3eedc2',
  '2bfdd7e9',
  '6af7ca20',
  'f1b5fcd2',
  '9979e12b',
  'f457c9b1',
  '7a6eda1b',
  'cccce1bd',
  'cdf2da29',
  '8e0ecf32',
  'b06da7d1',
  'fefad08b',
  '89b2fd44',
  '01ca7f18',
  'cf3ae7de',
  'd26cf7d0',
  '51f8f3d2',
  '0f76e20a',
  'b4e1ef20',
  '03e4f06e',
  '1b4ee7ca',
  '7d9efcb1',
  '485cf38c',
  'b1dfc0ad',
  '7f8adf02',
  'd6bfbeac',
  '34c2ee1d',
  '8822ee23',
  '2019e82e',
  'db46e2f9',
  '983fea56',
  '3b8dfbdc',
  'b438e7e7',
  'd4a2e2ab',
  '868cfafd',
  '68d8e6d2',
  'f61ee87c',
  '08c0e678',
  '7c4bfea2',
  '5d6dfc45',
  '27f4ebbc',
  'f15eeb21',
  'dc4bda14',
  '0cc0ea51',
  'ee12e75c',
  '5db4ef81',
  '3eb8e95b',
  'c4f1eaac',
  '3e39e4df',
  'd1aaeb48',
  '1bf1ea11',
  '6a79eaaf',
  '8976e89d',
  'ed6fe77b',
  '7b7be51a',
  'f95def68',
  '7f12e3a3',
  '4407e422',
  'b7b0e348',
  '7e92e8bc',
  'b40de3b2',
  '7f8be34a',
  'cc45ea82',
  '9627e3b6',
  'ed8aec72',
  'f71eecad',
  'ee44e41a',
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
          workflowDefinitionVersion,
          context,
          workflowDefinitionId,
          createdAt: faker.date.recent(2),
          projectId: projectId,
          parentRuntimeDataId: workflow.parentRuntimeId,
          state: state,
          tags: [StateTag.MANUAL_REVIEW],
        },
      },
    };
  }

  res.project = { connect: { id: projectId } };
  return res;
};
