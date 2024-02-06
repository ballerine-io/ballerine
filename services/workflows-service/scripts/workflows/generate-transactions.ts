import {
  PrismaClient,
  TransactionRecordType,
  TransactionRecordStatus,
  Prisma,
  VerificationStatus,
} from '@prisma/client';
import { faker } from '@faker-js/faker';

export const generateTransactions = async (
  prismaClient: PrismaClient,
  {
    projectId,
  }: {
    projectId: string;
  },
) => {
  const transactions = [] as any;

  for (let i = 0; i < 1000; i++) {
    const transaction: Prisma.TransactionRecordCreateManyInput = {
      transactionCorrelationId: faker.datatype.uuid(),
      transactionDate: faker.date.recent(30),
      transactionAmount: parseFloat(faker.finance.amount()),
      transactionCurrency: faker.finance.currencyCode(),
      transactionDescription: faker.lorem.sentence(),
      transactionCategory: faker.commerce.product(),
      transactionType: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
      transactionStatus: faker.helpers.arrayElement(Object.values(TransactionRecordStatus)),
      transactionStatusReason: faker.lorem.sentence(),
      senderAccountId: faker.finance.account(),
      senderName: faker.name.fullName(),
      senderCountry: faker.address.country(),
      senderIpAddress: faker.internet.ip(),
      senderGeoLocation: faker.address.latitude() + ', ' + faker.address.longitude(),
      senderUserAgent: faker.internet.userAgent(),
      senderPEPStatus: faker.random.word(),
      senderSanctionListMatchStatus: faker.random.word(),
      senderVerificationStatus: faker.helpers.arrayElement(Object.values(VerificationStatus)),
      recipientAccountId: faker.finance.account(),
      recipientName: faker.name.fullName(),
      recipientCountry: faker.address.country(),
      recipientVerificationStatus: faker.helpers.arrayElement(Object.values(VerificationStatus)),
      recipientSanctionListMatchStatus: faker.random.word(),
      recipientPEPStatus: faker.random.word(),
      paymentMethod: faker.finance.transactionType(),
      paymentType: faker.random.word(),
      paymentChannel: faker.company.name(),
      paymentIssuer: faker.company.name(),
      paymentGateway: faker.internet.domainName(),
      paymentAcquirer: faker.company.name(),
      paymentProcessor: faker.company.name(),
      cardFingerprint: faker.random.alphaNumeric(16),
      cardIssuedCountry: faker.address.countryCode(),
      completed3ds: faker.datatype.boolean(),
      cardType: 'credit',
      cardIssuer: faker.company.name(),
      cardBrand: faker.lorem.word(),
      cardExpiryMonth: faker.date.month(),
      cardExpiryYear: faker.datatype.datetime().getFullYear().toString(),
      cardHolderName: faker.name.fullName(),
      cardTokenized: faker.random.alphaNumeric(16),
      tags: JSON.stringify(faker.random.words(5).split(' ')),
      reviewStatus: faker.lorem.word(),
      reviewerComments: faker.lorem.sentence(),
      auditTrail: JSON.stringify({ action: faker.lorem.word(), date: faker.date.recent() }),
      unusualActivityFlags: JSON.stringify({ flag: faker.lorem.word() }),
      riskScore: faker.datatype.float({ min: 0, max: 100 }),
      regulatoryAuthority: faker.company.name(),
      additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
      productName: faker.commerce.productName(),
      productDescription: faker.commerce.productDescription(),
      productPrice: parseFloat(faker.commerce.price()),
      productId: faker.datatype.uuid(),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      projectId,
      senderCorrelationId: faker.datatype.uuid(),
      recipientCorrelationId: faker.datatype.uuid(),
    };

    transactions.push(transaction);
  }

  await prismaClient.transactionRecord.createMany({
    data: transactions,
    skipDuplicates: true,
  });

  return transactions;
};
