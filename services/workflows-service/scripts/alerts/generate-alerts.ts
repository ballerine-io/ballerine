import {
  PrismaClient,
  TransactionRecordType,
  TransactionRecordStatus,
  Prisma,
  VerificationStatus,
  AlertDefinition,
  AlertType,
  AlertState,
  AlertStatus,
  Project,
  Customer,
  Alert,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

const tags = [
  ...new Set([
    faker.random.word(),
    faker.random.word(),
    faker.random.word(),
    faker.random.word(),
    faker.random.word(),
    faker.random.word(),
  ]),
];

export const generateFakeAlertDefinition = async (
  prisma: PrismaClient,
  {
    project,
    customer,
  }: {
    project: Project;
    customer: Customer;
  },
) => {
  // const customerId = `${faker.datatype.number({min: 10000})}`

  // const customer = {
  //     id: customerId,
  //     displayName: faker.company.name(),
  //     name: faker.company.name(),
  //     authenticationConfiguration: {
  //       apiType: 'API_KEY',
  //       authValue: '11111', // Assuming apiKey is a string of 20 alphanumeric characters
  //       validUntil: '', // You can generate a random date for validUntil if needed
  //       isValid: '', // You can generate a random boolean for isValid if needed
  //     },
  //     logoImageUri: faker.image.imageUrl(),
  //   };

  //   const projectId = `${faker.datatype.number({min: 10000})}`

  //   prisma.project.upsert({
  //     where: {
  //       id: `project-${projectId}`,
  //     },
  //     update: {},
  //     create: {
  //       id: `project-${projectId}`,
  //       name: `Project ${projectId}`,
  //       customerId: customer.id,
  //     },
  //   });

  // const project = await createProject(prisma, customer, '1');

  const generateFakeAlert = (alertDefinitionId: string) => {
    return {
      alertDefinitionId,
      dataTimestamp: faker.date.past(),
      state: faker.helpers.arrayElement(Object.values(AlertState)),
      status: faker.helpers.arrayElement(Object.values(AlertStatus)),
      tags: [faker.random.word(), faker.random.word(), faker.random.word()],
      executionDetails: JSON.parse(faker.datatype.json()),
      projectId: project.id,
      // businessId: faker.datatype.uuid(),
      // endUserId: faker.datatype.uuid(),
      // assigneeId: faker.datatype.uuid(),
      // workflowRuntimeDataId: faker.datatype.uuid()
    };
  };

  const alertDefinitionId = faker.datatype.uuid();

  const createdRows = await prisma.alertDefinition.create({
    data: {
      id: faker.datatype.uuid(),
      type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
      name: faker.lorem.words(3),
      enabled: faker.datatype.boolean(),
      description: faker.lorem.sentence(),
      projectId: faker.datatype.uuid(),
      rulesetId: faker.datatype.number({
        min: 1,
        max: 10,
      }),
      ruleId: faker.datatype.number({
        min: 1,
        max: 10,
      }),
      createdBy: faker.internet.userName(),
      modifiedBy: faker.internet.userName(),
      dedupeStrategies: { strategy: {} },
      config: { config: {} },
      tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
      additionalInfo: {},
      project: {
        connect: {
          id: project.id,
        },
      },
      customer: {
        connect: {
          id: customer.id,
        },
      },
      alert: {
        createMany: {
          data: Array.from({ length: 10 }, () => generateFakeAlert(alertDefinitionId)),
          skipDuplicates: true,
        },
      },
      // project: {
      //     connectOrCreate: {
      //         where: {
      //             id: project.id,
      //             name_customerId: {
      //                 name: project.name,
      //                 customerId: project.customerId,
      //             },
      //         },
      //         create: {
      //             id: project.id,
      //             name: project.name,
      //             customerId: project.customerId,
      //             customer: {
      //                 connectOrCreate: {
      //                     where: {
      //                         id: customer.id,
      //                     },
      //                     create: customer
      //                 }
      //             }
      //         }
      //     }
      // },
    },
  });
};
