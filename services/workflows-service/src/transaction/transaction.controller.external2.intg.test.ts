import {
  getAlertDefinitionCreateData,
  ALERT_DEFINITIONS,
} from './../../scripts/alerts/generate-alerts';
import request from 'supertest';
import { cleanupDatabase, tearDownDatabase } from '@/test/helpers/database-helper';
import { INestApplication } from '@nestjs/common';
import { initiateNestApp } from '@/test/helpers/nest-app-helper';
import { faker } from '@faker-js/faker';
import { PrismaService } from '@/prisma/prisma.service';
import { createCustomer } from '@/test/helpers/create-customer';
import { createAlert } from '@/test/helpers/create-alert';
import { createTransactionRecord } from '@/test/helpers/create-transaction-record';
import { createAlertDefinition } from '@/test/helpers/create-alert-definition';
import {
  AlertDefinition,
  Business,
  Counterparty,
  Customer,
  EndUser,
  PaymentAcquirer,
  PaymentBrandName,
  PaymentGateway,
  PaymentIssuer,
  PaymentMethod,
  PaymentProcessor,
  PaymentType,
  Project,
  TransactionDirection,
  TransactionRecordType,
} from '@prisma/client';
import { createProject } from '@/test/helpers/create-project';
import { TransactionModule } from '@/transaction/transaction.module';
import { TransactionControllerExternal } from '@/transaction/transaction.controller.external';
import { TransactionCreateDto } from '@/transaction/dtos/transaction-create.dto';
import { generateBusiness, generateEndUser } from '../../scripts/generate-end-user';
import { BulkStatus } from '@/alert/types';
import { ProjectScopeService } from '@/project/project-scope.service';
import { AlertRepository } from '@/alert/alert.repository';
import { AlertDefinitionRepository } from '@/alert-definition/alert-definition.repository';
import { DataAnalyticsService } from '@/data-analytics/data-analytics.service';
import { ConfigService } from '@nestjs/config';
import { AlertService } from '@/alert/alert.service';
import { TransactionFactory } from './test-utils/transaction-factory';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

const getBusinessCounterpartyData = (business?: Business) => {
  if (business) {
    return {
      correlationId: business.correlationId!,
      businessData: {
        companyName: business.companyName,
        registrationNumber: business.registrationNumber!,
        mccCode: business.mccCode!,
        businessType: business.businessType!,
      },
    };
  }

  return {
    correlationId: faker.datatype.uuid(),
    businessData: {
      companyName: faker.company.name(),
      registrationNumber: faker.datatype.uuid(),
      mccCode: faker.datatype.number({ min: 1000, max: 9999 }),
      businessType: faker.lorem.word(),
    },
  };
};
const getEndUserCounterpartyData = (endUser?: EndUser) => {
  if (endUser) {
    return {
      correlationId: endUser.correlationId!,
      endUserData: {
        firstName: endUser.firstName,
        lastName: endUser.lastName,
      },
    };
  }

  return {
    correlationId: faker.datatype.uuid(),
    endUserData: {
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
    },
  };
};
const getBaseTransactionData = () => {
  const amount = parseFloat(faker.finance.amount());

  return {
    date: faker.date.recent(30),
    amount,
    currency: 'USD',
    baseAmount: amount,
    baseCurrency: 'USD',
    correlationId: faker.datatype.uuid(),
    description: faker.lorem.sentence(),
    category: faker.commerce.product(),
    type: faker.helpers.arrayElement(Object.values(TransactionRecordType)),
    direction: faker.helpers.arrayElement(Object.values(TransactionDirection)),
    reference: faker.lorem.sentence(),
    cardDetails: {
      fingerprint: faker.random.alphaNumeric(16),
      issuedCountry: faker.address.country(),
      completed3ds: faker.datatype.boolean(),
      type: faker.helpers.arrayElement(['credit', 'debit']),
      issuer: faker.company.name(),
      brand: faker.finance.creditCardIssuer(),
      expiryMonth: faker.date.future().getMonth().toString(),
      expiryYear: faker.date.future().getFullYear().toString(),
      holderName: faker.name.fullName(),
      cardBin: Number.parseInt(faker.finance.creditCardNumber().slice(0, 6), 10),
      tokenized: faker.random.alphaNumeric(16),
    },
    payment: {
      brandName: faker.helpers.arrayElement(Object.values(PaymentBrandName)),
      method: faker.helpers.arrayElement(Object.values(PaymentMethod)),
      type: faker.helpers.arrayElement(Object.values(PaymentType)),
      channel: 'channel-1',
      issuer: faker.helpers.arrayElement(Object.values(PaymentIssuer)),
      gateway: faker.helpers.arrayElement(Object.values(PaymentGateway)),
      acquirer: faker.helpers.arrayElement(Object.values(PaymentAcquirer)),
      processor: faker.helpers.arrayElement(Object.values(PaymentProcessor)),
    },
    product: {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      currency: faker.finance.currencyCode(),
      sku: faker.commerce.product(),
      id: faker.datatype.uuid(),
    },
    tags: JSON.stringify(faker.random.words(5).split(' ')),
    regulatoryAuthority: faker.company.name(),
    additionalInfo: JSON.stringify({ note: faker.lorem.sentence() }),
    originator: getBusinessCounterpartyData(),
    beneficiary: getEndUserCounterpartyData(),
  } as const satisfies TransactionCreateDto;
};

