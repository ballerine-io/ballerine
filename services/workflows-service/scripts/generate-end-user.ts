import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

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
  workflow,
}: {
  id: string;
  workflow: {
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
  };
}): Prisma.BusinessCreateInput => {
  const { workflowDefinitionId, workflowDefinitionVersion, context } = workflow;
  const companyName = faker.company.name();
  const registrationNumber = faker.datatype.uuid();
  const legalForm = faker.company.companySuffix();
  const countryOfIncorporation = faker.address.country();
  const dateOfIncorporation = faker.date.past(10);
  const address = faker.address.streetAddress();
  const phoneNumber = faker.phone.number('+##########');
  const email = faker.internet.email();
  const website = faker.internet.url();
  const industry = faker.company.bs();
  const taxIdentificationNumber = faker.finance.account(10);
  const vatNumber = `VAT${faker.finance.account(8)}`;
  const numberOfEmployees = faker.datatype.number({ min: 1, max: 1000 });
  const businessPurpose = faker.company.catchPhrase();
  const documents = JSON.stringify({
    registrationDocument: faker.system.filePath(),
    financialStatement: faker.system.filePath(),
  });
  const shareholderStructure = JSON.stringify([
    { name: faker.name.fullName(), ownershipPercentage: faker.finance.amount(0, 100, 2) },
  ]);

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
    documents,
    shareholderStructure,
    approvalState: 'PROCESSING',
    workflowRuntimeData: {
      create: {
        workflowDefinitionVersion,
        context,
        workflowDefinitionId,
        createdAt: faker.date.recent(2),
      },
    },
  };
};

export const generateEndUser = ({
  id,
  workflow,
}: {
  id: string;
  workflow: {
    workflowDefinitionId: string;
    workflowDefinitionVersion: number;
    context: Prisma.InputJsonValue;
  };
}): Prisma.EndUserCreateInput => {
  const { workflowDefinitionId, workflowDefinitionVersion, context } = workflow;
  const correlationId = faker.datatype.uuid();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();
  let res: Prisma.EndUserCreateInput = {
    id,
    correlationId,
    firstName,
    lastName,
    approvalState: 'PROCESSING',
    email: faker.internet.email(firstName, lastName),
    phone: faker.phone.number('+##########'),
    dateOfBirth: faker.date.past(60),
    avatarUrl: faker.image.avatar(),
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
        },
      },
    };
  }
  return res;
};
