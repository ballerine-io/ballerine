import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createAlert } from '@/test/helpers/create-alert';
import { createTransactionRecord } from '@/test/helpers/create-transaction-record';
import { createAlertDefinition } from '@/test/helpers/create-alert-definition';
import {
  AlertDefinition,
  Business,
  Customer,
  EndUser,
  PaymentAcquirer,
  PaymentBrandName,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  Project,
  TransactionDirection,
  TransactionRecordType,
} from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';
import { TransactionModule } from '@/transaction/transaction.module';
import { TransactionControllerExternal } from '@/transaction/transaction.controller.external';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create.dto';
import { generateBusiness, generateEndUser } from '../../scripts/generate-end-user';
import { BulkStatus } from '@/alert/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ConfigService } from '@nestjs/config';
import { AlertService } from '@/alert/alert.service';

const getBusinessCounterpartyData = (business?: Business) => {
  if (business) {
    return {
      correlationId: business.correlationId!,
      businessData: {
        companyName: business.companyName,
        registrationNumber: business.registrationNumber!,
        mccCode: business.mccCode!,
        businessType: business.businessType!,
      },
    };
  }

  return {
    correlationId: faker.datatype.uuid(),
    businessData: {
      companyName: faker.company.name(),
      registrationNumber: faker.datatype.uuid(),
      mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
      businessType: faker.lorem.word(),
    },
  };
};
const getEndUserCounterpartyData = (endUser?: EndUser) => {
  if (endUser) {
    return {
      correlationId: endUser.correlationId!,
      endUserData: {
        firstName: endUser.firstName,
        lastName: endUser.lastName,
      },
    };
  }

  return {
    correlationId: faker.datatype.uuid(),
    endUserData: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    },
  };
};
const getBaseTransactionData = () => {
  const amount = parseFloat(faker.finance.amount());

  return {
    date: faker.date.recent(30),
    amount,
    currency: 'USD',
    baseAmount: amount,
    baseCurrency: 'USD',
    correlationId: faker.datatype.uuid(),
    description: faker.lorem.sentence(),
    category: faker.commerce.product(),
    type: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
    direction: faker.helpers.arrayElement(Object.values(TransactionDirection)),
    reference: faker.lorem.sentence(),
    cardDetails: {
      fingerprint: faker.random.alphaNumeric(16),
      issuedCountry: faker.address.country(),
      completed3ds: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(['credit', 'debit']),
      issuer: faker.company.name(),
      brand: faker.finance.creditCardIssuer(),
      expiryMonth: faker.date.future().getMonth().toString(),
      expiryYear: faker.date.future().getFullYear().toString(),
      holderName: faker.name.fullName(),
      cardBin: Number.parseInt(faker.finance.creditCardNumber().slice(0, 6), 10),
      tokenized: faker.random.alphaNumeric(16),
    },
    payment: {
      brandName: faker.helpers.arrayElement(Object.values(PaymentBrandName)),
      method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
      type: faker.helpers.arrayElement(Object.values(PaymentType)),
      channel: 'channel-1',
      issuer: faker.helpers.arrayElement(Object.values(PaymentIssuer)),
      gateway: faker.helpers.arrayElement(Object.values(PaymentGateway)),
      acquirer: faker.helpers.arrayElement(Object.values(PaymentAcquirer)),
      processor: faker.helpers.arrayElement(Object.values(PaymentProcessor)),
    },
    product: {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      currency: faker.finance.currencyCode(),
      sku: faker.commerce.product(),
      id: faker.datatype.uuid(),
    },
    tags: JSON.stringify(faker.random.words(5).split(' ')),
    regulatoryAuthority: faker.company.name(),
    additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
    originator: getBusinessCounterpartyData(),
    beneficiary: getEndUserCounterpartyData(),
  } as const satisfies TransactionCreateDto;
};

const API_KEY = faker.datatype.uuid();

