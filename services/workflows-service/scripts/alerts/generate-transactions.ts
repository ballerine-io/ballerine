import {
  CounterpartyType,
  PaymentAcquirer,
  PaymentChannel,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  PrismaClient,
  ReviewStatus,
  TransactionDirection,
  TransactionRecordStatus,
  TransactionRecordType,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

export const generateTransactions = async (
  prismaClient: PrismaClient,
  {
    projectId,
    businessId,
  }: {
    projectId: string;
    businessId: string;
  },
) => {
  // Create counterparties and collect their IDs
  const counterpartyIds = await prismaClient.$transaction(async prisma => {
    const ids = [] as string[];
    for (let i = 0; i < 200; i++) {
      const counterparty = await prisma.counterparty.create({
        data: {
          id: faker.datatype.uuid(),
          correlationId: faker.datatype.uuid(),
          type: faker.helpers.arrayElement(Object.values(CounterpartyType)),
          businessId: businessId,
          projectId: projectId,
        },
      });
      ids.push(counterparty.id);
    }
    return ids;
  });

  // Create transactions with a random counterparty ID for each
  for (let i = 0; i < 1000; i++) {
    const randomCounterpartyId = faker.helpers.arrayElement(counterpartyIds);

    await prismaClient.transactionRecord.create({
      data: {
        transactionCorrelationId: faker.datatype.uuid(),
        transactionDate: faker.date.recent(30),
        transactionAmount: parseFloat(faker.finance.amount()),
        transactionCurrency: faker.finance.currencyCode(),
        transactionBaseAmount: parseFloat(faker.finance.amount()),
        transactionBaseCurrency: faker.finance.currencyCode(),
        transactionDescription: faker.lorem.sentence(),
        transactionCategory: faker.commerce.product(),
        transactionType: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
        transactionStatus: faker.helpers.arrayElement(Object.values(TransactionRecordStatus)),
        transactionStatusReason: faker.lorem.sentence(),
<<<<<<< HEAD
        transactionDirection: faker.helpers.arrayElement(Object.values(TransactionDirection)),
=======
        paymentBrandName: faker.finance.accountName(),
>>>>>>> origin/alonp/feat/tm
        paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
        paymentType: faker.helpers.arrayElement(Object.values(PaymentType)),
        paymentChannel: faker.helpers.arrayElement(Object.values(PaymentChannel)),
        paymentIssuer: faker.helpers.arrayElement(Object.values(PaymentIssuer)),
        paymentGateway: faker.helpers.arrayElement(Object.values(PaymentGateway)),
        paymentAcquirer: faker.helpers.arrayElement(Object.values(PaymentAcquirer)),
        paymentProcessor: faker.helpers.arrayElement(Object.values(PaymentProcessor)),
        cardFingerprint: faker.random.alphaNumeric(16),
        cardIssuedCountry: faker.address.countryCode(),
        completed3ds: faker.datatype.boolean(),
        cardType: faker.helpers.arrayElement(['credit', 'debit']),
        cardIssuer: faker.company.name(),
        cardBrand: faker.finance.creditCardIssuer(),
        cardExpiryMonth: faker.date.future().getMonth().toString(),
        cardExpiryYear: faker.date.future().getFullYear().toString(),
        cardHolderName: faker.name.fullName(),
        cardTokenized: faker.random.alphaNumeric(16),
        tags: JSON.stringify(faker.random.words(5).split(' ')),
        reviewStatus: faker.helpers.arrayElement(Object.values(ReviewStatus)),
        reviewerComments: faker.lorem.sentence(),
        auditTrail: JSON.stringify({ action: faker.lorem.word(), date: faker.date.recent() }),
        unusualActivityFlags: JSON.stringify({ flag: faker.lorem.word() }),
        riskScore: faker.datatype.number({ min: 0, max: 100 }),
        regulatoryAuthority: faker.company.name(),
        additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
        productName: faker.commerce.productName(),
        productDescription: faker.commerce.productDescription(),
        productPrice: parseFloat(faker.commerce.price()),
        productId: faker.datatype.uuid(),
        projectId,
        counterpartyOriginatorId: randomCounterpartyId, // Assign a random counterparty ID
        originatorSortCode: faker.finance.routingNumber(),
        originatorBankCountry: faker.address.countryCode(),
        transactionDirection: faker.helpers.arrayElement([
          TransactionDirection.Inbound,
          TransactionDirection.Outbound,
        ]),
        businessId,
      },
    });
  }
};
