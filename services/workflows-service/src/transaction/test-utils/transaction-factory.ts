import {
  PaymentAcquirer,
  PaymentBrandName,
  PaymentChannel,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  TransactionDirection,
  TransactionRecordType,
  Prisma,
  Project,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

const getNestedCounterpartyBusinessData = ({
  projectId,
}: {
  projectId: string;
}): Prisma.CounterpartyCreateNestedOneWithoutOriginatingTransactionsInput => {
  const correlationId = faker.datatype.uuid();

  return {
    create: {
      project: { connect: { id: projectId } },
      correlationId: correlationId,
      business: {
        create: {
          correlationId,
          companyName: faker.company.name(),
          registrationNumber: faker.datatype.uuid(),
          mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
          businessType: faker.lorem.word(),
          project: { connect: { id: projectId } },
        },
      },
    },
  };
};

const getNestedCounterpartyEndUserData = ({
  projectId,
}: {
  projectId: string;
}): Prisma.CounterpartyCreateNestedOneWithoutOriginatingTransactionsInput => {
  const correlationId = faker.datatype.uuid();

  return {
    create: {
      project: { connect: { id: projectId } },
      correlationId: correlationId,
      endUser: {
        create: {
          correlationId,
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
          email: faker.internet.email(),
          phone: faker.phone.number(),
          project: { connect: { id: projectId } },
        },
      },
    },
  };
};
const getTransactionCreateData = ({ projectId }: { projectId: string }): TransactionCreateData => {
  const amount = parseFloat(faker.finance.amount());

  return {
    transactionBaseAmount: amount,
    transactionAmount: amount,
    transactionCurrency: 'USD',
    transactionBaseCurrency: 'USD',
    transactionDate: faker.date.recent(30),
    transactionCorrelationId: faker.datatype.uuid(),
    transactionDescription: faker.lorem.sentence(),
    transactionCategory: faker.commerce.product(),
    transactionType: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
    transactionDirection: faker.helpers.arrayElement(Object.values(TransactionDirection)),
    transactionReference: faker.lorem.sentence(),

    cardFingerprint: faker.random.alphaNumeric(16),
    cardIssuedCountry: faker.address.country(),
    completed3ds: faker.datatype.boolean(),
    cardType: faker.helpers.arrayElement(['credit', 'debit']),
    cardIssuer: faker.company.name(),
    cardBrand: faker.finance.creditCardIssuer(),
    cardExpiryMonth: faker.date.future().getMonth().toString(),
    cardExpiryYear: faker.date.future().getFullYear().toString(),
    cardHolderName: faker.name.fullName(),
    cardBin: Number.parseInt(faker.finance.creditCardNumber().slice(0, 6), 10),
    cardTokenized: faker.random.alphaNumeric(16),

    paymentMethod: faker.helpers.arrayElement(Object.values(PaymentMethod)),
    paymentType: faker.helpers.arrayElement(Object.values(PaymentType)),
    paymentChannel: faker.helpers.arrayElement(Object.values(PaymentChannel)),
    paymentIssuer: faker.helpers.arrayElement(Object.values(PaymentIssuer)),
    paymentGateway: faker.helpers.arrayElement(Object.values(PaymentGateway)),
    paymentAcquirer: faker.helpers.arrayElement(Object.values(PaymentAcquirer)),
    paymentProcessor: faker.helpers.arrayElement(Object.values(PaymentProcessor)),
    paymentBrandName: faker.helpers.arrayElement(Object.values(PaymentBrandName)),

    productName: faker.commerce.productName(),
    productDescription: faker.commerce.productDescription(),
    productPrice: parseFloat(faker.commerce.price()),
    productPriceCurrency: faker.finance.currencyCode(),
    productId: faker.datatype.uuid(),
    productSku: faker.commerce.product(),

    regulatoryAuthority: faker.company.name(),
    additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
    tags: JSON.stringify(faker.random.words(5).split(' ')),

    counterpartyOriginator: faker.helpers.arrayElement([
      getNestedCounterpartyEndUserData({ projectId }),
      getNestedCounterpartyBusinessData({ projectId }),
    ]),
    counterpartyBeneficiary: faker.helpers.arrayElement([
      getNestedCounterpartyEndUserData({ projectId }),
      getNestedCounterpartyBusinessData({ projectId }),
    ]),

    project: { connect: { id: projectId } },
  };
};

type TransactionCreateData = Parameters<
  InstanceType<typeof PrismaService>['transactionRecord']['create']
>[0]['data'];

@Injectable()
export class TransactionFactory {
  private number = 1;

  private data: Partial<TransactionCreateData> = {};

  private runBeforeCreate: Array<() => Promise<void>> = [];

  private projectId!: string;

  constructor(private readonly prisma: PrismaService) {}

  project(project: Project) {
    this.projectId = project.id;

    return this;
  }

  count(number: number) {
    this.number = number;

    return this;
  }

  public paymentMethod(paymentMethod: PaymentMethod) {
    this.data.paymentMethod = paymentMethod;

    return this;
  }

  public withBusinessOriginator() {
    this.runBeforeCreate.push(async () => {
      const correlationId = faker.datatype.uuid();

      const counteryparty = await this.prisma.counterparty.create({
        data: {
          project: { connect: { id: this.projectId } },
          correlationId: correlationId,
          business: {
            create: {
              correlationId: correlationId,
              companyName: faker.company.name(),
              registrationNumber: faker.datatype.uuid(),
              mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
              businessType: faker.lorem.word(),
              project: { connect: { id: this.projectId } },
            },
          },
        },
      });

      this.data.counterpartyOriginator = {
        connect: { id: counteryparty.id },
      };
    });

    return this;
  }

  public withEndUserBeneficiary() {
    this.runBeforeCreate.push(async () => {
      const correlationId = faker.datatype.uuid();

      const counteryparty = await this.prisma.counterparty.create({
        data: {
          project: { connect: { id: this.projectId } },
          correlationId: correlationId,
          endUser: {
            create: {
              correlationId: correlationId,
              firstName: faker.name.firstName(),
              lastName: faker.name.lastName(),
              email: faker.internet.email(),
              phone: faker.phone.number(),
              project: { connect: { id: this.projectId } },
            },
          },
        },
      });

      this.data.counterpartyBeneficiary = {
        connect: { id: counteryparty.id },
      };
    });

    return this;
  }

  public transactionDate(transactionDate: Date) {
    this.data.transactionDate = transactionDate;

    return this;
  }

  public amount(amount: number) {
    this.data.transactionBaseAmount = amount;
    this.data.transactionAmount = amount;

    return this;
  }

  async create(overrideData: Partial<TransactionCreateData> = {}) {
    for (const runBeforeCreate of this.runBeforeCreate) {
      await runBeforeCreate();
    }

    const promiseArray = new Array(this.number).fill(null).map(() => {
      return this.prisma.transactionRecord.create({
        data: {
          ...getTransactionCreateData({ projectId: this.projectId }),
          ...this.data,
          ...overrideData,
        } as TransactionCreateData,
      });
    });

    return await Promise.all(promiseArray);
  }
}