describe('#TransactionControllerExternal', () => {
  let app: INestApplication;
  let project: Project;
  let customer: Customer;

  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);
  beforeAll(async () => {
    await cleanupDatabase();

    app = await initiateNestApp(
      app,
      [
        ProjectScopeService,
        AlertService,
        AlertRepository,
        AlertDefinitionRepository,
        DataAnalyticsService,
        ConfigService,
      ],
      [TransactionControllerExternal],
      [TransactionModule],
    );
  });
  beforeEach(async () => {
    customer = await createCustomer(
      app.get(PrismaService),
      faker.datatype.uuid(),
      API_KEY,
      '',
      '',
      'webhook-shared-secret',
    );

    project = await createProject(app.get(PrismaService), customer, faker.datatype.uuid());
  });

  describe('POST /', () => {
    it('creates a transaction with business originator and end user beneficiary', async () => {
      // Assert

      const transaction = getBaseTransactionData();

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/')
        .send(transaction)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        correlationId: transaction.correlationId,
      });
      const transactionRecord = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: { transactionCorrelationId: transaction.correlationId, projectId: project.id },
        include: {
          counterpartyOriginator: { include: { business: true } },
          counterpartyBeneficiary: { include: { endUser: true } },
        },
      });
      expect(transactionRecord.id).toEqual(response.body.id);
      expect(transactionRecord.counterpartyOriginator?.business?.companyName).toEqual(
        transaction.originator.businessData.companyName,
      );
      expect(transactionRecord.counterpartyBeneficiary?.endUser?.firstName).toEqual(
        transaction.beneficiary.endUserData.firstName,
      );
    });

    it('creates a transaction and reusing a business as originator and end user as beneficiary', async () => {
      // Arrange
      const business = await app.get(PrismaService).business.create({
        data: generateBusiness({ projectId: project.id }),
      });
      const endUser = await app.get(PrismaService).endUser.create({
        data: generateEndUser({ projectId: project.id }),
      });
      const transaction = {
        ...getBaseTransactionData(),
        originator: getBusinessCounterpartyData(business),
        beneficiary: getEndUserCounterpartyData(endUser),
      } as const satisfies TransactionCreateDto;

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/')
        .send(transaction)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: expect.any(String),
        correlationId: transaction.correlationId,
      });
      const transactionRecord = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: { transactionCorrelationId: transaction.correlationId, projectId: project.id },
        include: {
          counterpartyOriginator: { include: { business: true } },
          counterpartyBeneficiary: { include: { endUser: true } },
        },
      });
      expect(transactionRecord.id).toEqual(response.body.id);
      expect(transactionRecord.counterpartyOriginator?.business?.id).toEqual(business.id);
      expect(transactionRecord.counterpartyBeneficiary?.endUser?.id).toEqual(endUser.id);
    });

    it('returns 400 when validation fails', async () => {
      // Arrange
      const transaction = {
        ...getBaseTransactionData(),
        amount: 'asdsad' as unknown as number, // string instead of number
      } as const satisfies TransactionCreateDto;

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/')
        .send(transaction)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'amount must be a number conforming to the specified constraints.',
            path: 'amount',
          },
        ],
        message: 'Validation error',
        statusCode: 400,
      });
    });
  });

  describe('POST /bulk', () => {
    it('creates a transaction with business originator and end user beneficiary', async () => {
      // Assert

      const transactions = [
        getBaseTransactionData(),
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: BulkStatus.SUCCESS,
          data: { id: expect.any(String), correlationId: expect.any(String) },
        },
      ]);
      const transaction = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: { transactionCorrelationId: transactions[0].correlationId, projectId: project.id },
        include: {
          counterpartyOriginator: { include: { business: true } },
          counterpartyBeneficiary: { include: { endUser: true } },
        },
      });
      expect(transaction.id).toEqual(response.body[0].data.id);
      expect(transaction.counterpartyOriginator?.business?.companyName).toEqual(
        transactions[0].originator.businessData.companyName,
      );
      expect(transaction.counterpartyBeneficiary?.endUser?.firstName).toEqual(
        transactions[0].beneficiary.endUserData.firstName,
      );
    });

    it('creates a transaction and counterparties but with existing business as originator and end user as beneficiary', async () => {
      // Arrange
      const business = await app.get(PrismaService).business.create({
        data: generateBusiness({ projectId: project.id }),
      });
      const endUser = await app.get(PrismaService).endUser.create({
        data: generateEndUser({ projectId: project.id }),
      });
      const transactions = [
        {
          ...getBaseTransactionData(),
          originator: getBusinessCounterpartyData(business),
          beneficiary: getEndUserCounterpartyData(endUser),
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: BulkStatus.SUCCESS,
          data: { id: expect.any(String), correlationId: expect.any(String) },
        },
      ]);
      const transaction = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: { transactionCorrelationId: transactions[0].correlationId, projectId: project.id },
        include: {
          counterpartyOriginator: { include: { business: true } },
          counterpartyBeneficiary: { include: { endUser: true } },
        },
      });
      expect(transaction.id).toEqual(response.body[0].data.id);
      expect(transaction.counterpartyOriginator?.business?.id).toEqual(business.id);
      expect(transaction.counterpartyBeneficiary?.endUser?.id).toEqual(endUser.id);
    });

    it('creates a transaction with existing counterparties', async () => {
      // Arrange
      const business = await app.get(PrismaService).business.create({
        data: generateBusiness({ projectId: project.id }),
      });
      const endUser = await app.get(PrismaService).endUser.create({
        data: generateEndUser({ projectId: project.id }),
      });
      const originator = await app.get(PrismaService).counterparty.create({
        data: {
          businessId: business.id,
          correlationId: business.correlationId!,
          projectId: project.id,
        },
      });
      const beneficiary = await app.get(PrismaService).counterparty.create({
        data: {
          endUserId: endUser.id,
          correlationId: endUser.correlationId!,
          projectId: project.id,
        },
      });
      const transactions = [
        {
          ...getBaseTransactionData(),
          originator: getBusinessCounterpartyData(business),
          beneficiary: getEndUserCounterpartyData(endUser),
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: BulkStatus.SUCCESS,
          data: { id: expect.any(String), correlationId: expect.any(String) },
        },
      ]);
      const transaction = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: { transactionCorrelationId: transactions[0].correlationId, projectId: project.id },
        include: {
          counterpartyOriginator: { include: { business: true } },
          counterpartyBeneficiary: { include: { endUser: true } },
        },
      });
      expect(transaction.id).toEqual(response.body[0].data.id);
      expect(transaction.counterpartyOriginator?.id).toEqual(originator.id);
      expect(transaction.counterpartyBeneficiary?.id).toEqual(beneficiary.id);
    });

    it('creates multiple transactions', async () => {
      // Arrange
      const transactions = Array.from({ length: 5 }, () => getBaseTransactionData());

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(5);

      for (const [i, transaction] of transactions.entries()) {
        expect(response.body[i]).toEqual({
          status: BulkStatus.SUCCESS,
          data: { id: expect.any(String), correlationId: expect.any(String) },
        });
        const transactionRecord = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
          where: {
            transactionCorrelationId: transaction.correlationId,
            projectId: project.id,
          },
        });
        expect(transactionRecord.id).toEqual(response.body[i].data.id);
      }
    });

    it('creates multiple transaction with some failing', async () => {
      // Arrange
      const transaction = getBaseTransactionData();
      const transactions = [transaction, transaction] satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(207);
      expect(response.body).toHaveLength(2);
      const successfulTransaction = (response.body as any[]).find(
        ({ status }) => status === BulkStatus.SUCCESS,
      );

      expect(successfulTransaction).toEqual({
        status: BulkStatus.SUCCESS,
        data: { id: expect.any(String), correlationId: transaction.correlationId },
      });
      const transactionRecord = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
        where: {
          transactionCorrelationId: transaction.correlationId,
          projectId: project.id,
        },
      });
      expect(transactionRecord?.id).toEqual(successfulTransaction.data.id);

      const failedTransaction = (response.body as any[]).find(
        ({ status }) => status === BulkStatus.FAILED,
      );

      expect(failedTransaction).toEqual({
        status: BulkStatus.FAILED,
        error:
          'Another record with the requested (projectId, transactionCorrelationId) already exists',
        data: { correlationId: transaction.correlationId },
      });
    });

    it('returns 400 when validation fails', async () => {
      // Arrange
      const validTransaction = getBaseTransactionData();
      const transactions = [
        ...Array.from({ length: 5 }, () => validTransaction),
        {
          ...validTransaction,
          amount: 'asdsad' as unknown as number, // string instead of number
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errors: [
          {
            message: 'amount must be a number conforming to the specified constraints.',
            path: 'amount',
          },
        ],
        message: 'Validation error',
        statusCode: 400,
      });
    });

    it('returns 400 when counterparty is missing from the body', async () => {
      // Arrange
      const validTransaction = getBaseTransactionData();
      const transactions = [
        {
          ...validTransaction,
          originator: undefined as unknown as TransactionCreateDto['originator'],
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Originator and beneficiary are required.',
      });
    });

    it('returns 400 when counterparty is missing an entity', async () => {
      // Arrange
      const validTransaction = getBaseTransactionData();
      const transactions = [
        {
          ...validTransaction,
          beneficiary: {
            correlationId: faker.datatype.uuid(),
            // Missing endUserData or businessData
          },
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Counterparty must have either business or end user data.',
      });
    });

    it('returns 400 when counterparty has both business and end user', async () => {
      // Arrange
      const validTransaction = getBaseTransactionData();
      const transactions = [
        {
          ...validTransaction,
          originator: getBusinessCounterpartyData(),
          beneficiary: {
            ...getBusinessCounterpartyData(),
            ...getEndUserCounterpartyData(),
          },
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${API_KEY}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        message: 'Counterparty must have either business or end user data.',
      });
    });
  });

  describe('GET /external/transactions/by-alert', () => {
    let customer: Customer;
    let project: Project;
    let alertDefinition: AlertDefinition;

    beforeEach(async () => {
      customer = await createCustomer(
        app.get(PrismaService),
        faker.datatype.uuid(),
        API_KEY,
        '',
        '',
        'webhook-shared-secret',
      );
      project = await createProject(app.get(PrismaService), customer, faker.datatype.uuid());
    });

    const getAlertDefinitionWithTimeOptions = (timeUnit: string, timeAmount: number) => ({
      inlineRule: {
        fnName: faker.helpers.arrayElement([
          'evaluateMerchantGroupAverage',
          'evaluateHighTransactionTypePercentage',
          'evaluateTransactionsAgainstDynamicRules',
          'evaluateMultipleMerchantsOneCounterparty',
          'evaluateDormantAccount',
        ]),
        options: {
          timeUnit,
          timeAmount,
        },
      },
    });

    const createTransactionWithDate = async (daysAgo: number) => {
      const currentDate = new Date();

      await createTransactionRecord(app.get(PrismaService), project, {
        date: new Date(currentDate.getTime() - daysAgo * 24 * 60 * 60 * 1000),
      });
    };

    it('returns transactions associated with the given alertId', async () => {
      alertDefinition = await createAlertDefinition(
        project.id,
        getAlertDefinitionWithTimeOptions('days', 7) as any,
      );
      const alert = await createAlert(project.id, alertDefinition);

      await Promise.all([
        // 5 transactions in the past 7 days
        createTransactionWithDate(1),
        createTransactionWithDate(3),
        createTransactionWithDate(5),
        createTransactionWithDate(6),
        createTransactionWithDate(7),
        // 5 transactions in the past 10-20 days
        createTransactionWithDate(10),
        createTransactionWithDate(13),
        createTransactionWithDate(16),
        createTransactionWithDate(18),
        createTransactionWithDate(20),
      ]);

      const response = await request(app.getHttpServer())
        .get(`/external/transactions/by-alert?alertId=${alert.id}`)
        .set('authorization', `Bearer ${API_KEY}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(5);
    });
    it('returns 404 when alertId is not found', async () => {
      const nonExistentAlertId = faker.datatype.uuid();
      const response = await request(app.getHttpServer())
        .get(`/external/transactions/by-alert?alertId=${nonExistentAlertId}`)
        .set('authorization', `Bearer ${API_KEY}`);

      expect(response.status).toBe(404);
    });

    it('returns empty array when no transactions match the alert criteria', async () => {
      alertDefinition = await createAlertDefinition(
        project.id,
        getAlertDefinitionWithTimeOptions('days', 1) as any,
      );
      const alert = await createAlert(project.id, alertDefinition);

      // Create a transaction older than the alert criteria
      await createTransactionRecord(app.get(PrismaService), project, {
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      });

      const response = await request(app.getHttpServer())
        .get(`/external/transactions/by-alert?alertId=${alert.id}`)
        .set('authorization', `Bearer ${API_KEY}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns 403 when using an API key from a different project', async () => {
      const otherCustomer = await createCustomer(
        app.get(PrismaService),
        faker.datatype.uuid(),
        API_KEY,
        '',
        '',
        'other-webhook-secret',
      );
      const otherProject = await createProject(
        app.get(PrismaService),
        otherCustomer,
        faker.datatype.uuid(),
      );

      alertDefinition = await createAlertDefinition(
        otherProject.id,
        getAlertDefinitionWithTimeOptions('days', 7) as any,
      );

      const alert = await createAlert(otherProject.id, alertDefinition);

      const response = await request(app.getHttpServer())
        .get(`/external/transactions/by-alert?alertId=${alert.id}`)
        .set('authorization', `Bearer OTHER_API_KEY`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Unauthorized');
    });

    it('returns transactions within the specified time range of the alert', async () => {
      const fifteenDaysAgo = new Date(Date.now() - 15 * 24 * 60 * 60 * 1000);
      const tenDaysAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
      const fiveDaysAgo = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000);

      // Create transactions at different times
      await createTransactionRecord(app.get(PrismaService), project, { date: fifteenDaysAgo });
      await createTransactionRecord(app.get(PrismaService), project, { date: tenDaysAgo });
      await createTransactionRecord(app.get(PrismaService), project, { date: fiveDaysAgo });

      alertDefinition = await createAlertDefinition(
        project.id,
        getAlertDefinitionWithTimeOptions('days', 15) as any,
      );

      const alert = await createAlert(project.id, alertDefinition);

      const response = await request(app.getHttpServer())
        .get(`/external/transactions/by-alert?alertId=${alert.id}`)
        .set('authorization', `Bearer ${API_KEY}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(3);

      // Verify that all returned transactions are within the last 15 days
      response.body.forEach((transaction: any) => {
        expect(new Date(transaction.transactionDate).getTime()).toBeGreaterThanOrEqual(
          fifteenDaysAgo.getTime(),
        );
        expect(new Date(transaction.transactionDate).getTime()).toBeLessThanOrEqual(Date.now());
      });
    });
  });
});
