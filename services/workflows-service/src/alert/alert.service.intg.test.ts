import { PrismaService } from '@/prisma/prisma.service';
import {
  AlertDefinition,
  Customer,
  PaymentMethod,
  Project,
  TransactionRecordType,
} from '@prisma/client';
import { tearDownDatabase } from '@/test/helpers/database-helper';
import { createCustomer } from '@/test/helpers/create-customer';
import { faker } from '@faker-js/faker';
import { createProject } from '@/test/helpers/create-project';
import { TransactionFactory } from '@/transaction/test-utils/transaction-factory';
import { AlertService } from '@/alert/alert.service';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { Test } from '@nestjs/testing';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import {
  ALERT_DEFINITIONS,
  getAlertDefinitionCreateData,
} from '../../scripts/alerts/generate-alerts';

describe('AlertService', () => {
  let prismaService: PrismaService;
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
        AlertService,
        TransactionFactory,
      ],
    }).compile();

    prismaService = module.get(PrismaService);

    alertService = module.get(AlertService);

    transactionFactory = module.get(TransactionFactory);
  });

  beforeEach(async () => {
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
  });

  afterAll(tearDownDatabase);

  describe('checkAllAlerts', () => {
    let baseTransactionFactory: TransactionFactory;

    beforeEach(() => {
      baseTransactionFactory = transactionFactory
        .project(project)
        .paymentMethod(PaymentMethod.credit_card)
        .withBusinessOriginator()
        .withEndUserBeneficiary()
        .transactionDate(faker.date.recent(6));
    });

    describe('Rule: CHVC_C', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'CHVC_C',
              ...ALERT_DEFINITIONS.CHVC_C,
            },
            project,
          ),
        });
      });

      it('When there are more than or equal to 15 chargeback transactions, an alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.count(15).create({
          transactionType: TransactionRecordType.chargeback,
        });
        const business2Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.chargeback,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]?.counterpartyId).toEqual(
          business1Transactions[0]?.counterpartyOriginatorId,
        );
      });

      it.only('When there are less than 15 chargeback transactions, no alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.chargeback,
        });
        const business2Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.chargeback,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: SHCAC_C', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'SHCAC_C',
              ...ALERT_DEFINITIONS.SHCAC_C,
            },
            project,
          ),
        });
      });

      it('When the sum of chargebacks amount is greater than 5000, an alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.amount(100).count(51).create({
          transactionType: TransactionRecordType.chargeback,
        });
        const business2Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.chargeback,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]?.counterpartyId).toEqual(
          business1Transactions[0]?.counterpartyOriginatorId,
        );
      });

      it('When the sum of chargebacks amount is less than 5000, no alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.chargeback,
        });
        const business2Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.chargeback,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: CHCR_C', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'CHCR_C',
              ...ALERT_DEFINITIONS.CHCR_C,
            },
            project,
          ),
        });
      });

      it('When there are more than or equal to 15 refund transactions, an alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.count(15).create({
          transactionType: TransactionRecordType.refund,
        });
        const business2Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.refund,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]?.counterpartyId).toEqual(
          business1Transactions[0]?.counterpartyOriginatorId,
        );
      });

      it('When there are less than 15 refund transactions, no alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.refund,
        });
        const business2Transactions = await baseTransactionFactory.count(14).create({
          transactionType: TransactionRecordType.refund,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: SHCAR_C', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'SHCAR_C',
              ...ALERT_DEFINITIONS.SHCAR_C,
            },
            project,
          ),
        });
      });

      it('When the sum of refunds amount is greater than 5000, an alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.amount(100).count(51).create({
          transactionType: TransactionRecordType.refund,
        });
        const business2Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.refund,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]?.counterpartyId).toEqual(
          business1Transactions[0]?.counterpartyOriginatorId,
        );
      });

      it('When the sum of refunds amount is less than 5000, no alert should be created', async () => {
        // Arrange
        const business1Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.refund,
        });
        const business2Transactions = await baseTransactionFactory.amount(100).count(49).create({
          transactionType: TransactionRecordType.refund,
        });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });
  });
});
