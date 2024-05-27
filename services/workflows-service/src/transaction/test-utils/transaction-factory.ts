import {
  PaymentAcquirer,
  PaymentBrandName,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  TransactionDirection,
  TransactionRecordType,
  Prisma,
} from '@prisma/client';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/prisma/prisma.service';

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
    transactionDate: faker.helpers.arrayElement([faker.date.past(1), faker.date.recent(30)]),
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

const createBusinessCounterparty = async ({
  prismaService,
  projectId,
  correlationIdFn,
}: {
  prismaService: PrismaService;
  projectId: string;
  correlationIdFn?: (...args: any[]) => string;
}) => {
  const correlationId = correlationIdFn ? correlationIdFn() : faker.datatype.uuid();

  return await prismaService.counterparty.create({
    data: {
      project: { connect: { id: projectId } },
      correlationId,
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
  });
};

export const createEndUserCounterparty = async ({
  prismaService,
  projectId,
  correlationIdFn,
}: {
  prismaService: PrismaService;
  projectId: string;
  correlationIdFn?: (...args: any[]) => string;
}) => {
  const correlationId = correlationIdFn ? correlationIdFn() : faker.datatype.uuid();

  return await prismaService.counterparty.create({
    data: {
      project: { connect: { id: projectId } },
      correlationId,
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
  });
};

type TransactionCreateData = Parameters<
  InstanceType<typeof PrismaService>['transactionRecord']['create']
>[0]['data'];

export class TransactionFactory {
  readonly prisma: PrismaService;

  number;

  data: Partial<TransactionCreateData>;

  runBeforeCreate: Array<() => Promise<void>>;

  projectId: string;

  constructor({
    prisma,
    number = 1,
    data = {},
    runBeforeCreate = [],
    projectId,
  }: {
    prisma: PrismaService;
    projectId: string;
    number?: number;
    data?: Partial<TransactionCreateData>;
    runBeforeCreate?: Array<() => Promise<void>>;
  }) {
    this.prisma = prisma;
    this.number = number;
    this.data = data;
    this.runBeforeCreate = runBeforeCreate;
    this.projectId = projectId;
  }

  public clone() {
    return new TransactionFactory({
      prisma: this.prisma,
      number: this.number,
      data: this.data,
      runBeforeCreate: [...this.runBeforeCreate],
      projectId: this.projectId,
    });
  }

  public count(number: number) {
    const factory = this.clone();

    factory.number = number;

    return factory;
  }

  public paymentMethod(paymentMethod: PaymentMethod) {
    const factory = this.clone();

    factory.data.paymentMethod = paymentMethod;

    return factory;
  }

  public type(type: TransactionRecordType) {
    const factory = this.clone();

    factory.data.transactionType = type;

    return factory;
  }

  public direction(direction: TransactionDirection) {
    const factory = this.clone();

    factory.data.transactionDirection = direction;

    return factory;
  }

  public withBusinessOriginator({ correlationIdFn }: { correlationIdFn?: () => string } = {}) {
    const factory = this.clone();

    factory.runBeforeCreate.push(async () => {
      const counterparty = await createBusinessCounterparty({
        prismaService: this.prisma,
        projectId: this.projectId,
        correlationIdFn,
      });

      factory.data.counterpartyOriginator = {
        connect: { id: counterparty.id },
      };
    });

    return factory;
  }

  public withBusinessBeneficiary({ correlationIdFn }: { correlationIdFn?: () => string } = {}) {
    const factory = this.clone();

    factory.runBeforeCreate.push(async () => {
      const counterparty = await createBusinessCounterparty({
        prismaService: this.prisma,
        projectId: this.projectId,
        correlationIdFn,
      });

      factory.data.counterpartyBeneficiary = {
        connect: { id: counterparty.id },
      };
    });

    return factory;
  }

  public withEndUserBeneficiary() {
    const factory = this.clone();

    factory.runBeforeCreate.push(async () => {
      const counterparty = await createEndUserCounterparty({
        prismaService: this.prisma,
        projectId: this.projectId,
      });

      factory.data.counterpartyBeneficiary = {
        connect: { id: counterparty.id },
      };
    });

    return factory;
  }

  public withEndUserOriginator({ correlationIdFn }: { correlationIdFn?: () => string } = {}) {
    const factory = this.clone();

    factory.runBeforeCreate.push(async () => {
      const counterparty = await createEndUserCounterparty({
        prismaService: this.prisma,
        projectId: this.projectId,
        correlationIdFn,
      });

      factory.data.counterpartyOriginator = {
        connect: { id: counterparty.id },
      };
    });

    return factory;
  }

  public withCounterpartyOriginator(id: string) {
    const factory = this.clone();

    factory.data.counterpartyOriginator = {
      connect: { id },
    };

    return factory;
  }

  public withCounterpartyBeneficiary(id: string) {
    const factory = this.clone();

    factory.data.counterpartyBeneficiary = {
      connect: { id },
    };

    return factory;
  }

  public transactionDate(transactionDate: Date) {
    const factory = this.clone();

    factory.data.transactionDate = transactionDate;

    return factory;
  }

  public amount(amount: number) {
    const factory = this.clone();

    factory.data.transactionBaseAmount = amount;
    factory.data.transactionAmount = amount;

    return factory;
  }

  async create(overrideData: Partial<TransactionCreateData> = {}) {
    for (const runBeforeCreate of this.runBeforeCreate) {
      await runBeforeCreate();
    }
    const promiseArray = new Array(this.number).fill(null).map(async () => {
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
