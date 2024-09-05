import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertService } from '@/alert/alert.service';
import { BusinessReportRepository } from '@/business-report/business-report.repository';
import { BusinessReportService } from '@/business-report/business-report.service';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createProject } from '@/test/helpers/create-project';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import {
  createBusinessCounterparty,
  createEndUserCounterparty,
  TransactionFactory,
} from '@/transaction/test-utils/transaction-factory';
import { faker } from '@faker-js/faker';
import { Test } from '@nestjs/testing';
import {
  AlertDefinition,
  Counterparty,
  Customer,
  PaymentMethod,
  Project,
  TransactionDirection,
  TransactionRecordType,
} from '@prisma/client';
import {
  ALERT_DEFINITIONS,
  generateAlertDefinitions,
  getAlertDefinitionCreateData,
} from '../../scripts/alerts/generate-alerts';

import { PrismaService } from './../prisma/prisma.service';

type AsyncTransactionFactoryCallback = (
  transactionFactory: TransactionFactory,
) => Promise<TransactionFactory | void>;

const maskedVisaCardNumber = () => {
  const cardNumber: string = faker.finance.creditCardNumber('visa');

  // Extract the required parts of the card number
  const firstSix = cardNumber.substring(0, 6);
  const lastFour = cardNumber.substring(cardNumber.length - 4);

  // Construct the masked number with the desired pattern
  const maskedNumber = `${firstSix}******${lastFour}`.replace('-', '');

  return maskedNumber;
};

const createTransactionsWithCounterpartyAsync = async (
  project: Project | undefined,
  prismaService: PrismaService,
  callback: AsyncTransactionFactoryCallback,
) => {
  const counteryparty = await createCounterparty(prismaService, project);

  const baseTransactionFactory = new TransactionFactory({
    prisma: prismaService,
    projectId: counteryparty.projectId,
  })
    .withCounterpartyBeneficiary(counteryparty.id)
    .direction(TransactionDirection.inbound)
    .paymentMethod(PaymentMethod.credit_card);

  (await callback(baseTransactionFactory)) as TransactionFactory;

  return baseTransactionFactory;
};

const createFutureDate = (daysToAdd: number) => {
  const currentDate = new Date();
  const futureDate = new Date(currentDate);
  futureDate.setDate(currentDate.getDate() + daysToAdd);
  return futureDate;
};

describe('AlertService', () => {
  let prismaService: PrismaService;
  let dataAnalyticsService: DataAnalyticsService;
  let alertService: AlertService;
  let customer: Customer;
  let project: Project;
  let transactionFactory: TransactionFactory;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: commonTestingModules,
      providers: [
        DataAnalyticsService,
        ProjectScopeService,
        AlertRepository,
        AlertDefinitionRepository,
        BusinessReportService,
        BusinessReportRepository,
        BusinessReportService,
        BusinessReportRepository,
        AlertService,
      ],
    }).compile();

    prismaService = module.get(PrismaService);
    dataAnalyticsService = module.get(DataAnalyticsService);

    alertService = module.get(AlertService);
  });

  beforeEach(async () => {
    await cleanupDatabase();
    await prismaService.$executeRaw`TRUNCATE TABLE "public"."Alert" CASCADE;`;
    await prismaService.$executeRaw`TRUNCATE TABLE "public"."AlertDefinition" CASCADE;`;
    await prismaService.$executeRaw`TRUNCATE TABLE "public"."TransactionRecord" CASCADE;`;

    customer = await createCustomer(
      prismaService,
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      '',
      '',
      'webhook-shared-secret',
    );

    project = await createProject(prismaService, customer, faker.datatype.uuid());

    transactionFactory = new TransactionFactory({
      prisma: prismaService,
      projectId: project.id,
    });
  });

  afterAll(tearDownDatabase);

  describe('checkAllAlerts', () => {
    let baseTransactionFactory: TransactionFactory;

    beforeEach(() => {
      baseTransactionFactory = transactionFactory
        .paymentMethod(PaymentMethod.credit_card)
        .transactionDate(faker.date.recent(6));
    });

    describe('Rule: PAY_HCA_CC', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(ALERT_DEFINITIONS.PAY_HCA_CC, project, undefined, {
            crossEnvKey: 'TEST',
          }),
        });

        expect(
          ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold,
        ).toBeGreaterThanOrEqual(1000);
        expect(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.direction).toBe(
          TransactionDirection.inbound,
        );
      });

      it.only('When there more than 1k credit card transactions, an alert should be created', async () => {
        // Arrange
        await baseTransactionFactory
          .withBusinessBeneficiary()
          .direction(TransactionDirection.inbound)
          .paymentMethod(PaymentMethod.credit_card)
          .amount(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold + 1)
          .count(1)
          .create();

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0] as any).toMatchObject({
          executionDetails: { executionRow: { transactionCount: '1', totalAmount: 1001 } },
        });
      });

      it('When there are few transaction, no alert should be created', async () => {
        // Arrange
        await baseTransactionFactory
          .withBusinessBeneficiary()
          .direction(TransactionDirection.inbound)
          .paymentMethod(PaymentMethod.credit_card)
          .amount(150)
          .count(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold % 10)
          .create();

        await baseTransactionFactory
          .direction(TransactionDirection.inbound)
          .withBusinessBeneficiary()
          .paymentMethod(PaymentMethod.apple_pay)
          .amount(150)
          .count(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold % 10)
          .create();

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });

      it('Check Investigation filter', async () => {
        prismaService.alert.findMany({
          where: {
            projectId: project.id,
          },
          include: {
            counterparty: {
              include: {
                benefitingTransactions: {
                  where: {
                    paymentMethod: 'credit_card',
                    transactionDate: {
                      gte: new Date('2021-01-01'),
                      lte: new Date('2021-01-01'),
                    },
                  },
                },
                originatingTransactions: {
                  where: {
                    paymentMethod: 'credit_card',
                    transactionDate: {
                      gte: new Date('2021-01-01'),
                      lte: new Date('2021-01-01'),
                    },
                  },
                },
              },
            },
          },
        });
      });
    });
  });
});
const createCounterparty = async (
  prismaService: PrismaService,
  proj?: Pick<Project, 'id'>,
  {
    correlationIdFn,
  }: {
    correlationIdFn?: () => string;
  } = {},
) => {
  const correlationId = correlationIdFn ? correlationIdFn() : faker.datatype.uuid();

  if (!proj) {
    const customer = await createCustomer(
      prismaService,
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      '',
      '',
      'webhook-shared-secret',
    );

    proj = await createProject(prismaService, customer, faker.datatype.uuid());
  }

  return await prismaService.counterparty.create({
    data: {
      project: { connect: { id: proj.id } },
      correlationId,
      business: {
        create: {
          correlationId,
          companyName: faker.company.name(),
          registrationNumber: faker.datatype.uuid(),
          mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
          businessType: faker.lorem.word(),
          project: { connect: { id: proj.id } },
        },
      },
    },
  });
};
