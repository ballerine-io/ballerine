import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { evaluateTransactionsAgainstDynamicRules } from './evaluate-transactions-against-dynamic-rules';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { ClsService } from 'nestjs-cls';

describe.only('TransactionRulesEvaluationService', () => {
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { useClass: WinstonLogger, provide: 'LOGGER' },
        ClsService,
        AppLoggerService,
        PrismaService,
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    await prismaService.customer.create({
      data: {
        id: 'customer-id',
        name: 'customer-name',
        displayName: 'customer-display-name',
        logoImageUri: 'customer-logo-image-uri',
      },
    });
    await prismaService.project.create({
      data: {
        id: 'project-id',
        name: 'project-name',
        customer: { connect: { id: 'customer-id' } },
      },
    });

    await prismaService.counterparty.create({
      data: {
        id: 'counterparty-1',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });

    await prismaService.counterparty.create({
      data: {
        id: 'counterparty-2',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });
  });

  afterEach(async () => {
    // Clean up the database after each test
    // await prismaService.transactionRecord.deleteMany();
  });

  it('should correctly evaluate transactions against dynamic rules', async () => {
    await prismaService.transactionRecord.createMany({
      data: [
        {
          transactionDirection: 'Inbound',
          counterpartyOriginatorId: 'counterparty-1',
          paymentMethod: 'CreditCard',
          transactionDate: new Date(),
          transactionAmount: 500,
          transactionCorrelationId: 'correlation-id-1',
          transactionCurrency: 'USD',
          transactionBaseAmount: 500,
          transactionBaseCurrency: 'USD',
          projectId: 'project-id',
        },
        {
          transactionDirection: 'Inbound',
          counterpartyOriginatorId: 'counterparty-1',
          paymentMethod: 'CreditCard',
          transactionDate: new Date(),
          transactionAmount: 500,
          transactionCorrelationId: 'correlation-id-2',
          transactionCurrency: 'USD',
          transactionBaseAmount: 500,
          transactionBaseCurrency: 'USD',
          projectId: 'project-id',
        },
        {
          transactionDirection: 'Inbound',
          counterpartyOriginatorId: 'counterparty-2',
          paymentMethod: 'CreditCard',
          transactionDate: new Date(),
          transactionAmount: 500,
          transactionCorrelationId: 'correlation-id-3',
          transactionCurrency: 'USD',
          transactionBaseAmount: 500,
          transactionBaseCurrency: 'USD',
          projectId: 'project-id',
        },
      ],
    });
    // Act: Execute the function with specific parameters
    const results = await evaluateTransactionsAgainstDynamicRules({
      direction: 'Inbound',
      excludedCounterpartyIds: ['excluded-counterparty-1'],
      paymentMethods: ['CreditCard'],
      excludePaymentMethods: false,
      days: 7,
      amountThreshold: 700,
    });

    console.log('Results:');
    console.log(results);

    // Assert: Verify the results are as expected
    expect(results as any[]).toBeDefined();
    expect((results as any[]).length).toBeGreaterThan(0);
    (results as any[]).forEach(
      (transaction: {
        transactionAmount: any;
        counterpartyOriginatorId: any;
        paymentMethod: any;
      }) => {
        expect(transaction.transactionAmount).toBeGreaterThan(100);
        expect(transaction.counterpartyOriginatorId).not.toBe('excluded-counterparty-1');
        expect(transaction.paymentMethod).toBe('CreditCard');
      },
    );
  });

  // Add more tests as needed for different scenarios
});
