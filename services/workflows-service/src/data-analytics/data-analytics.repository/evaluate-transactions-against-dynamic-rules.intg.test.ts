import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { evaluateTransactionsAgainstDynamicRules } from './evaluate-transactions-against-dynamic-rules';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { ClsService } from 'nestjs-cls';

describe('TransactionRulesEvaluationService', () => {
  let prismaService: PrismaService;
  let transactionIdsForCleanup: string[] = [];

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
    await prismaService.counterparty.create({
      data: {
        id: '9999999999999999',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });
    await prismaService.counterparty.create({
      data: {
        id: '999999******9999',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });
    await prismaService.counterparty.create({
      data: {
        id: 'counterparty-3',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });
    await prismaService.counterparty.create({
      data: {
        id: 'counterparty-4',
        type: 'Individual',
        project: { connect: { id: 'project-id' } },
      },
    });
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
          transactionAmount: 1500,
          transactionCorrelationId: 'correlation-id-3',
          transactionCurrency: 'USD',
          transactionBaseAmount: 1500,
          transactionBaseCurrency: 'USD',
          projectId: 'project-id',
        },
      ],
    });
  });

  beforeEach(async () => {});

  afterEach(async () => {
    await prismaService.transactionRecord.deleteMany({
      where: { id: { in: transactionIdsForCleanup } },
    });
  });

  it('should correctly evaluate inbound credit card transactions excluding specified counterparties and exceeding amount threshold', async () => {
    const amountThreshold = 700;
    const results = await evaluateTransactionsAgainstDynamicRules({
      direction: 'Inbound',
      excludedCounterpartyIds: ['excluded-counterparty-1'],
      paymentMethods: ['CreditCard'],
      excludePaymentMethods: false,
      days: 7,
      amountThreshold: amountThreshold,
    });

    console.log('Results:');
    console.log(results);

    // Assert: Verify the results are as expected
    expect(results as any[]).toBeDefined();
    expect((results as any[]).length).toBeGreaterThan(0);
    (results as any[]).forEach(
      (hit: { totalAmount: any; counterpartyOriginatorId: any; paymentMethod: any }) => {
        expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
        expect(hit.counterpartyOriginatorId).not.toBe('excluded-counterparty-1');
      },
    );
  });

  it('should correctly evaluate inbound credit card transactions excluding specific counterparties and exceeding amount threshold', async () => {
    // Assert
    const amountThreshold = 1000;
    const transactionsSeeds = [
      { id: 'transaction-id-1', counterpartyOriginatorId: '9999999999999999' },
      { id: 'transaction-id-2', counterpartyOriginatorId: '999999******9999' },
    ];
    await prismaService.transactionRecord.createMany({
      data: transactionsSeeds.map(({ id, counterpartyOriginatorId }, index) => ({
        id,
        transactionDirection: 'Inbound',
        counterpartyOriginatorId,
        paymentMethod: 'CreditCard',
        transactionDate: new Date(),
        transactionAmount: 1500,
        transactionCorrelationId: `correlation-id-temp-${index}`,
        transactionCurrency: 'USD',
        transactionBaseAmount: 1500,
        transactionBaseCurrency: 'USD',
        projectId: 'project-id',
      })),
    });
    transactionIdsForCleanup.push(...transactionsSeeds.map(({ id }) => id));

    // Act
    const creditCardResults = await evaluateTransactionsAgainstDynamicRules({
      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],
      paymentMethods: ['CreditCard'],
      excludePaymentMethods: false,
      days: 7,
      amountThreshold: amountThreshold,
    });

    // Assert
    expect(creditCardResults as any[]).toBeDefined();
    expect((creditCardResults as any[]).length).toBeGreaterThan(0);
    (creditCardResults as any[]).forEach(hit => {
      expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
      expect(hit.counterpartyOriginatorId).not.toBe('9999999999999999');
      expect(hit.counterpartyOriginatorId).not.toBe('999999******9999');
    });
  });

  it('should correctly evaluate inbound non-credit card transactions excluding specific counterparties and exceeding amount threshold', async () => {
    const amountThreshold = 1000; // Example threshold
    // Assert
    const transactionsSeeds = [
      {
        id: 'transaction-id-1',
        counterpartyOriginatorId: '9999999999999999',
        paymentMethod: 'CreditCard',
      },
      {
        id: 'transaction-id-2',
        counterpartyOriginatorId: '999999******9999',
        paymentMethod: 'BankTransfer',
      },
      {
        id: 'transaction-id-3',
        counterpartyOriginatorId: 'counterparty-3',
        paymentMethod: 'BankTransfer',
        amount: 500,
      },
      {
        id: 'transaction-id-4',
        counterpartyOriginatorId: 'counterparty-4',
        paymentMethod: 'BankTransfer',
        amount: 500,
      },
    ];
    await prismaService.transactionRecord.createMany({
      data: transactionsSeeds.map(
        ({ id, counterpartyOriginatorId, paymentMethod, amount }, index) => ({
          id,
          transactionDirection: 'Inbound',
          counterpartyOriginatorId,
          paymentMethod: paymentMethod || 'DebitCard', // Assume these are non-credit card payment methods. Adjust as necessary.
          transactionDate: new Date(),
          transactionAmount: amount || 1500,
          transactionCorrelationId: `correlation-id-temp-${index}`,
          transactionCurrency: 'USD',
          transactionBaseAmount: 1500,
          transactionBaseCurrency: 'USD',
          projectId: 'project-id',
        }),
      ),
    });
    transactionIdsForCleanup.push(...transactionsSeeds.map(({ id }) => id));

    // Act: Execute the function with specific parameters for non-credit card transactions
    const nonCreditCardResults = await evaluateTransactionsAgainstDynamicRules({
      direction: 'Inbound',
      excludedCounterpartyIds: ['9999999999999999', '999999******9999'],
      paymentMethods: ['DebitCard', 'BankTransfer', 'PayPal'], // Assume these are non-credit card payment methods. Adjust as necessary.
      excludePaymentMethods: true, // Set to true if you're excluding these payment methods, otherwise set to false.
      days: 7,
      amountThreshold: amountThreshold,
    });

    // Assert: Verify the results for non-credit card transactions
    expect(nonCreditCardResults as any[]).toBeDefined();
    expect((nonCreditCardResults as any[]).length).toBeGreaterThan(0);
    (nonCreditCardResults as any[]).forEach(hit => {
      expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
      expect(hit.counterpartyOriginatorId).not.toBe('9999999999999999');
      expect(hit.counterpartyOriginatorId).not.toBe('999999******9999');
    });
  });
});