const API_KEY = 'FAKE_API_KEY';

describe('#TransactionControllerExternal', () => {
  let app: INestApplication;

  afterAll(tearDownDatabase);

  beforeAll(async () => {
    await cleanupDatabase();

    app = await initiateNestApp(
      app,
      [
        PrismaService,
        ProjectScopeService,
        AlertService,
        AlertRepository,
        DataAnalyticsService,
        ConfigService,
        AlertDefinitionRepository,
        AppLoggerService,
        {
          provide: AlertRepository,
          useClass: AlertRepository,
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
      [TransactionControllerExternal],
      [TransactionModule],
    );
  });

  describe('GET /external/transactions/by-alert', () => {
    let customer: Customer;
    let project: Project;
    let alertDefinition: AlertDefinition;
    let baseTransactionFactory: TransactionFactory;

    beforeAll(async () => {
      customer = await createCustomer(
        app.get(PrismaService),
        faker.datatype.uuid(),
        API_KEY,
        '',
        '',
        'webhook-shared-secret',
      );
      project = await createProject(app.get(PrismaService), customer, faker.datatype.uuid());

      baseTransactionFactory = new TransactionFactory({
        prisma: app.get(PrismaService),
        projectId: project.id,
      })
        .paymentMethod(PaymentMethod.credit_card)
        .transactionDate(faker.date.recent(6));
    });

    describe('investigation transactions by alert', () => {
      let alertDefinition: AlertDefinition;
      let prismaService: PrismaService;

      beforeAll(async () => {
        prismaService = app.get(PrismaService);

        alertDefinition = await prismaService.alertDefinition.create({
          data: getAlertDefinitionCreateData(ALERT_DEFINITIONS.PAY_HCA_CC, project, undefined, {
            crossEnvKey: faker.datatype.uuid(),
          }),
        });

        expect(
          ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold,
        ).toBeGreaterThanOrEqual(1000);

        expect(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.direction).toBe(
          TransactionDirection.inbound,
        );
      });

      it.only('returns transactions associated with the given alertId', async () => {
        // Arrange
        await baseTransactionFactory
          .withBusinessBeneficiary()
          .direction(TransactionDirection.inbound)
          .paymentMethod(PaymentMethod.credit_card)
          .amount(ALERT_DEFINITIONS.PAY_HCA_CC.inlineRule.options.amountThreshold + 1)
          .count(1)
          .create();

        // Act
        await app.get(AlertService).checkAllAlerts();

        // Assert
        const alerts = await app.get(PrismaService).alert.findMany({
          where: { alertDefinitionId: alertDefinition.id, projectId: project.id },
        });
        if (alerts.length === 0 || alerts[0] === undefined) {
          throw new Error('No alerts found');
        }
        expect(alerts).toHaveLength(1);
        expect(alerts[0]?.alertDefinitionId).toEqual(alertDefinition.id);
        expect(alerts[0] as any).toMatchObject({
          executionDetails: { executionRow: { transactionCount: '1', totalAmount: 1001 } },
        });

        console.log('Alert log: ', alerts[0].id);

        const response = await request(app.getHttpServer())
          .get(`/api/v1/external/transactions/by-alert?alertId=${alerts[0].id}`)
          .set('Authorization', `Bearer ${API_KEY}`);

        expect(response.status).toBe(200);
        console.log(response.body);
        expect(response.body).toMatchInlineSnapshot();
      });
    });
  });
});
