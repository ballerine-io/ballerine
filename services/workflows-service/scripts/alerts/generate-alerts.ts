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
  TransactionDirection,
  TransactionRecordType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AggregateType, TIME_UNITS } from '../../src/data-analytics/consts';
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

export const ALERT_DEFINITIONS = {
  PAY_HCA_CC: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Sum of incoming credit card transactions over a set period of time of time is greater than a limit',
    inlineRule: {
      id: 'PAY_HCA_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: TransactionDirection.inbound,

        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 1000,

        groupBy: ['counterpartyBeneficiaryId'],
      },
    },
  },
  PAY_HCA_APM: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Sum of incoming non credit card transactions over a set period of time is greater than a limit of APM',
    inlineRule: {
      id: 'PAY_HCA_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: TransactionDirection.inbound,

        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 1000,

        groupBy: ['counterpartyBeneficiaryId'],
      },
    },
  },

  STRUC_CC: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'Structuring - Significant number of low value incoming transactions just below a threshold of credit card',
    inlineRule: {
      id: 'STRUC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        havingAggregate: AggregateType.COUNT,
        groupBy: ['counterpartyBeneficiaryId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 5,
        amountBetween: { min: 500, max: 999 },
      },
    },
  },
  STRUC_APM: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'Structuring - Significant number of low value incoming transactions just below a threshold of APM',
    inlineRule: {
      id: 'STRUC_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        havingAggregate: AggregateType.COUNT,
        groupBy: ['counterpartyBeneficiaryId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountBetween: { min: 500, max: 999 },

        amountThreshold: 5,
      },
    },
  },
  HCAI_CC: {
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Total sum of inbound credit card transactions received from counterparty is greater than a limit over a set period of time',
    inlineRule: {
      id: 'HCAI_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 3000,
      },
    },
  },
  HACI_APM: {
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Total sum of inbound non-traditional payment transactions received from counterparty is greater than a limit over a set period of time',
    inlineRule: {
      id: 'HACI_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.SUM,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 3000,
      },
    },
  },
  HVIC_CC: {
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Velocity - High number of inbound credit card transactions received from a Counterparty over a set period of time',
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 2,
      },
    },
  },
  CHVC_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Chargeback - Significant number of chargebacks over a set period of time',
    inlineRule: {
      id: 'CHVC_C',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        transactionType: [TransactionRecordType.chargeback],
        paymentMethods: [PaymentMethod.credit_card],
        amountThreshold: 14,
        timeAmount: 7,
        timeUnit: TIME_UNITS.days,
        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.COUNT,
      },
    },
  },
  SHCAC_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Chargeback - High sum of chargebacks over a set period of time',
    inlineRule: {
      id: 'SHCAC_C',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        transactionType: [TransactionRecordType.chargeback],
        paymentMethods: [PaymentMethod.credit_card],
        amountThreshold: 5_000,
        timeAmount: 7,
        timeUnit: TIME_UNITS.days,
        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.SUM,
      },
    },
  },
  CHCR_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: 'High Velocity - Refund - Significant number of refunds over a set period of time',
    inlineRule: {
      id: 'CHCR_C',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        transactionType: [TransactionRecordType.refund],
        paymentMethods: [PaymentMethod.credit_card],
        amountThreshold: 14,
        timeAmount: 7,
        timeUnit: TIME_UNITS.days,
        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.COUNT,
      },
    },
  },
  SHCAR_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: 'High Cumulative Amount - Refund - High sum of refunds over a set period of time',
    inlineRule: {
      id: 'SHCAR_C',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        transactionType: [TransactionRecordType.refund],
        paymentMethods: [PaymentMethod.credit_card],
        amountThreshold: 5_000,
        timeAmount: 7,
        timeUnit: TIME_UNITS.days,
        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.SUM,
      },
    },
  },
  HPC: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    description:
      'High Percentage of Chargebacks - High percentage of chargebacks over a set period of time',
    inlineRule: {
      id: 'HPC',
      fnName: 'evaluateHighTransactionTypePercentage',
      subjects: ['counterpartyId'],
      options: {
        transactionType: TransactionRecordType.chargeback,
        subjectColumn: 'counterpartyOriginatorId',
        minimumCount: 3,
        minimumPercentage: 50,
        timeAmount: 21,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
} as const satisfies Record<
  string,
  {
    inlineRule: InlineRule;
    defaultSeverity: AlertSeverity;
    enabled?: boolean;
    description?: string;
  }
>;

export const getAlertDefinitionCreateData = (
  {
    inlineRule,
    defaultSeverity,
    label,
    description,
    enabled = false,
  }: {
    label: string;
    inlineRule: InlineRule;
    defaultSeverity: AlertSeverity;
    enabled?: boolean;
    description?: string;
  },
  project: Project,
  createdBy: string = 'SYSTEM',
) => ({
  label: label,
  type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
  name: inlineRule.id,
  enabled: enabled ?? false,
  description: description || faker.lorem.sentence(),
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
  Promise.all(
    Object.entries(ALERT_DEFINITIONS)
      .filter(([_, alert]) => 'enabled' in alert && alert.enabled)
      .map(([label, data]) =>
        prisma.alertDefinition.upsert({
          where: { label_projectId: { label: label, projectId: project.id } },
          create: getAlertDefinitionCreateData({ label, ...data }, project, createdBy),
          update: getAlertDefinitionCreateData({ label, ...data }, project, createdBy),
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
