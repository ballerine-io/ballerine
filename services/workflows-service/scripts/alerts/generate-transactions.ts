import {
  Business,
  EndUser,
  PaymentAcquirer,
  PaymentBrandName,
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
    business,
    endUser,
  }: {
    projectId: string;
    business: Business;
    endUser: EndUser;
  },
) => {
  // Create counterparties and collect their IDs
  const counterpartyIds = await prismaClient.$transaction(async prisma => {
    const ids: string[] = [];

    for (let i = 0; i < 200; i++) {
      const entityType = faker.helpers.arrayElement(['business', 'endUser']);
      const counterparty = await prisma.counterparty.create({
        data: {
          id: faker.datatype.uuid(),
          correlationId: entityType === 'business' ? business.correlationId : endUser.correlationId,
          businessId: entityType === 'business' ? business.id : undefined,
          endUserId: entityType === 'endUser' ? endUser.id : undefined,
          projectId: projectId,
        },
      });

      ids.push(counterparty.id);
    }

    return ids;
  });

  const ids: Array<{
    counterpartyOriginatorId?: string;
    counterpartyBeneficiaryId?: string;
  }> = [];

  // Create transactions with a random counterparty ID for each
  for (let i = 0; i < 1000; i++) {
    const getRandomCounterpartyId = () => faker.helpers.arrayElement(counterpartyIds);
    const businessIdCounterpartyIdOrBoth = faker.helpers.arrayElement([
      {},
      {
        counterpartyOriginatorId: getRandomCounterpartyId(),
      },
      {
        counterpartyBeneficiaryId: getRandomCounterpartyId(),
      },
      {
        counterpartyOriginatorId: getRandomCounterpartyId(),
        counterpartyBeneficiaryId: getRandomCounterpartyId(),
      },
    ]);

    ids.push(businessIdCounterpartyIdOrBoth);

    await prismaClient.transactionRecord.create({
      data: {
        transactionCorrelationId: faker.datatype.uuid(),
        transactionDate: faker.date.recent(30),
        transactionAmount: parseFloat(faker.finance.amount()),
        transactionCurrency: faker.finance.currencyCode(),
        transactionBaseAmount: parseFloat(faker.finance.amount()),
        transactionBaseCurrency: 'USD',
        transactionDescription: faker.lorem.sentence(),
        transactionCategory: faker.commerce.product(),
        transactionType: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
        transactionStatus: faker.helpers.arrayElement(Object.values(TransactionRecordStatus)),
        transactionStatusReason: faker.lorem.sentence(),
        transactionDirection: faker.helpers.arrayElement(Object.values(TransactionDirection)),
        transactionReference: faker.lorem.sentence(),
        paymentBrandName: faker.helpers.arrayElement(Object.values(PaymentBrandName)),
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
        cardBin: Number.parseInt(faker.finance.creditCardNumber().slice(0, 6), 10),
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
        productPriceCurrency: faker.finance.currencyCode(),
        productSku: faker.commerce.product(),
        productId: faker.datatype.uuid(),
        originatorSortCode: faker.finance.routingNumber(),
        originatorBankCountry: faker.address.countryCode(),
        originatorGeoLocation: faker.address.countryCode(),
        originatorIpAddress: faker.internet.ip(),
        originatorUserAgent: faker.internet.userAgent(),
        ...businessIdCounterpartyIdOrBoth,
        projectId,
      },
    });
  }

  return ids;
};
