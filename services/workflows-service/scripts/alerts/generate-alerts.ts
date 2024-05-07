import { InlineRule } from '@/data-analytics/types';
import {
  AlertSeverity,
  AlertState,
  AlertStatus,
  MonitoringType,
  PaymentMethod,
  Prisma,
  PrismaClient,
  Project,
  TransactionDirection,
  TransactionRecordType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AggregateType, TIME_UNITS } from '@/data-analytics/consts';
import { InputJsonValue, PrismaTransaction } from '@/types';
import { TDedupeStrategy } from '@/alert/types';
import {
  ALERT_DEDUPE_STRATEGY_DEFAULT,
  daysToMinutesConverter,
  MerchantAlertLabel,
  SEVEN_DAYS,
  TransactionAlertLabel,
  TWENTY_ONE_DAYS,
} from '@/alert/consts';

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
        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },
        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: SEVEN_DAYS,
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

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 1000,

        groupBy: ['counterpartyBeneficiaryId'],
      },
    },
  },
  STRUC_CC: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
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

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 5,
        amountBetween: { min: 500, max: 999 },
      },
    },
  },
  STRUC_APM: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
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

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,
        amountBetween: { min: 500, max: 999 },
        amountThreshold: 5,
      },
    },
  },
  HCAI_CC: {
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Total sum of inbound credit card transactions received from counterparty is greater than a limit over a set period of time',
    inlineRule: {
      id: 'HCAI_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.SUM,
        groupBy: ['counterpartyBeneficiaryId', 'counterpartyOriginatorId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 3000,
      },
    },
  },
  HACI_APM: {
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Cumulative Amount - Total sum of inbound non-traditional payment transactions received from counterparty is greater than a limit over a set period of time',
    inlineRule: {
      id: 'HACI_APM',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.SUM,
        groupBy: ['counterpartyBeneficiaryId', 'counterpartyOriginatorId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 3000,
      },
    },
  },
  HVIC_CC: {
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Velocity - High number of inbound credit card transactions received from a Counterparty over a set period of time',
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.COUNT,
        groupBy: ['counterpartyBeneficiaryId', 'counterpartyOriginatorId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: false,

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        amountThreshold: 2,
      },
    },
  },
  HVIC_APM: {
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description:
      'High Velocity - High number of inbound non-traditional payment transactions received from a Counterparty over a set period of time',
    inlineRule: {
      id: 'HVIC_CC',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId', 'counterpartyOriginatorId'],
      options: {
        havingAggregate: AggregateType.COUNT,
        groupBy: ['counterpartyBeneficiaryId', 'counterpartyOriginatorId'],

        direction: TransactionDirection.inbound,
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },

        paymentMethods: [PaymentMethod.credit_card],
        excludePaymentMethods: true,

        timeAmount: SEVEN_DAYS,
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

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.COUNT,
      },
    },
  },
  SHCAC_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
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

        timeAmount: SEVEN_DAYS,
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

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,

        groupBy: ['counterpartyOriginatorId'],
        havingAggregate: AggregateType.COUNT,
      },
    },
  },
  SHCAR_C: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    description: 'High Cumulative Amount - Refund - High sum of refunds over a set period of time',
    inlineRule: {
      id: 'SHCAR_C',
      fnName: 'evaluateTransactionsAgainstDynamicRules',
      subjects: ['counterpartyId'],
      options: {
        transactionType: [TransactionRecordType.refund],
        paymentMethods: [PaymentMethod.credit_card],
        amountThreshold: 5_000,

        timeAmount: SEVEN_DAYS,
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
    dedupeStrategy: {
      mute: false,
      cooldownTimeframeInMinutes: daysToMinutesConverter(TWENTY_ONE_DAYS),
    },
    inlineRule: {
      id: 'HPC',
      fnName: 'evaluateHighTransactionTypePercentage',
      subjects: ['counterpartyId'],
      options: {
        transactionType: TransactionRecordType.chargeback,
        subjectColumn: 'counterpartyOriginatorId',
        minimumCount: 3,
        minimumPercentage: 50,
        timeAmount: TWENTY_ONE_DAYS,

        timeUnit: TIME_UNITS.days,
      },
    },
  },
  TLHAICC: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `Transaction Limit - Historic Average - Inbound - Inbound transaction exceeds client's historical average`,
    inlineRule: {
      id: 'TLHAICC',
      fnName: 'evaluateTransactionLimitHistoricAverageInbound',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '=',
        },
        minimumTransactionAmount: 100,
        transactionFactor: 1,
      },
    },
  },
  TLHAIAPM: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `Transaction Limit - Historic Average - Inbound - Inbound transaction exceeds client's historical average`,
    inlineRule: {
      id: 'TLHAIAPM',
      fnName: 'evaluateTransactionLimitHistoricAverageInbound',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '!=',
        },
        minimumTransactionAmount: 100,
        transactionFactor: 1,
      },
    },
  },
} as const satisfies Record<
  Partial<keyof typeof TransactionAlertLabel>,
  {
    inlineRule: InlineRule & InputJsonValue;
    defaultSeverity: AlertSeverity;
    dedupeStrategy?: TDedupeStrategy;
    monitoringType?: MonitoringType;
    enabled?: boolean;
    description?: string;
  }
