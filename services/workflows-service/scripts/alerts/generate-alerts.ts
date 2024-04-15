import { businessIds } from './../generate-end-user';
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
  MonitoringType,
  PaymentMethod,
  Prisma,
  PrismaClient,
  Project,
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

export const TRANSACTIONS_ALERT_DEFINITIONS = {
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

        direction: 'inbound',

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

        direction: 'inbound',

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
    defaultSeverity: AlertSeverity.medium,
    description:
      'Structuring - Significant number of low value incoming transactions just below a threshold of credit card',
    inlineRule: {
      id: 'STRUC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId'],
      options: {
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 5,
        amountBetween: { min: 500, max: 1000 },
      },
    },
  },
  STRUC_APM: {
    defaultSeverity: AlertSeverity.medium,
    description:
      'Structuring - Significant number of low value incoming transactions just below a threshold of APM',
    inlineRule: {
      id: 'STRUC_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['businessId'],
      options: {
        havingAggregate: AggregateType.COUNT,

        direction: 'inbound',
        // TODO: add excludedCounterparty
        // excludedCounterparty: ['9999999999999999', '999999******9999'],

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: 7,
        timeUnit: TIME_UNITS.days,

        amountBetween: { min: 500, max: 1000 },

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
    inlineRule: InlineRule & InputJsonValue;
    defaultSeverity: AlertSeverity;
    monitoringType?: MonitoringType;
    enabled?: boolean;
    description?: string;
  }
>;

export const MERCHANT_MONITORING_ALERT_DEFINITIONS = {
  MRCNT_RISK: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    monitoringType: MonitoringType.ongoing_merchant_monitoring,
    description: '',
    inlineRule: {
      id: 'MRCNT_RISK',
      fnName: 'evaluateRiskScore',
      subjects: ['businessId'],
    },
  },
} as const satisfies Record<
  string,
  {
    inlineRule: InlineRule & InputJsonValue;
    monitoringType: MonitoringType;
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
    monitoringType = MonitoringType.transaction_monitoring,
    enabled = false,
  }: {
    label: string;
    inlineRule: InlineRule;
    defaultSeverity: AlertSeverity;
    monitoringType?: MonitoringType;
    enabled?: boolean;
    description?: string;
  },
  project: Project,
  createdBy: string = 'SYSTEM',
) => ({
  label: label,
  type: faker.helpers.arrayElement(Object.values(AlertType)) as AlertType,
  monitoringType: monitoringType ?? MonitoringType.transaction_monitoring,
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
  inlineRule: inlineRule as InputJsonValue,
  tags: [faker.helpers.arrayElement(tags), faker.helpers.arrayElement(tags)],
  additionalInfo: {},
  projectId: project.id,
});

export const generateAlertDefinitions = async (
  prisma: PrismaClient | PrismaTransaction,
  {
    createdBy = 'SYSTEM',
    project,
    alertsDefConfiguration = TRANSACTIONS_ALERT_DEFINITIONS,
  }: {
    alertsDefConfiguration?:
      | typeof TRANSACTIONS_ALERT_DEFINITIONS
      | typeof MERCHANT_MONITORING_ALERT_DEFINITIONS;
    createdBy?: string;
    project: Project;
  },
) =>
  Promise.all(
    Object.entries(alertsDefConfiguration)
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

const generateFakeAlert = (
  options: {
    severity: AlertSeverity;
    agentUserIds: string[];
  } & (
    | {
        counterpartyIds: string[];
      }
    | {
        businessIds: string[];
      }
  ),
): Omit<Prisma.AlertCreateManyAlertDefinitionInput, 'projectId'> => {
  const { severity, agentUserIds } = options;

  let businessId: { businessId: string } | {} = {};
  let counterpartyId: { counterpartyId: string } | {} = {};

  if ('businessIds' in options) {
    // For merchant monitoring alerts
    businessId = faker.helpers.arrayElement(options.businessIds.map(id => ({ businessId: id })));
  } else if ('counterpartyIds' in options) {
    // For transaction alerts
    counterpartyId = faker.helpers.arrayElement(
      options.counterpartyIds.map(id => ({ counterpartyId: id })),
    );
  }

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
    ...counterpartyId,
    ...businessId,
  };
};

export const seedTransactionsAlerts = async (
  prisma: PrismaClient,
  {
    project,
    businessIds,
    counterpartyIds,
    agentUserIds,
  }: {
    project: Project;
    businessIds: string[];
    counterpartyIds: string[];
    agentUserIds: string[];
  },
) => {
  const transactionsAlertDef = await generateAlertDefinitions(prisma, {
    alertsDefConfiguration: TRANSACTIONS_ALERT_DEFINITIONS,
    project,
    createdBy: faker.internet.userName(),
  });

  const merchantMonitoringAlertDef = await generateAlertDefinitions(prisma, {
    alertsDefConfiguration: MERCHANT_MONITORING_ALERT_DEFINITIONS,
    project,
    createdBy: faker.internet.userName(),
  });

  await Promise.all([
    ...transactionsAlertDef.map(alertDefinition =>
      prisma.alert.createMany({
        data: Array.from(
          {
            length: faker.datatype.number({ min: 3, max: 5 }),
          },
          () => ({
            alertDefinitionId: alertDefinition.id,
            projectId: project.id,
            ...generateFakeAlert({
              counterpartyIds,
              agentUserIds,
              severity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
            }),
          }),
        ),
        skipDuplicates: true,
      }),
    ),

    ...merchantMonitoringAlertDef.map(alertDefinition =>
      prisma.alert.createMany({
        data: Array.from(
          {
            length: faker.datatype.number({ min: 3, max: 5 }),
          },
          () => ({
            alertDefinitionId: alertDefinition.id,
            projectId: project.id,
            ...generateFakeAlert({
              businessIds,
              agentUserIds,
              severity: faker.helpers.arrayElement(Object.values(AlertSeverity)),
            }),
          }),
        ),
        skipDuplicates: true,
      }),
    ),
  ]);
};
