import {
  AlertSeverity,
  AlertState,
  AlertStatus,
  AlertType,
  Customer,
  Prisma,
  PrismaClient,
  Project,
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
    ids,
  }: {
    project: Project;
    customer: Customer;
    ids: Array<
      | {
          businessId: string;
        }
      | {
          counterpartyOriginatorId: string;
        }
      | {
          businessId: string;
          counterpartyOriginatorId: string;
        }
    >;
  },
) => {
  const generateFakeAlert = ({
    defaultSeverity,
    ids,
  }: {
    defaultSeverity: AlertSeverity;
    ids: Array<
      | {
          businessId: string;
        }
      | {
          counterpartyOriginatorId: string;
        }
      | {
          businessId: string;
          counterpartyOriginatorId: string;
        }
    >;
  }) => {
    const businessIdCounterpartyOriginatorIdOrBoth = faker.helpers.arrayElement(
      ids.map(id => ({
        // @ts-expect-error
        businessId: id.businessId,
        // @ts-expect-error
        counterpartyId: id.counterpartyOriginatorId,
      })),
    );

    return {
      dataTimestamp: faker.date.past(),
      state: faker.helpers.arrayElement(Object.values(AlertState)),
      status: faker.helpers.arrayElement(Object.values(AlertStatus)),
      tags: [faker.random.word(), faker.random.word(), faker.random.word()],
      executionDetails: JSON.parse(faker.datatype.json()),
      severity: defaultSeverity,
      ...businessIdCounterpartyOriginatorIdOrBoth,
      // TODO: Assign assigneeId value to a valid user id
      // TODO: Assign counterpart value to a valid user id
      // businessId: faker.datatype.uuid(),
      // endUserId: faker.datatype.uuid(),
      // assigneeId: faker.datatype.uuid(),
      // workflowRuntimeDataId: faker.datatype.uuid()
    } satisfies Omit<Prisma.AlertCreateManyAlertDefinitionInput, 'projectId'>;
  };

  return Array.from({
    length: faker.datatype.number({
      min: 5,
      max: 10,
    }),
  }).forEach(async () => {
    const defaultSeverity = faker.helpers.arrayElement(Object.values(AlertSeverity));

    // Create alerts
    const alerts = Array.from(
      {
        length: faker.datatype.number({
          min: 5,
          max: 10,
        }),
      },
      () => {
        return {
          projectId: project.id,
          ...generateFakeAlert({
            defaultSeverity,
            ids,
          }),
        };
      },
    );

    const createdBy = faker.internet.userName();
    // Create Alert Definition
    return await prisma.alertDefinition.create({
      include: {
        alert: true, // Include all posts in the returned object
      },
      data: {
        type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
        name: faker.lorem.words(3),
        enabled: faker.datatype.boolean(),
        description: faker.lorem.sentence(),
        projectId: project.id,
        rulesetId: faker.datatype.number({
          min: 1,
          max: 10,
        }),
        defaultSeverity,
        ruleId: faker.datatype.number({
          min: 1,
          max: 10,
        }),
        createdBy: createdBy,
        modifiedBy: createdBy,
        dedupeStrategies: { strategy: {} },
        config: { config: {} },
        inlineRule: { rule: {} },
        tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
        additionalInfo: {},
        alert: {
          createMany: {
            data: alerts,
            skipDuplicates: true,
          },
        },
      },
    });
  });
};
