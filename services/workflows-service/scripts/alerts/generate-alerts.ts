import {
  InlineRule,
  TransactionsAgainstDynamicRulesType,
} from './../../src/data-analytics/evaluate-types';
import * as rules from './../../src/data-analytics/data-analytics.repository/evaluate-transactions-against-dynamic-rules';
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
const generateRule = (ruleName: string, options: InlineRule, groupedBy: string[] = []) => {
  return {
    rule: {
      name: ruleName,
    },
    options,
    groupedBy,
  };
};

const getRuleDefinitions = () => {
  // Rule ID: PAY_HCA_CC
  // Description: High Cumulative Amount - Inbound - Customer (Credit Card)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of credit card.
  const _PAY_HCA_CC = {
    ruleName: 'PAY_HCA_CC',
    groupedBy: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.SUM,

      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.CreditCard],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountThreshold: 1000,
    } as TransactionsAgainstDynamicRulesType,
  };

  // Rule ID: PAY_HCA_APM
  // Description: High Cumulative Amount - Inbound - Customer (APM)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of APM.
  const _PAY_HCA_APM = {
    ruleName: 'PAY_HCA_APM',
    groupedBy: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.SUM,

      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.CreditCard],
      excludePaymentMethods: true,

      timeAmount: 7,
      timeUnit: 'days',

      amountThreshold: 1000,
    } as TransactionsAgainstDynamicRulesType,
  };

  // Rule ID: STRUC_CC
  // Description: Structuring - Inbound - Customer (Credit Card)
  // Condition: Significant number of low value incoming transactions just below a threshold of credit card.
  const _STRUC_CC = {
    ruleName: 'STRUC_CC',
    groupedBy: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.COUNT,

      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.CreditCard],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountBetween: { min: 500, max: 1000 },
    } as TransactionsAgainstDynamicRulesType,
  };

  // Rule ID: STRUC_APM
  // Description: Structuring - Inbound - Customer (APM)
  // Condition: Significant number of low value incoming transactions just below a threshold of APM.
  const _STRUC_APM = {
    ruleName: 'STRUC_APM',
    groupedBy: ['businessId'],
    options: {
      groupByBusiness: true,
      havingAggregate: AggregateType.COUNT,

      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

      paymentMethods: [PaymentMethod.CreditCard],
      excludePaymentMethods: false,

      timeAmount: 7,
      timeUnit: 'days',

      amountBetween: { min: 500, max: 1000 },
    } as TransactionsAgainstDynamicRulesType,
  };

  const rules = [_PAY_HCA_CC, _PAY_HCA_APM, _STRUC_CC, _STRUC_APM];

  const mergedRules: Record<string, InlineRule> = {};

  rules.forEach(rule => {
    mergedRules[rule.ruleName] = generateRule(rule.ruleName, rule.options, rule.groupedBy);
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
  const rulesIds = Object.keys(getRuleDefinitions());

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
        length: Object.keys(rules).length,
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
    
    const ruleIdIdx = faker.datatype.number({
      min: 0,
      max: rules.length - 1,
    });

    // Create Alert Definition
    return await prisma.alertDefinition.create({
      include: {
        alert: true,
      },
      data: {
        type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
        name: faker.lorem.words(3),
        enabled: faker.datatype.boolean(),
        description: faker.lorem.sentence(),
        rulesetId: ruleIdIdx.toString(),
        defaultSeverity,
        ruleId: rulesIds[ruleIdIdx],
        createdBy: createdBy,
        modifiedBy: createdBy,
        dedupeStrategies: { strategy: {} },
        config: { config: {} },
        inlineRule: rules[ruleIdIdx],
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
  });
};
