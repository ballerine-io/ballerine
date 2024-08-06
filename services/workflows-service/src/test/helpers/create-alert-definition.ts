import { Prisma } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { AppLoggerService } from '../../common/app-logger/app-logger.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { AlertService } from '@/alert/alert.service';
import { AlertRepository } from '@/alert/alert.repository';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { ProjectScopeService } from '@/project/project-scope.service';
import { ClsService } from 'nestjs-cls';
import { merge } from 'lodash';

export const createAlertDefinition = async (
  projectId: string,
  overrides: Prisma.AlertDefinitionCreateArgs = {} as Prisma.AlertDefinitionCreateArgs,
) => {
  const moduleRef = await Test.createTestingModule({
    providers: [
      AlertService,
      ClsService,
      PrismaService,
      DataAnalyticsService,
      AlertDefinitionRepository,
      ProjectScopeService,
      AppLoggerService,
      {
        provide: AlertRepository,
        useClass: AlertRepository,
      },
      {
        provide: 'LOGGER',
        useValue: {
          setContext: jest.fn(),
          log: jest.fn(),
          error: jest.fn(),
          warn: jest.fn(),
          debug: jest.fn(),
        },
      },
    ],
  }).compile();

  const alertService = moduleRef.get<AlertService>(AlertService);
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
      fnName: faker.helpers.arrayElement([
        'evaluateTransactionsAgainstDynamicRules',
        'evaluateRiskScore',
        'evaluateCustomRule',
      ]),
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
      subjects: [faker.helpers.arrayElement(['counterpartyId', 'businessId', 'transactionId'])],
    },
  };

  return await alertService.create(merge(definition, overrides) as any, projectId);
};
