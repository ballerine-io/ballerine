import { AlertService } from '@/alert/alert.service';
import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';
import { merge } from 'lodash';

export const createAlertDefinition = async (
  projectId: string,
  overrides: Prisma.AlertDefinitionCreateArgs = {} as Prisma.AlertDefinitionCreateArgs,
  alertService: AlertService,
) => {
  const fnName = faker.helpers.arrayElement([
    'evaluateTransactionsAgainstDynamicRules',
    'evaluateDormantAccount',
    'evaluateMultipleMerchantsOneCounterparty',
  ]);
  const definition = {
    crossEnvKey: faker.datatype.uuid(),
    name: faker.lorem.slug(),
    description: faker.lorem.sentence(),
    rulesetId: faker.datatype.uuid(),
    ruleId: faker.datatype.uuid(),

    enabled: faker.datatype.boolean(),
    dedupeStrategy: {
      invokeOnce: true,
      invokeThrottleInSeconds: 60,
    },
    config: {},
    tags: [faker.word.adjective(), faker.word.noun()],
    additionalInfo: {},
    createdBy: '',
    correlationId: '',
    monitoringType: 'transaction_monitoring',
    defaultSeverity: 'low',
    modifiedBy: null,

    inlineRule: {
      id: faker.datatype.uuid(),
      fnName,
      fnInvestigationName: fnName.replace('evaluate', 'investigate'),
      options: {
        groupBy: [
          faker.helpers.arrayElement([
            'counterpartyBeneficiaryId',
            'counterpartyOriginatorId',
            'businessId',
          ]),
        ],
        timeUnit: faker.helpers.arrayElement(['days', 'hours', 'weeks', 'months']),
        direction: faker.helpers.arrayElement(['inbound', 'outbound']),
        timeAmount: faker.datatype.number({ min: 1, max: 30 }),
        paymentMethods: [faker.finance.transactionType()],
        amountThreshold: faker.datatype.number({ min: 100, max: 1000 }),
        havingAggregate: faker.helpers.arrayElement(['SUM', 'COUNT', 'AVG']),
        excludedCounterparty: {
          counterpartyOriginatorIds: [],
          counterpartyBeneficiaryIds: [],
        },
        excludePaymentMethods: faker.datatype.boolean(),
      },
      subjects: [
        faker.helpers.arrayElement(['counterpartyBeneficiaryId', 'counterpartyOriginatorId']),
      ],
    },
  };

  return await alertService.create(merge(definition, overrides) as any, projectId);
};