>;

export const MERCHANT_MONITORING_ALERT_DEFINITIONS = {
  MERCHANT_ONGOING_RISK_ALERT_RISK_INCREASE: {
    enabled: true,
    defaultSeverity: AlertSeverity.low,
    monitoringType: MonitoringType.ongoing_merchant_monitoring,
    description: 'Monitor ongoing risk changes',
    inlineRule: {
      id: 'MERCHANT_ONGOING_RISK_ALERT_RISK_INCREASE',
      fnName: 'checkMerchantOngoingAlert',
      subjects: ['businessId', 'projectId'],
      options: {
        increaseRiskScore: 20,
      },
    },
  },
  MERCHANT_ONGOING_RISK_ALERT_THRESHOLD: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    monitoringType: MonitoringType.ongoing_merchant_monitoring,
    description: 'Monitor ongoing risk changes',
    inlineRule: {
      id: 'MERCHANT_ONGOING_RISK_ALERT_THRESHOLD',
      fnName: 'checkMerchantOngoingAlert',
      subjects: ['businessId', 'projectId'],
      options: {
        maxRiskScoreThreshold: 60,
      },
    },
  },
  MERCHANT_ONGOING_RISK_ALERT_PERCENTAGE: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    monitoringType: MonitoringType.ongoing_merchant_monitoring,
    description: 'Monitor ongoing risk changes',
    inlineRule: {
      id: 'MERCHANT_ONGOING_RISK_ALERT_PERCENTAGE',
      fnName: 'checkMerchantOngoingAlert',
      subjects: ['businessId', 'projectId'],
      options: {
        increaseRiskScorePercentage: 30,
      },
    },
  },
} as const satisfies Partial<
  Record<
    keyof typeof MerchantAlertLabel | string,
    {
      inlineRule: InlineRule & InputJsonValue;
      monitoringType: MonitoringType;
      defaultSeverity: AlertSeverity;
      enabled?: boolean;
      description?: string;
    }
  >
>;

export const getAlertDefinitionCreateData = (
  {
    inlineRule,
    defaultSeverity,
    description,
    monitoringType = MonitoringType.transaction_monitoring,
    enabled = false,
    dedupeStrategy = ALERT_DEDUPE_STRATEGY_DEFAULT,
  }: {
    inlineRule: InlineRule;
    defaultSeverity: AlertSeverity;
    monitoringType?: MonitoringType;
    enabled: boolean;
    dedupeStrategy?: Partial<TDedupeStrategy>;
    description?: string;
  },
  project: Project,
  createdBy: string = 'SYSTEM',
  extraColumns: any = {},
) => {
  const id = inlineRule.id;

  return {
    inlineRule,
    label: id,
    name: id,
    enabled,
    defaultSeverity,
    dedupeStrategy: {
      ...ALERT_DEDUPE_STRATEGY_DEFAULT,
      ...(dedupeStrategy ?? {}),
    },
    monitoringType: monitoringType ?? MonitoringType.transaction_monitoring,
    rulesetId: `set-${id}`,
    description: description,
    ruleId: id,
    createdBy: createdBy,
    modifiedBy: createdBy,
    config: { config: {} },
    tags: [],
    additionalInfo: {},
    ...extraColumns,
    projectId: project.id,
  };
};

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
  {
    crossEnvKeyPrefix = undefined,
  }: {
    crossEnvKeyPrefix?: string;
  } = {},
) =>
  Promise.all(
    Object.values(alertsDefConfiguration)
      .map(alert => ({
        label: alert.inlineRule.id,
        enable: false,
        ...alert,
      }))
      .filter(alert => alert.enabled)
      .map(alertDef => {
        const extraColumns = {
          crossEnvKey: crossEnvKeyPrefix
            ? `${crossEnvKeyPrefix}_${alertDef.inlineRule.id}`
            : undefined,
        };

        return prisma.alertDefinition.upsert({
          where: { label_projectId: { label: alertDef.inlineRule.id, projectId: project.id } },
          create: getAlertDefinitionCreateData(alertDef, project, createdBy, extraColumns),
          update: getAlertDefinitionCreateData(alertDef, project, createdBy, extraColumns),
          include: {
            alert: true,
          },
        });
      }),
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
