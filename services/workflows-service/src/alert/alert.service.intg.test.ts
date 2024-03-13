import { PrismaService } from '@/prisma/prisma.service';
import {
  AlertDefinition,
  Customer,
  PaymentMethod,
  Project,
  TransactionRecordType,
} from '@prisma/client';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
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

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: commonTestingModules,
      providers: [
        DataAnalyticsService,
        ProjectScopeService,
        AlertRepository,
        AlertDefinitionRepository,
        PrismaService,
        AlertService,
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);

    alertService = module.get<AlertService>(AlertService);
  });

  beforeEach(async () => {
    await cleanupDatabase();

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

  afterEach(tearDownDatabase);

  describe('checkAllAlerts', () => {
    describe('Rule: NUMCHRG', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'NUMCHRG',
              ...ALERT_DEFINITIONS.NUMCHRG,
            },
            project,
          ),
        });
      });

      it('When there are more than or equal to 15 chargeback transactions, an alert should be created', async () => {
        // @TODO: Remove this section
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(15)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]!.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]!.counterpartyId).toEqual(
          business1Transactions[0]!.counterpartyOriginatorId,
        );
      });

      it('When there are less than 15 chargeback transactions, no alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: SUMCHRG', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'SUMCHRG',
              ...ALERT_DEFINITIONS.SUMCHRG,
            },
            project,
          ),
        });
      });

      it('When the sum of chargebacks amount is greater than 5000, an alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(50)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]!.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]!.counterpartyId).toEqual(
          business1Transactions[0]!.counterpartyOriginatorId,
        );
      });

      it('When the sum of chargebacks amount is less than 5000, no alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
            transactionType: TransactionRecordType.chargeback,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: NUMREFCC', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'NUMREFCC',
              ...ALERT_DEFINITIONS.NUMREFCC,
            },
            project,
          ),
        });
      });

      it('When there are more than or equal to 15 refund transactions, an alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(15)
          .create({
            transactionType: TransactionRecordType.refund,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.refund,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]!.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]!.counterpartyId).toEqual(
          business1Transactions[0]!.counterpartyOriginatorId,
        );
      });

      it('When there are less than 15 refund transactions, no alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.refund,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .count(14)
          .create({
            transactionType: TransactionRecordType.refund,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(0);
      });
    });

    describe('Rule: SUMREFCC', () => {
      let alertDefinition: AlertDefinition;

      beforeEach(async () => {
        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(
            {
              label: 'SUMREFCC',
              ...ALERT_DEFINITIONS.SUMREFCC,
            },
            project,
          ),
        });
      });

      it('When the sum of refunds amount is greater than 5000, an alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(50)
          .create({
            transactionType: TransactionRecordType.refund,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
            transactionType: TransactionRecordType.refund,
          });

        // Act
        await alertService.checkAllAlerts();

        // Assert
        const alerts = await prismaService.alert.findMany();
        expect(alerts).toHaveLength(1);
        expect(alerts[0]!.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0]!.counterpartyId).toEqual(
          business1Transactions[0]!.counterpartyOriginatorId,
        );
      });

      it('When the sum of refunds amount is less than 5000, no alert should be created', async () => {
        // Assert DB is clean
        expect(await prismaService.alert.count()).toBe(0);
        expect(await prismaService.alertDefinition.count()).toBe(1);

        // Arrange
        const business1Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
            transactionType: TransactionRecordType.refund,
          });
        const business2Transactions = await TransactionFactory.make(prismaService, project.id)
          .paymentMethod(PaymentMethod.credit_card)
          .withBusinessOriginator()
          .withEndUserBeneficiary()
          .transactionDate(faker.date.recent(7))
          .amount(100)
          .count(49)
          .create({
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
