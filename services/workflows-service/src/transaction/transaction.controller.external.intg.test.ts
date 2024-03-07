import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomer } from '@/test/helpers/create-customer';
import {
  Business,
  Customer,
  EndUser,
  PaymentAcquirer,
  PaymentBrandName,
  PaymentChannel,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  Project,
  ReviewStatus,
  TransactionDirection,
  TransactionRecordStatus,
  TransactionRecordType,
} from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';
import { TransactionModule } from '@/transaction/transaction.module';
import { TransactionControllerExternal } from '@/transaction/transaction.controller.external';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create.dto';
import { generateBusiness, generateEndUser } from '../../scripts/generate-end-user';
import { TransactionRepository } from '@/transaction/transaction.repository';

const getBaseTransactionData = (): TransactionCreateDto => {
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
    status: faker.helpers.arrayElement(Object.values(TransactionRecordStatus)),
    statusReason: faker.lorem.sentence(),
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
      channel: faker.helpers.arrayElement(Object.values(PaymentChannel)),
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
    reviewStatus: faker.helpers.arrayElement(Object.values(ReviewStatus)),
    reviewerComments: faker.lorem.sentence(),
    auditTrail: JSON.stringify({ action: faker.lorem.word(), date: faker.date.recent() }),
    unusualActivityFlags: JSON.stringify({ flag: faker.lorem.word() }),
    riskScore: faker.datatype.number({ min: 0, max: 100 }),
    regulatoryAuthority: faker.company.name(),
    additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
  };
};
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

describe('#TransactionControllerExternal', () => {
  let app: INestApplication;
  let project: Project;
  let customer: Customer;

  beforeAll(cleanupDatabase);
  afterEach(tearDownDatabase);
  beforeAll(async () => {
    await cleanupDatabase();

    app = await initiateNestApp(app, [], [TransactionControllerExternal], [TransactionModule]);
  });
  beforeEach(async () => {
    customer = await createCustomer(
      app.get(PrismaService),
      faker.datatype.uuid(),
      faker.datatype.uuid(),
      '',
      '',
      'webhook-shared-secret',
    );

    project = await createProject(app.get(PrismaService), customer, faker.datatype.uuid());
  });

  describe('POST /', () => {
    it('creates a transaction with business originator and end user beneficiary', async () => {
      // Assert
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transaction = {
        ...getBaseTransactionData(),
        originator: getBusinessCounterpartyData(),
        beneficiary: getEndUserCounterpartyData(),
      } as const satisfies TransactionCreateDto;

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/')
        .send(transaction)
        .set('authorization', `Bearer ${apiKey}`);

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
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
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
        .set('authorization', `Bearer ${apiKey}`);

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
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transaction = {
        ...getBaseTransactionData(),
        amount: 'asdsad' as unknown as number, // string instead of number
      } as const satisfies TransactionCreateDto;

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/')
        .send(transaction)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [expect.any(String)],
      });
    });
  });

  describe('POST /bulk', () => {
    it('creates a transaction with business originator and end user beneficiary', async () => {
      // Assert
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transactions = [
        {
          ...getBaseTransactionData(),
          originator: getBusinessCounterpartyData(),
          beneficiary: getEndUserCounterpartyData(),
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: 201,
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
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
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
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: 201,
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
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
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
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: 201,
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

    it('creates a transaction with no counterparties', async () => {
      // Arrange
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transactions = [
        getBaseTransactionData(),
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toEqual([
        {
          status: 201,
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
      expect(transaction.counterpartyOriginator).toBeNull();
      expect(transaction.counterpartyBeneficiary).toBeNull();
    });

    it('creates multiple transactions', async () => {
      // Arrange
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transactions = Array.from({ length: 5 }, () => getBaseTransactionData());

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveLength(5);
      for (const [i, transaction] of transactions.entries()) {
        expect(response.body[i]).toEqual({
          status: 201,
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
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transactions = Array.from({ length: 5 }, () =>
        getBaseTransactionData(),
      ) satisfies TransactionCreateDto[];
      // mock TransactionRepository.create to throw an error when the correlationId is 'should-fail'
      const createSpy = jest.spyOn(app.get(TransactionRepository), 'create');
      createSpy.mockImplementationOnce(() => {
        throw new Error('Failed to create transaction');
      });

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(207);
      expect(response.body).toHaveLength(5);
      const failedTransaction = (response.body as any[]).find(tx => tx.status !== 201);
      const successfulTransactions = (response.body as any[]).filter(tx => tx.status === 201);
      for (const transaction of successfulTransactions) {
        expect(transaction).toEqual({
          status: 201,
          data: { id: expect.any(String), correlationId: expect.any(String) },
        });
        const transactionRecord = await app.get(PrismaService).transactionRecord.findFirstOrThrow({
          where: {
            transactionCorrelationId: transaction.data.correlationId,
            projectId: project.id,
          },
        });
        expect(transactionRecord.id).toEqual(transaction.data.id);
      }
      expect(failedTransaction).toEqual({
        status: 500,
        error: expect.any(String),
        data: { correlationId: expect.any(String) },
      });
    });

    it('returns 400 when validation fails', async () => {
      // Arrange
      const apiKey = (customer.authenticationConfiguration as { authValue: string }).authValue;
      const transactions = [
        ...Array.from({ length: 5 }, () => getBaseTransactionData()),
        {
          ...getBaseTransactionData(),
          amount: 'asdsad' as unknown as number, // string instead of number
        },
      ] as const satisfies readonly TransactionCreateDto[];

      // Act
      const response = await request(app.getHttpServer())
        .post('/external/transactions/bulk')
        .send(transactions)
        .set('authorization', `Bearer ${apiKey}`);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        statusCode: 400,
        error: 'Bad Request',
        message: [expect.any(String)],
      });
    });
  });
});
