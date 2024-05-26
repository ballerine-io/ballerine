import {
  ALERT_DEDUPE_STRATEGY_DEFAULT,
  daysToMinutesConverter,
  MerchantAlertLabel,
  SEVEN_DAYS,
  THREE_DAYS,
  TWENTY_ONE_DAYS,
} from '@/alert/consts';
import { TDedupeStrategy } from '@/alert/types';
import { AggregateType, TIME_UNITS } from '@/data-analytics/consts';
import { InlineRule } from '@/data-analytics/types';
import { InputJsonValue, PrismaTransaction } from '@/types';
import { faker } from '@faker-js/faker';
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
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description: `Transaction Limit - Historic Average - Inbound - Inbound transaction exceeds client's historical average`,
    inlineRule: {
      id: 'TLHAICC',
      fnName: 'evaluateTransactionAvg',
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
        customerType: undefined,
        timeUnit: undefined,
        timeAmount: undefined,
      },
    },
  },
  TLHAIAPM: {
    enabled: false,
    defaultSeverity: AlertSeverity.medium,
    description: `Transaction Limit - Historic Average - Inbound - Inbound transaction exceeds client's historical average`,
    inlineRule: {
      id: 'TLHAIAPM',
      fnName: 'evaluateTransactionAvg',
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
        customerType: undefined,
        timeUnit: undefined,
        timeAmount: undefined,
      },
    },
  },
  PGAICT: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `An Credit card inbound transaction value was over the peer group average within a set period of time`,
    inlineRule: {
      id: 'PGAICT',
      fnName: 'evaluateTransactionAvg',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '=',
        },
        minimumTransactionAmount: 100,
        transactionFactor: 2,

        customerType: 'test',
        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  PGAIAPM: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `An non credit card inbound transaction value was over the peer group average within a set period of time`,
    inlineRule: {
      id: 'PGAIAPM',
      fnName: 'evaluateTransactionAvg',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '!=',
        },
        customerType: 'test',
        minimumTransactionAmount: 100,
        transactionFactor: 2,

        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  DORMANT: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    description: `First activity of client after a long period of dormancy`,
    inlineRule: {
      id: 'DORMANT',
      fnName: 'evaluateDormantAccount',
      subjects: ['counterpartyId'],
      options: {
        timeAmount: 180,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  HVHAI_CC: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `Total number of incoming credit cards transactions exceeds client’s historical average`,
    inlineRule: {
      id: 'HVHAI_CC',
      fnName: 'evaluateHighVelocityHistoricAverage',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 3,
        transactionFactor: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '=',
        },
        activeUserPeriod: {
          timeAmount: 180,
        },
        lastDaysPeriod: {
          timeAmount: THREE_DAYS,
        },
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  HVHAI_APM: {
    enabled: true,
    defaultSeverity: AlertSeverity.medium,
    description: `Total number of incoming credit cards transactions exceeds client’s historical average`,
    inlineRule: {
      id: 'HVHAI_APM',
      fnName: 'evaluateHighVelocityHistoricAverage',
      subjects: ['counterpartyId'],
      options: {
        transactionDirection: TransactionDirection.inbound,
        minimumCount: 3,
        transactionFactor: 2,
        paymentMethod: {
          value: PaymentMethod.credit_card,
          operator: '!=',
        },
        activeUserPeriod: {
          timeAmount: 180,
        },
        lastDaysPeriod: {
          timeAmount: THREE_DAYS,
        },
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  MMOC_CC: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    description: `Card numbers that are appearing in too many different merchant IDs for credit card transactions`,
    inlineRule: {
      id: 'MMOC_CC',
      fnName: 'evaluateMultipleMerchantsOneCounterparty',
      subjects: ['counterpartyId'],
      options: {
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },
        minimumCount: 2,
        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
  MMOC_APM: {
    enabled: true,
    defaultSeverity: AlertSeverity.high,
    description: `Card numbers that are appearing in too many different merchant IDs for non credit card transactions`,
    inlineRule: {
      id: 'MMOC_APM',
      fnName: 'evaluateMultipleMerchantsOneCounterparty',
      subjects: ['counterpartyId'],
      options: {
        excludedCounterparty: {
          counterpartyBeneficiaryIds: ['9999999999999999', '999999______9999'],
          counterpartyOriginatorIds: [],
        },
        minimumCount: 2,
        timeAmount: SEVEN_DAYS,
        timeUnit: TIME_UNITS.days,
      },
    },
  },
} as const satisfies Record<string, Parameters<typeof getAlertDefinitionCreateData>[0]>;

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
    correlationId,
  }: {
    inlineRule: InlineRule;
    defaultSeverity: AlertSeverity;
    monitoringType?: MonitoringType;
    enabled: boolean;
    dedupeStrategy?: Partial<TDedupeStrategy>;
    description?: string;
    correlationId?: string;
  },
  project: Project,
  createdBy: string = 'SYSTEM',
  extraColumns: {
    crossEnvKey: string;
  },
) => {
  const id = inlineRule.id;

  return {
    enabled,
    defaultSeverity,
    dedupeStrategy: {
      ...ALERT_DEDUPE_STRATEGY_DEFAULT,
      ...(dedupeStrategy ?? {}),
    },
    monitoringType: monitoringType ?? MonitoringType.transaction_monitoring,
    inlineRule,
    correlationId: correlationId || id,
    name: id,
    rulesetId: `set-${id}`,
    description: description,
    ruleId: id,
    createdBy: createdBy,
    modifiedBy: createdBy,
    config: { config: {} },
    tags: [],
    additionalInfo: {},
    crossEnvKey: extraColumns.crossEnvKey,
    project: {
      connect: {
        id: project.id,
      },
    },
  } as Prisma.AlertDefinitionCreateInput;
};

export const generateAlertDefinitions = async (
  prisma: PrismaClient | PrismaTransaction,
  {
    project,
    createdBy = 'SYSTEM',
    alertsDef = ALERT_DEFINITIONS,
  }: {
    alertsDefConfiguration?:
      | typeof ALERT_DEFINITIONS
      | typeof MERCHANT_MONITORING_ALERT_DEFINITIONS;
    createdBy?: string;
    project: Project;
    alertsDef?: Partial<typeof ALERT_DEFINITIONS>;
  },
  {
    crossEnvKeyPrefix = undefined,
  }: {
    crossEnvKeyPrefix?: string;
  } = {},
) =>
  Promise.all(
    Object.values(alertsDef)
      .map(alert => ({
        correlationId: alert.inlineRule.id,
        ...alert,
      }))
      .filter(alert => alert.enabled)
      .map(async alertDef => {
        const extraColumns = {
          crossEnvKey: crossEnvKeyPrefix
            ? `${crossEnvKeyPrefix}_${alertDef.inlineRule.id}`
            : project.name
                .toUpperCase()
                .replace(' ', '_')
                .replace(/[_-]?PROJECT[_-]?/g, 'P')
                .replace(/[_-]?DEFAULT[_-]?/g, '')
                .replace('-', '_')
                .replace('__', '_') +
              '_' +
              alertDef.inlineRule.id,
        };
        let dbRes;
        try {
          dbRes = await prisma.alertDefinition.upsert({
            where: {
              crossEnvKey: extraColumns.crossEnvKey,
            },
            create: getAlertDefinitionCreateData(alertDef, project, createdBy, extraColumns),
            update: getAlertDefinitionCreateData(alertDef, project, createdBy, extraColumns),
            include: {
              alert: true,
            },
          });
        } catch (error) {
          console.error(error);
          console.error('Error creating alert definition', alertDef, extraColumns);
          throw error;
        }

        return dbRes;
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
    alertsDefConfiguration: ALERT_DEFINITIONS,
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
  ]);
};
