import {
  PrismaClient,
  Project,
  TransactionRecordType,
  TransactionDirection,
  PaymentBrandName,
  PaymentMethod,
  PaymentType,
  PaymentIssuer,
  PaymentGateway,
  PaymentAcquirer,
  PaymentProcessor,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { TransactionRepository } from '../../transaction/transaction.repository';
import { TransactionCreateDto } from '../../transaction/dtos/transaction-create.dto';
import { TransactionService } from '../../transaction/transaction.service';
import { AppLoggerService } from '../../common/app-logger/app-logger.service';
import { SentryService } from '../../sentry/sentry.service';
import { PrismaService } from '../../prisma/prisma.service';
import { Test } from '@nestjs/testing';
import { ClsModule } from 'nestjs-cls';
import { ProjectScopeService } from '@/project/project-scope.service';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';

export const createTransactionRecord = async (
  prisma: PrismaClient,
  project: Project,
  overrides: Partial<Omit<TransactionCreateDto, 'projectId'>> = {},
) => {
  const moduleRef = await Test.createTestingModule({
    imports: [
      ClsModule.forRoot({
        global: true,
        middleware: { mount: true },
      }),
    ],
    providers: [
      ClsModule,
      AppLoggerService,
      SentryService,
      TransactionRepository,
      DataAnalyticsService,
      TransactionService,
      ProjectScopeService,
      {
        provide: PrismaService,
        useValue: prisma,
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

  const transactionService = moduleRef.get<TransactionService>(TransactionService);

  const transactionCreateDto: Omit<TransactionCreateDto, 'projectId'> = {
    date: faker.date.recent(),
    amount: faker.datatype.number({ min: 1, max: 1000 }),
    currency: faker.finance.currencyCode(),
    baseAmount: faker.datatype.number({ min: 1, max: 1000 }),
    baseCurrency: faker.finance.currencyCode(),
    correlationId: faker.datatype.uuid(),
    description: faker.lorem.sentence(),
    category: faker.commerce.department(),
    direction: faker.helpers.arrayElement(Object.values(TransactionDirection)),
    reference: faker.finance.accountName(),
    tags: faker.helpers.arrayElement([null, { tag1: 'value1', tag2: 'value2' }]),
    type: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
    additionalInfo: {},
    originator: {
      correlationId: faker.datatype.uuid(),
      sortCode: faker.finance.accountName(),
      bankCountry: faker.address.countryCode(),
      businessData: {
        companyName: faker.company.name(),
        registrationNumber: faker.finance.account(8),
      },
    },
    beneficiary: {
      correlationId: faker.datatype.uuid(),
      sortCode: faker.finance.accountName(),
      bankCountry: faker.address.countryCode(),
      endUserData: {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
    },
    payment: {
      method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
      type: faker.helpers.arrayElement(Object.values(PaymentType)),
      channel: faker.helpers.arrayElement(['online', 'in-store', 'mobile']),
      issuer: faker.helpers.arrayElement(Object.values(PaymentIssuer)),
      gateway: faker.helpers.arrayElement(Object.values(PaymentGateway)),
      acquirer: faker.helpers.arrayElement(Object.values(PaymentAcquirer)),
      processor: faker.helpers.arrayElement(Object.values(PaymentProcessor)),
      brandName: faker.helpers.arrayElement(Object.values(PaymentBrandName)),
      mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
    },
    product: {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price(100)),
      id: faker.datatype.uuid(),
      sku: faker.commerce.product(),
      currency: faker.finance.currencyCode(),
    },
    cardDetails: {
      fingerprint: faker.random.alphaNumeric(16),
      issuedCountry: faker.address.countryCode(),
      completed3ds: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(['credit', 'debit']),
      issuer: faker.company.name(),
      brand: faker.helpers.arrayElement(['Visa', 'Mastercard', 'Amex']),
      expiryMonth: faker.date.future().getMonth().toString().padStart(2, '0'),
      expiryYear: faker.date.future().getFullYear().toString(),
      holderName: faker.name.findName(),
      tokenized: faker.random.alphaNumeric(24),
      cardBin: parseInt(faker.finance.creditCardNumber().slice(0, 6)),
    },
    regulatoryAuthority: faker.company.name(),
    ...overrides,
  };

  // Use createBulk to create the transaction
  const createdTransactions = await transactionService.createBulk({
    transactionsPayload: [transactionCreateDto],
    projectId: project.id,
  });

  return createdTransactions;
};
