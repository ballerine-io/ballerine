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

export const getRuleDefinitions = () => {
  const _PAY_HCA_CC = {
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
  } as const satisfies InlineRule;

  // Rule ID: PAY_HCA_APM
  // Description: High Cumulative Amount - inbound - Customer (APM)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of APM.
  const _PAY_HCA_APM = {
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
  } as const satisfies InlineRule;

  // Rule ID: STRUC_CC
  // Description: Structuring - inbound - Customer (Credit Card)
  // Condition: Significant number of low value incoming transactions just below a threshold of credit card.
  const _STRUC_CC = {
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
  } as const satisfies InlineRule;

  // Rule ID: STRUC_APM
  // Description: Structuring - inbound - Customer (APM)
  // Condition: Significant number of low value incoming transactions just below a threshold of APM.
  const _STRUC_APM = {
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
  } as const satisfies InlineRule;

  const rules = [_PAY_HCA_CC, _PAY_HCA_APM, _STRUC_CC, _STRUC_APM];

  const mergedRules: Record<string, InlineRule> = {};

  rules.forEach(rule => {
    mergedRules[rule.id] = rule;
  });

  return mergedRules;
};

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

  const rules = Object.values(getRuleDefinitions());

  await Promise.all(
    rules.map(async rule => {
      const defaultSeverity = faker.helpers.arrayElement(Object.values(AlertSeverity));

      // Create alerts
      const alerts = Array.from(
        {
          length: faker.datatype.number({ min: 3, max: 5 }),
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

      await prisma.alertDefinition.create({
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
          alert: {
            createMany: {
              data: alerts,
              skipDuplicates: true,
            },
          },
        },
      });
    }),
  );
};
