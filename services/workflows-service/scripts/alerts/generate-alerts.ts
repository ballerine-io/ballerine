import { InlineRule, TransactionsAgainstDynamicRulesType } from '../../src/data-analytics/types';
import {
  AlertSeverity,
  AlertState,
  AlertStatus,
  AlertType,
  Customer,
  PaymentMethod,
  Prisma,
  PrismaClient,
  Project,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AggregateType } from '../../src/data-analytics/consts';
import { InputJsonValue } from '@/types';

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

export const ALERT_INLINE_RULES = [
  {
    id: 'PAY_HCA_CC',
    fnName: 'evaluateTransactionsAgainstDynamicRules',
    subjects: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.SUM,

      direction: 'inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.credit_card],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountThreshold: 1000,
    } as TransactionsAgainstDynamicRulesType,
  },

  // Rule ID: PAY_HCA_APM
  // Description: High Cumulative Amount - inbound - Customer (APM)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of APM.
  {
    id: 'PAY_HCA_APM',
    fnName: 'evaluateTransactionsAgainstDynamicRules',
    subjects: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.SUM,

      direction: 'inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.credit_card],
      excludePaymentMethods: true,

      timeAmount: 7,
      timeUnit: 'days',

      amountThreshold: 1000,
    } as TransactionsAgainstDynamicRulesType,
  },

  // Rule ID: STRUC_CC
  // Description: Structuring - inbound - Customer (Credit Card)
  // Condition: Significant number of low value incoming transactions just below a threshold of credit card.
  {
    id: 'STRUC_CC',
    fnName: 'evaluateTransactionsAgainstDynamicRules',
    subjects: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.COUNT,

      direction: 'inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.credit_card],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountThreshold: 5,
      amountBetween: { min: 500, max: 1000 },
    } as TransactionsAgainstDynamicRulesType,
  },

  // Rule ID: STRUC_APM
  // Description: Structuring - inbound - Customer (APM)
  // Condition: Significant number of low value incoming transactions just below a threshold of APM.
  {
    id: 'STRUC_APM',
    fnName: 'evaluateTransactionsAgainstDynamicRules',
    subjects: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.COUNT,

      direction: 'inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.credit_card],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountBetween: { min: 500, max: 1000 },

      amountThreshold: 5,
    } as TransactionsAgainstDynamicRulesType,
  },
] as const satisfies readonly InlineRule[];

export const generateAlertDefinitions = async (
  prisma: PrismaClient,
  {
    createdBy = 'SYSTEM',
    project,
    defaultSeverity,
  }: {
    createdBy?: string;
    project: Project;
    defaultSeverity: AlertSeverity;
  },
) =>
  Promise.all(
    ALERT_INLINE_RULES.map(rule =>
      prisma.alertDefinition.create({
        include: {
          alert: true,
        },
        data: {
          type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
          name: faker.lorem.words(3),
          enabled: faker.datatype.boolean(),
          description: faker.lorem.sentence(),
          rulesetId: `set-${rule.id}`,
          defaultSeverity,
          ruleId: rule.id,
          createdBy: createdBy,
          modifiedBy: createdBy,
          dedupeStrategies: {
            strategy: {},
            cooldownTimeframeInMinutes: faker.datatype.number({ min: 60, max: 3600 }),
          },
          config: { config: {} },
          inlineRule: rule,
          tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
          additionalInfo: {},
          projectId: project.id,
        },
      }),
    ),
  );

const generateFakeAlert = ({
  severity,
  ids,
}: {
  severity: AlertSeverity;
  ids: string[];
}): Omit<Prisma.AlertCreateManyAlertDefinitionInput, 'projectId'> => {
  const businessIdCounterpartyOriginatorIdOrBoth = faker.helpers.arrayElement(
    ids.map(id => ({ counterpartyId: id })),
  );

  return {
    dataTimestamp: faker.date.past(),
    state: faker.helpers.arrayElement(Object.values(AlertState)),
    status: faker.helpers.arrayElement(Object.values(AlertStatus)),
    tags: [faker.random.word(), faker.random.word(), faker.random.word()],
    executionDetails: JSON.parse(faker.datatype.json()) as InputJsonValue,
    severity,
    ...businessIdCounterpartyOriginatorIdOrBoth,
    // TODO: Assign assigneeId value to a valid user id
    // TODO: Assign counterpart value to a valid user id
    // businessId: faker.datatype.uuid(),
    // endUserId: faker.datatype.uuid(),
    // assigneeId: faker.datatype.uuid(),
    // workflowRuntimeDataId: faker.datatype.uuid()
  };
};

export const generateFakeAlertsAndDefinitions = async (
  prisma: PrismaClient,
  {
    project,
    ids,
  }: {
    project: Project;
    customer: Customer;
    ids: string[];
  },
) => {
  const alertDefinitions = await generateAlertDefinitions(prisma, {
    project,
    createdBy: faker.internet.userName(),
    defaultSeverity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
  });

  await Promise.all(
    alertDefinitions.map(alertDefinition =>
      prisma.alert.createMany({
        data: Array.from(
          {
            length: faker.datatype.number({ min: 3, max: 5 }),
          },
          () => ({
            alertDefinitionId: alertDefinition.id,
            projectId: project.id,
            ...generateFakeAlert({
              ids,
              severity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
            }),
          }),
        ),
        skipDuplicates: true,
      }),
    ),
  );
};
