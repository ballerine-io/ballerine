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
];

export const generateEndUser = ({
  id,
  workflowDefinitionId,
  workflowDefinitionVersion,
  context,
}: {
  id: string;
  workflowDefinitionId: string;
  workflowDefinitionVersion: number;
  context: Prisma.InputJsonValue;
}): Prisma.EndUserCreateInput => {
  const correlationId = faker.datatype.uuid();
  const firstName = faker.name.firstName();
  const lastName = faker.name.lastName();

  return {
    id,
    correlationId,
    firstName,
    lastName,
    email: faker.internet.email(firstName, lastName),
    phone: faker.phone.number('+##########'),
    dateOfBirth: faker.date.past(60),
    avatarUrl: faker.image.avatar(),
    workflowRuntimeData: {
      create: {
        workflowDefinitionVersion,
        context,
        workflowDefinitionId,
      },
    },
  };
};
