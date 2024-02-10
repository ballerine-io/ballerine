import {
  PrismaClient,
  AlertType,
  AlertState,
  AlertStatus,
  Project,
  Customer,
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
  }: {
    project: Project;
    customer: Customer;
  },
) => {
  const generateFakeAlert = () => {
    return {
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

  return Array.from({
    length: faker.datatype.number({
      min: 5,
      max: 10,
    }),
  }).forEach(async () => {
    return await prisma.alertDefinition.create({
      include: {
        alert: true, // Include all posts in the returned object
      },
      data: {
        type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
        name: faker.lorem.words(3),
        enabled: faker.datatype.boolean(),
        description: faker.lorem.sentence(),
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
        alert: {
          createMany: {
            data: Array.from(
              {
                length: faker.datatype.number({
                  min: 5,
                  max: 10,
                }),
              },
              () => generateFakeAlert(),
            ),
            skipDuplicates: true,
          },
        },
        projectId: project.id,
      },
    });
  });
};
