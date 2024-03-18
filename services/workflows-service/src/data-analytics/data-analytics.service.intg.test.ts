import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '@/prisma/prisma.service';
import { WinstonLogger } from '@/common/utils/winston-logger/winston-logger';
import { PaymentMethod, TransactionDirection } from '@prisma/client';
import { DataAnalyticsService } from './data-analytics.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { commonTestingModules } from '@/test/helpers/nest-app-helper';
import { ALERT_DEFINITIONS } from '../../scripts/alerts/generate-alerts';

const PROJECT_ID = 'project-id';

describe('TransactionRulesEvaluationService', () => {
  let prismaService: PrismaService;
  let dataAnalyticsService: DataAnalyticsService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: commonTestingModules,
      providers: [
        { useClass: WinstonLogger, provide: 'LOGGER' },
        DataAnalyticsService,
        ProjectScopeService,
        PrismaService,
      ],
    }).compile();

    prismaService = module.get<PrismaService>(PrismaService);
    dataAnalyticsService = module.get<DataAnalyticsService>(DataAnalyticsService);

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
        id: PROJECT_ID,
        name: 'project-name',
        customer: { connect: { id: 'customer-id' } },
      },
    });
    await prismaService.business.create({
      data: {
        id: 'business-id-1',
        companyName: 'business-name-1',
        projectId: PROJECT_ID,
      },
    });
    await prismaService.business.create({
      data: {
        id: 'business-id-2',
        companyName: 'business-name-2',
        projectId: PROJECT_ID,
      },
    });

    // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
    async function createCounterParty(
      prismaService: PrismaService,
      id: string,
      projectId: string,
      businessId?: string,
    ) {
      await prismaService.counterparty.create({
        data: {
          id,
          project: { connect: { id: projectId } },
          business: { connect: { id: businessId || 'business-id-1' } },
        },
      });
    }

    await createCounterParty(prismaService, 'counterparty-1', PROJECT_ID);
    await createCounterParty(prismaService, 'counterparty-2', PROJECT_ID);
    await createCounterParty(prismaService, '9999999999999999', PROJECT_ID);
    await createCounterParty(prismaService, '999999******9999', PROJECT_ID);
    await createCounterParty(prismaService, 'counterparty-3', PROJECT_ID);
    await createCounterParty(prismaService, 'counterparty-4', PROJECT_ID);

    await prismaService.transactionRecord.createMany({
      data: [
        {
          transactionDirection: TransactionDirection.inbound,
          counterpartyOriginatorId: 'counterparty-1',
          counterpartyBeneficiaryId: 'counterparty-2',
          paymentMethod: PaymentMethod.credit_card,
          transactionDate: new Date(),
          transactionAmount: 500,
          transactionCorrelationId: 'correlation-id-1',
          transactionCurrency: 'USD',
          transactionBaseAmount: 505,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        },
        {
          transactionDirection: TransactionDirection.inbound,
          counterpartyOriginatorId: 'counterparty-1',
          counterpartyBeneficiaryId: 'counterparty-2',
          paymentMethod: PaymentMethod.credit_card,
          transactionDate: new Date(),
          transactionAmount: 505,
          transactionCorrelationId: 'correlation-id-2',
          transactionCurrency: 'USD',
          transactionBaseAmount: 500,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        },
        {
          transactionDirection: 'inbound',
          counterpartyOriginatorId: 'counterparty-1',
          counterpartyBeneficiaryId: 'counterparty-2',
          paymentMethod: PaymentMethod.credit_card,
          transactionDate: new Date(),
          transactionAmount: 1005,
          transactionCorrelationId: 'correlation-id-3',
          transactionCurrency: 'USD',
          transactionBaseAmount: 1005,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        },
        {
          transactionDirection: 'inbound',
          counterpartyOriginatorId: 'counterparty-2',
          counterpartyBeneficiaryId: 'counterparty-1',
          paymentMethod: PaymentMethod.credit_card,
          transactionDate: new Date(),
          transactionAmount: 1500,
          transactionCorrelationId: 'correlation-id-4',
          transactionCurrency: 'USD',
          transactionBaseAmount: 1500,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        },
      ],
    });
  });

  // it('should correctly evaluate inbound credit card transactions excluding specified counterparties and exceeding amount threshold', async () => {
  //   const amountThreshold = 700;
  //   const results = await dataAnalyticsService.evaluateTransactionsAgainstDynamicRules({
  //     projectId: PROJECT_ID,
  //     direction: 'inbound',
  //     excludedCounterpartyIds: ['excluded-counterparty-1'],
  //     paymentMethods: [PaymentMethod.credit_card],
  //     excludePaymentMethods: false,
  //     days: 7,
  //     amountThreshold: amountThreshold,
  //   });

  //   console.log('Results:');
  //   console.log(results);

  //   // Assert: Verify the results are as expected
  //   expect(results as any[]).toBeDefined();
  //   expect((results as any[]).length).toBeGreaterThan(0);
  //   (results as any[]).forEach(
  //     (hit: { totalAmount: any; counterpartyOriginatorId: any; paymentMethod: any }) => {
  //       expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
  //       expect(hit.counterpartyOriginatorId).not.toBe('excluded-counterparty-1');
  //     },
  //   );
  // });

  // describe('evaluate inbound credit card transactions', () => {
  //   const transactionIdsForCleanup: string[] = [];

  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   beforeEach(async () => {
  //     const transactionsSeeds = [
  //       { id: 'transaction-id-1', counterpartyOriginatorId: '9999999999999999' },
  //       { id: 'transaction-id-2', counterpartyOriginatorId: '999999******9999' },
  //     ];

  //     await prismaService.transactionRecord.createMany({
  //       data: transactionsSeeds.map(({ id, counterpartyOriginatorId }, index) => ({
  //         id,
  //         transactionDirection: 'inbound',
  //         counterpartyOriginatorId,
  //         paymentMethod: PaymentMethod.credit_card,
  //         transactionDate: new Date(),
  //         transactionAmount: 1500,
  //         transactionCorrelationId: `correlation-id-temp-${index}`,
  //         transactionCurrency: 'USD',
  //         transactionBaseAmount: 1500,
  //         transactionBaseCurrency: 'USD',
  //         projectId: PROJECT_ID,
  //       })),
  //     });

  //     transactionIdsForCleanup.push(...transactionsSeeds.map(({ id }) => id));
  //   });

  //   afterAll(async () => {
  //     await prismaService.transactionRecord.deleteMany({
  //       where: { id: { in: transactionIdsForCleanup } },
  //     });
  //   });

  //   it('should correctly evaluate inbound credit card transactions excluding specific counterparties and exceeding amount threshold', async () => {
  //     // Assert
  //     const amountThreshold = 1000;

  //     // Act
  //     const creditCardResults = await dataAnalyticsService.evaluateTransactionsAgainstDynamicRules({
  //       projectId: PROJECT_ID,
  //       direction: 'inbound',
  //       excludedCounterpartyIds: ['9999999999999999', '999999******9999'],
  //       paymentMethods: [PaymentMethod.credit_card],
  //       excludePaymentMethods: false,
  //       days: 7,
  //       amountThreshold: amountThreshold,
  //     });

  //     // Assert
  //     expect(creditCardResults as any[]).toBeDefined();
  //     expect((creditCardResults as any[]).length).toBeGreaterThan(0);
  //     (creditCardResults as any[]).forEach(hit => {
  //       expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
  //       expect(hit.counterpartyOriginatorId).not.toBe('9999999999999999');
  //       expect(hit.counterpartyOriginatorId).not.toBe('999999******9999');
  //     });
  //   });
  // });

  // describe('evaluate inbound non-credit card transactions', () => {
  //   const transactionIdsForCleanup: string[] = [];

  //   // eslint-disable-next-line @typescript-eslint/no-empty-function
  //   beforeEach(async () => {
  //     const transactionsSeeds = [
  //       {
  //         id: 'transaction-id-1',
  //         counterpartyOriginatorId: '9999999999999999',
  //         paymentMethod: PaymentMethod.credit_card,
  //       },
  //       {
  //         id: 'transaction-id-2',
  //         counterpartyOriginatorId: '999999******9999',
  //         paymentMethod: PaymentMethod.bank_transfer,
  //       },
  //       {
  //         id: 'transaction-id-3',
  //         counterpartyOriginatorId: 'counterparty-3',
  //         paymentMethod: PaymentMethod.bank_transfer,
  //         amount: 500,
  //       },
  //       {
  //         id: 'transaction-id-4',
  //         counterpartyOriginatorId: 'counterparty-4',
  //         paymentMethod: PaymentMethod.bank_transfer,
  //         amount: 500,
  //       },
  //     ];
  //     await prismaService.transactionRecord.createMany({
  //       data: transactionsSeeds.map(
  //         ({ id, counterpartyOriginatorId, paymentMethod, amount }, index) => ({
  //           id,
  //           transactionDirection: TransactionDirection.inbound,
  //           counterpartyOriginatorId,
  //           paymentMethod: paymentMethod || PaymentMethod.debit_card, // Assume these are non-credit card payment methods. Adjust as necessary.
  //           transactionDate: new Date(),
  //           transactionAmount: amount || 1500,
  //           transactionCorrelationId: `correlation-id-temp-${index}`,
  //           transactionCurrency: 'USD',
  //           transactionBaseAmount: 1500,
  //           transactionBaseCurrency: 'USD',
  //           projectId: PROJECT_ID,
  //         }),
  //       ),
  //     });
  //     transactionIdsForCleanup.push(...transactionsSeeds.map(({ id }) => id));
  //   });

  //   afterAll(async () => {
  //     await prismaService.transactionRecord.deleteMany({
  //       where: { id: { in: transactionIdsForCleanup } },
  //     });
  //   });

  //   it('should correctly evaluate inbound non-credit card transactions excluding specific counterparties and exceeding amount threshold', async () => {
  //     // Assert
  //     const amountThreshold = 1000;

  //     // Act: Execute the function with specific parameters for non-credit card transactions
  //     const nonCreditCardResults =
  //       await dataAnalyticsService.evaluateTransactionsAgainstDynamicRules({
  //         projectId: PROJECT_ID,
  //         direction: 'inbound',
  //         excludedCounterpartyIds: ['9999999999999999', '999999******9999'],
  //         paymentMethods: [
  //           PaymentMethod.debit_card,
  //           PaymentMethod.bank_transfer,
  //           PaymentMethod.pay_pal,
  //         ], // Assume these are non-credit card payment methods. Adjust as necessary.
  //         excludePaymentMethods: true, // Set to true if you're excluding these payment methods, otherwise set to false.
  //         days: 7,
  //         amountThreshold: amountThreshold,
  //       });

  //     // Assert: Verify the results for non-credit card transactions
  //     expect(nonCreditCardResults as any[]).toBeDefined();
  //     expect((nonCreditCardResults as any[]).length).toBeGreaterThan(0);
  //     (nonCreditCardResults as any[]).forEach(hit => {
  //       expect(hit.totalAmount).toBeGreaterThan(amountThreshold);
  //       expect(hit.counterpartyOriginatorId).not.toBe('9999999999999999');
  //       expect(hit.counterpartyOriginatorId).not.toBe('999999******9999');
  //     });
  //   });
  // });

  describe('Rule ID: PAY_HCA', () => {
    const transactionIdsForCleanup: string[] = [];

    afterAll(async () => {
      await prismaService.transactionRecord.deleteMany({
        where: { id: { in: transactionIdsForCleanup } },
      });
    });

    describe.only('', () => {
      const transactionIdsForCleanup: string[] = [];

      // eslint-disable-next-line @typescript-eslint/no-empty-function
      beforeAll(async () => {
        const transactionsSeeds = [
          {
            id: 'transaction-id-1',
            counterpartyBeneficiaryId: '9999999999999999',
            paymentMethod: PaymentMethod.credit_card,
          },
          {
            id: 'transaction-id-2',
            counterpartyBeneficiaryId: '999999******9999',
            paymentMethod: PaymentMethod.bank_transfer,
          },
        ];

        const data1 = Array.from({ length: 10 }).map((_, index) => ({
          id: `id-${index}`,
          transactionDirection: TransactionDirection.inbound,
          counterpartyBeneficiaryId: '9999999999999999',
          paymentMethod: PaymentMethod.debit_card, // Assume these are non-credit card payment methods. Adjust as necessary.
          transactionDate: new Date(),
          transactionAmount: 555,
          transactionCorrelationId: `correlation-id-tmp-${index}`,
          transactionCurrency: 'USD',
          transactionBaseAmount: 555,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        }));

        const data2 = transactionsSeeds.map(
          ({ id, counterpartyBeneficiaryId, paymentMethod }, index) => ({
            id,
            transactionDirection: TransactionDirection.inbound,
            counterpartyBeneficiaryId,
            paymentMethod: paymentMethod || PaymentMethod.debit_card, // Assume these are non-credit card payment methods. Adjust as necessary.
            transactionDate: new Date(),
            transactionAmount: 555,
            transactionCorrelationId: `correlation-id-temp-${index}`,
            transactionCurrency: 'USD',
            transactionBaseAmount: 555,
            transactionBaseCurrency: 'USD',
            projectId: PROJECT_ID,
          }),
        );

        const data3 = Array.from({ length: 10 }).map((_, index) => ({
          id: `id-data2-${index}`,
          transactionDirection: TransactionDirection.inbound,
          counterpartyBeneficiaryId: ['counterparty-1', 'counterparty-2'][index % 2],
          paymentMethod: PaymentMethod.debit_card,
          transactionDate: new Date(),
          transactionAmount: 990 * index * 10,
          transactionCorrelationId: `temp-${index}`,
          transactionCurrency: 'USD',
          transactionBaseAmount: 990 * index * 10,
          transactionBaseCurrency: 'USD',
          projectId: PROJECT_ID,
        }));

        await prismaService.transactionRecord.createMany({
          data: [...data1, ...data2, ...data3],
        });

        transactionIdsForCleanup.concat([...data1, ...data2, ...data3].map(({ id }) => id));
      });

      describe('should correctly evaluate sum of incoming transactions over a set period of time is greater than a limit of', () => {
        it('credit card.', async () => {
          // Assert
          const rule = ALERT_DEFINITIONS.PAY_HCA_CC;
          expect(rule).toBeDefined();

          // Act
          const results = await dataAnalyticsService.evaluateTransactionsAgainstDynamicRules({
            ...rule?.inlineRule.options,
            projectId: PROJECT_ID,
          });

          // Assert
          expect(results as any[]).toBeDefined();
          expect((results as any[]).length).toBeGreaterThan(0);

          expect(results).toMatchObject([
            {
              counterpartyBeneficiaryId: 'counterparty-1',
              totalAmount: 1500,
              transactionCount: 1n,
            },
            {
              counterpartyBeneficiaryId: 'counterparty-2',
              totalAmount: 2010,
              transactionCount: 3n,
            },
          ]);
        });

        it('non credit card.', async () => {
          // Assert
          const rule = ALERT_DEFINITIONS.PAY_HCA_APM;
          expect(rule).toBeDefined();

          // Act
          const results = await dataAnalyticsService.evaluateTransactionsAgainstDynamicRules({
            ...rule?.inlineRule.options,
            projectId: PROJECT_ID,
          });

          // Assert
          expect(results as any[]).toBeDefined();
          expect((results as any[]).length).toBeGreaterThan(0);

          expect(results).toMatchObject([
            {
              counterpartyBeneficiaryId: 'counterparty-1',
              totalAmount: 198000,
              transactionCount: 5n,
            },
            {
              counterpartyBeneficiaryId: 'counterparty-2',
              totalAmount: 247500,
              transactionCount: 5n,
            },
          ]);
        });
      });
    });
  });
});
