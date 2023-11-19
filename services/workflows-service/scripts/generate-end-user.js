'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.generateEndUser =
  exports.generateBusiness =
  exports.businessIds =
  exports.businessRiskIds =
  exports.endUserIds =
  exports.assignedTo =
    void 0;
const faker_1 = require('@faker-js/faker');
const common_1 = require('@ballerine/common');
exports.assignedTo = faker_1.faker.image.avatar();
exports.endUserIds = [
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
exports.businessRiskIds = [
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
exports.businessIds = [
  'ckkt3rv4z4004qxtte4vz9e97',
  'ckkt3s3ha5005qxttdz5yxg76',
  'ckkt3sc16006qxtt9e9u7y65',
  'ckkt3sjz70007qxtt3nqj80j4',
  'ckkt3st080008qxtt5rxj0wg3',
  'ckkt3swf90009qxttgx0p6x62',
  'ckkt3t2b1000aqxtt0hj4pw41',
];
const generateBusiness = ({
  id,
  companyName = faker_1.faker.company.name(),
  registrationNumber = faker_1.faker.datatype.uuid(),
  legalForm = faker_1.faker.company.companySuffix(),
  countryOfIncorporation = faker_1.faker.address.country(),
  dateOfIncorporation = faker_1.faker.date.past(10),
  address = faker_1.faker.address.streetAddress(),
  phoneNumber = faker_1.faker.phone.number('+##########'),
  email = faker_1.faker.internet.email(),
  website = faker_1.faker.internet.url(),
  industry = faker_1.faker.company.bs(),
  taxIdentificationNumber = faker_1.faker.finance.account(10),
  vatNumber = `VAT${faker_1.faker.finance.account(8)}`,
  numberOfEmployees = faker_1.faker.datatype.number({ min: 1, max: 1000 }),
  businessPurpose = faker_1.faker.company.catchPhrase(),
  shareholderStructure = [
    {
      name: faker_1.faker.name.fullName(),
      ownershipPercentage: Number(faker_1.faker.finance.amount(0, 100, 2)),
    },
  ],
  documents = {
    registrationDocument: faker_1.faker.system.filePath(),
    financialStatement: faker_1.faker.system.filePath(),
  },
  workflow,
  projectId,
}) => {
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
        createdAt: faker_1.faker.date.recent(2),
        projectId: projectId,
        state: state,
        tags: [common_1.StateTag.MANUAL_REVIEW],
      },
    },
  };
};
exports.generateBusiness = generateBusiness;
const generateEndUser = ({
  id,
  correlationId = faker_1.faker.datatype.uuid(),
  firstName = faker_1.faker.name.firstName(),
  lastName = faker_1.faker.name.lastName(),
  email = faker_1.faker.internet.email(firstName, lastName),
  phone = faker_1.faker.phone.number('+##########'),
  dateOfBirth = faker_1.faker.date.past(60),
  avatarUrl = faker_1.faker.image.avatar(),
  workflow,
  projectId,
}) => {
  const { workflowDefinitionId, workflowDefinitionVersion, context, state } = workflow;
  let res = {
    id,
    correlationId,
    firstName,
    lastName,
    approvalState: 'PROCESSING',
    email,
    phone,
    dateOfBirth,
    avatarUrl,
  };
  if (workflowDefinitionId) {
    res = {
      ...res,
      workflowRuntimeData: {
        create: {
          workflowDefinitionVersion,
          context,
          workflowDefinitionId,
          createdAt: faker_1.faker.date.recent(2),
          projectId: projectId,
          parentRuntimeDataId: workflow.parentRuntimeId,
          state: state,
          tags: [common_1.StateTag.MANUAL_REVIEW],
        },
      },
    };
  }
  res.project = { connect: { id: projectId } };
  return res;
};
exports.generateEndUser = generateEndUser;
//# sourceMappingURL=generate-end-user.js.map
