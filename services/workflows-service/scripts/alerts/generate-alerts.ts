import {
  InlineRule,
  TCustomersTransactionTypeOptions,
  TransactionsAgainstDynamicRulesType,
} from '../../src/data-analytics/types';
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
  TransactionRecordType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AggregateType } from '../../src/data-analytics/consts';
import { InputJsonValue, PrismaTransaction } from '@/types';

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
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
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
  },

  // Rule ID: PAY_HCA_APM
  // Description: High Cumulative Amount - inbound - Customer (APM)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of APM.
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
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
  },

  // Rule ID: STRUC_CC
  // Description: Structuring - inbound - Customer (Credit Card)
  // Condition: Significant number of low value incoming transactions just below a threshold of credit card.
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
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
  },

  // Rule ID: STRUC_APM
  // Description: Structuring - inbound - Customer (APM)
  // Condition: Significant number of low value incoming transactions just below a threshold of APM.
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
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
  },

  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'HCAI_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        groupByBusiness: true,
        groupByCounterparty: true,

        havingAggregate: AggregateType.SUM,

        direction: 'inbound',
        excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 3000,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'HACI_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        groupByBusiness: true,
        groupByCounterparty: true,
        havingAggregate: AggregateType.SUM,

        direction: 'inbound',
        excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 3000,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        groupByBusiness: true,
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 2,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        groupByBusiness: true,
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        excludedCounterpartyIds: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 2,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'CHVC_C',
      fnName: 'evaluateCustomersTransactionType',
      subjects: ['businessId'],
      options: {
        transactionType: [TransactionRecordType.chargeback],
        threshold: 14,
        timeAmount: 7,
        timeUnit: 'days',
        isPerBrand: false,
        havingAggregate: AggregateType.COUNT,
      } as TCustomersTransactionTypeOptions,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'SHCAC_C',
      fnName: 'evaluateCustomersTransactionType',
      subjects: ['businessId'],
      options: {
        transactionType: [TransactionRecordType.chargeback],
        threshold: 5_000,
        timeAmount: 7,
        timeUnit: 'days',
        isPerBrand: false,
        havingAggregate: AggregateType.SUM,
      } as TCustomersTransactionTypeOptions,
    },
  },

  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'CHCR_C',
      fnName: 'evaluateCustomersTransactionType',
      subjects: ['businessId'],
      options: {
        transactionType: [TransactionRecordType.refund],
        paymentMethods: [PaymentMethod.credit_card],
        threshold: 14,
        timeAmount: 7,
        timeUnit: 'days',
        isPerBrand: false,
        havingAggregate: AggregateType.COUNT,
      } as TCustomersTransactionTypeOptions,
    },
  },
  {
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'SHCAR_C',
      fnName: 'evaluateCustomersTransactionType',
      subjects: ['businessId'],
      options: {
        transactionType: [TransactionRecordType.refund],
        paymentMethods: [PaymentMethod.credit_card],
        threshold: 5_000,
        timeAmount: 7,
        timeUnit: 'days',
        isPerBrand: false,
        havingAggregate: AggregateType.SUM,
      } as TCustomersTransactionTypeOptions,
    } as const satisfies InlineRule,
  },
] as const satisfies readonly { inlineRule: InlineRule; defaultSeverity: AlertSeverity }[];

export const generateAlertDefinitions = async (
  prisma: PrismaClient | PrismaTransaction,
  {
    createdBy = 'SYSTEM',
    project,
  }: {
    createdBy?: string;
    project: Project;
  },
) =>
  Promise.all(
    ALERT_INLINE_RULES.map(({ inlineRule, defaultSeverity }) =>
      prisma.alertDefinition.create({
        include: {
          alert: true,
        },
        data: {
          type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
          name: faker.lorem.words(3),
          enabled: faker.datatype.boolean(),
          description: faker.lorem.sentence(),
          rulesetId: `set-${inlineRule.id}`,
          defaultSeverity,
          ruleId: inlineRule.id,
          createdBy: createdBy,
          modifiedBy: createdBy,
          dedupeStrategies: {
            strategy: {},
            cooldownTimeframeInMinutes: faker.datatype.number({ min: 60, max: 3600 }),
          },
          config: { config: {} },
          inlineRule,
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
