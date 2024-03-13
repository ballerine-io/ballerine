import { Input } from '@ballerine/ui';
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
    label: 'HSUMICC',
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'PAY_HCA_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyid'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: 'inbound',

        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 1000,

        groupBy: ['counterpartyBeneficiaryId'],
      } as TransactionsAgainstDynamicRulesType,
    },
  },

  // Rule ID: PAY_HCA_APM
  // Description: High Cumulative Amount - inbound - Customer (APM)
  // Condition: Sum of incoming transactions over a set period of time is greater than a limit of APM.
  {
    label: 'HSUMIAPM',
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'PAY_HCA_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyid'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: 'inbound',

        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 1000,

        groupBy: ['counterpartyBeneficiaryId'],
      } as TransactionsAgainstDynamicRulesType,
    },
  },

  // Rule ID: STRUC_CC
  // Description: Structuring - inbound - Customer (Credit Card)
  // Condition: Significant number of low value incoming transactions just below a threshold of credit card.
  {
    label: 'STRINCC',
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'STRUC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId'],
      options: {
        groupByBusiness: true,
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

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
    label: 'STRINAPM',
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'STRUC_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId'],
      options: {
        groupByBusiness: true,
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

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
    label: 'HCAI_CC',
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
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 3000,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    label: 'HACI_APM',
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
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 3000,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    label: 'HVIC_CC',
    defaultSeverity: AlertSeverity.medium,
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        groupByBusiness: true,
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: 'days',

        amountThreshold: 2,
      } as TransactionsAgainstDynamicRulesType,
    },
  },
  {
    label: 'CHVC_C',
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
    label: 'SHCAC_C',
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
    label: 'CHCR_C',
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
    label: 'SHCAR_C',
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
] as const satisfies ReadonlyArray<{
  inlineRule: InlineRule;
  label: string;
  defaultSeverity: AlertSeverity;
}>;

const generateAlertData = (
  { inlineRule, defaultSeverity, label }: (typeof ALERT_INLINE_RULES)[number],
  createdBy: string,
  project: Project,
) => ({
  label: label,
  type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
  name: faker.lorem.words(3),
  enabled: faker.datatype.boolean(),
  description: faker.lorem.sentence(),
  rulesetId: `set-${inlineRule.id}`,
  defaultSeverity,
  ruleId: inlineRule.id,
  createdBy: createdBy,
  modifiedBy: createdBy,
  dedupeStrategy: {
    mute: false,
    cooldownTimeframeInMinutes: faker.datatype.number({ min: 60, max: 3600 }),
  },
  config: { config: {} },
  inlineRule,
  tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
  additionalInfo: {},
  projectId: project.id,
});
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
  await Promise.all(
    // TODO: remove slice once all rules are ready
    ALERT_INLINE_RULES.slice(0, 2).map(inlineRule =>
      prisma.alertDefinition.upsert({
        where: { label_projectId: { label: inlineRule.label, projectId: project.id } },
        create: generateAlertData(inlineRule, createdBy, project),
        update: generateAlertData(inlineRule, createdBy, project),
        include: {
          alert: true,
        },
      }),
    ),
  );

const generateFakeAlert = ({
  severity,
  counterparyIds,
  agentUserIds,
}: {
  severity: AlertSeverity;
  counterparyIds: string[];
  agentUserIds: string[];
}): Omit<Prisma.AlertCreateManyAlertDefinitionInput, 'projectId'> => {
  const counterypartyId = faker.helpers.arrayElement(
    counterparyIds.map(id => ({ counterpartyId: id })),
  );
  // In chance of 1 to 5, assign an agent to the alert
  const assigneeId =
    faker.datatype.number({ min: 1, max: 5 }) === 1
      ? faker.helpers.arrayElement(agentUserIds)
      : undefined;

  return {
    dataTimestamp: faker.date.past(),
    state: faker.helpers.arrayElement(Object.values(AlertState)),
    status: faker.helpers.arrayElement(Object.values(AlertStatus)),
    tags: [faker.random.word(), faker.random.word(), faker.random.word()],
    executionDetails: {
      checkpoint: {
        hash: faker.datatype.uuid(),
      },
      executionRow: JSON.parse(faker.datatype.json()),
    } as InputJsonValue,
    severity,
    assigneeId,
    ...counterypartyId,
  };
};

export const generateFakeAlertsAndDefinitions = async (
  prisma: PrismaClient,
  {
    project,
    counterparyIds,
    agentUserIds,
  }: {
    project: Project;
    counterparyIds: string[];
    agentUserIds: string[];
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
              counterparyIds,
              agentUserIds,
              severity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
            }),
          }),
        ),
        skipDuplicates: true,
      }),
    ),
  );
};
