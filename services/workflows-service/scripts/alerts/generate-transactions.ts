import {
  PaymentAcquirer,
  PaymentBrandName,
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
import { generateBusiness, generateEndUser } from '../generate-end-user';

const PaymentChannel = {
  online: 'online',
  mobile_app: 'mobile_app',
  in_store: 'in_store',
  telephone: 'telephone',
  mail_order: 'mail_order',
};

export const generateTransactions = async (
  prismaClient: PrismaClient,
  {
    projectId,
  }: {
    projectId: string;
  },
) => {
  // Create counterparties and collect their IDs
  const counterpartyIds = await prismaClient.$transaction(async prisma => {
    const businessCounterparties: string[] = [];
    const endUserCounterparties: string[] = [];

    for (let i = 0; i < 100; i++) {
      const correlationId = faker.datatype.uuid();
      const counterparty = await prisma.counterparty.create({
        data: {
          correlationId: correlationId,
          project: { connect: { id: projectId } },
          business: {
            create: generateBusiness({
              correlationId,
              projectId,
            }),
          },
        },
      });

      businessCounterparties.push(counterparty.id);
    }
    for (let i = 0; i < 100; i++) {
      const correlationId = faker.datatype.uuid();
      const counterparty = await prisma.counterparty.create({
        data: {
          correlationId: correlationId,
          project: { connect: { id: projectId } },
          endUser: {
            create: generateEndUser({
              correlationId,
              projectId,
            }),
          },
        },
      });

      endUserCounterparties.push(counterparty.id);
    }

    return { endUserCounterparties, businessCounterparties };
  });

  const ids: Array<{
    counterpartyOriginatorId?: string;
    counterpartyBeneficiaryId?: string;
  }> = [];

  // Create transactions with a random counterparty ID for each
  for (let i = 0; i < 1000; i++) {
    const businessIdCounterpartyIdOrBoth = {
      counterpartyOriginatorId: faker.helpers.arrayElement(counterpartyIds.endUserCounterparties),
      counterpartyBeneficiaryId: faker.helpers.arrayElement(counterpartyIds.businessCounterparties),
    };

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
