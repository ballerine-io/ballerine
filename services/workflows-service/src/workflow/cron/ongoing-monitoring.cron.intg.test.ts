import { Test } from '@nestjs/testing';
import { OngoingMonitoringCron } from './ongoing-monitoring.cron';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Business, Project } from '@prisma/client';
import {
  FEATURE_LIST,
  TCustomerWithFeatures,
  TOngoingMerchantReportOptions,
} from '@/customer/types';
import { BusinessReportService } from '@/business-report/business-report.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowService } from '@/workflow/workflow.service';
import {
  MERCHANT_REPORT_STATUSES_MAP,
  MERCHANT_REPORT_TYPES_MAP,
  MERCHANT_REPORT_VERSIONS_MAP,
} from '@/business-report/constants';
import { MerchantMonitoringClient } from '@/business-report/merchant-monitoring-client';

describe('OngoingMonitoringCron', () => {
  let service: OngoingMonitoringCron;
  let prismaService: PrismaService;
  let customerService: CustomerService;
  let businessService: BusinessService;
  let loggerService: AppLoggerService;
  let businessReportService: BusinessReportService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OngoingMonitoringCron,
        MerchantMonitoringClient,
        { provide: PrismaService, useValue: mockPrismaService() },
        { provide: AppLoggerService, useValue: mockLoggerService() },
        { provide: CustomerService, useValue: mockCustomerService() },
        { provide: BusinessService, useValue: mockBusinessService() },
        { provide: WorkflowService, useValue: mockWorkflowService },
        { provide: WorkflowDefinitionService, useValue: mockWorkflowDefinitionService },
        { provide: BusinessReportService, useValue: mockBusinessReportService },
      ],
    }).compile();

    service = module.get<OngoingMonitoringCron>(OngoingMonitoringCron);
    prismaService = module.get<PrismaService>(PrismaService);
    customerService = module.get<CustomerService>(CustomerService);
    businessService = module.get<BusinessService>(BusinessService);
    businessReportService = module.get<BusinessReportService>(BusinessReportService);
    loggerService = module.get<AppLoggerService>(AppLoggerService);
  });

  describe('handleCron', () => {
    it('should process businesses correctly when the lock is acquired', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      jest.spyOn(customerService, 'list').mockResolvedValue(mockCustomers());
      jest.spyOn(businessService, 'list').mockResolvedValue(mockBusinesses());

      await service.handleCron();

      expect(businessService.list).toHaveBeenCalledTimes(1);
    });

    it('should handle errors correctly', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      const errorLogSpy = jest.spyOn(loggerService, 'error');
      jest.spyOn(customerService, 'list').mockImplementation(() => {
        throw new Error('Test Error');
      });

      await service.handleCron();

      expect(errorLogSpy).toHaveBeenCalledWith(expect.stringContaining('An error occurred'));
    });

    it('should not create an ongoing report when the last business report is incomplete', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      jest.spyOn(customerService, 'list').mockResolvedValue(mockCustomers());
      jest
        .spyOn(businessService, 'list')
        .mockResolvedValue(mockBusinesses().filter(business => business.id === 'business3'));
      jest.spyOn(businessReportService, 'createBusinessReportAndTriggerReportCreation');
      jest.spyOn(businessReportService, 'findLatest').mockResolvedValue({
        id: 'business1',
        data: {},
        riskScore: 0,
        merchantId: 'business3',
        status: MERCHANT_REPORT_STATUSES_MAP['in-progress'],
        reportType: MERCHANT_REPORT_TYPES_MAP.ONGOING_MERCHANT_REPORT_T1,
        createdAt: new Date(new Date().setDate(new Date().getDate() - 31)),
        updatedAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        isAlert: false,
        website: {
          id: 'business1',
          url: 'http://example.com',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 31)),
          updatedAt: new Date(new Date().setDate(new Date().getDate() - 30)),
        },
        workflowVersion: MERCHANT_REPORT_VERSIONS_MAP['2'],
        metadata: {},
        websiteId: 'business1',
        parentCompanyName: 'Test Business 3',
      });

      await service.handleCron();

      expect(businessReportService.findLatest).toHaveBeenCalled();
      expect(
        businessReportService.createBusinessReportAndTriggerReportCreation,
      ).not.toHaveBeenCalled();
    });

    it('should always release the lock after processing', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      const releaseLockSpy = jest.spyOn(prismaService, 'releaseLock');

      await service.handleCron();

      expect(releaseLockSpy).toHaveBeenCalledTimes(1);
    });
  });

  const mockPrismaService = () => ({
    acquireLock: jest.fn(),
    releaseLock: jest.fn(),
    $transaction: jest.fn().mockImplementation(operations => operations()),
  });

  const mockWorkflowService = {
    createOrUpdateWorkflowRuntime: jest.fn().mockImplementation(() => {
      return Promise.resolve(true);
    }),
  };

  const mockCustomerService = () => ({
    list: jest.fn(),
  });

  const mockBusinessService = () => ({
    list: jest.fn(),
  });

  const mockLoggerService = () => ({
    log: jest.fn(),
    error: jest.fn(),
  });

  const mockWorkflowDefinitionService = {
    getLastVersionByVariant: jest.fn().mockImplementation((variant, projectIds) => {
      return Promise.resolve({ id: 'mockWorkflowDefinitionId', variant, projectIds });
    }),
  };

  const mockBusinessReportService = {
    findLatest: jest.fn().mockImplementation(() =>
      Promise.resolve([
        {
          id: 'mockReport1',
          reportId: 'mockReport1',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
          report: { reportId: 'mockReport1' },
        },
        { id: 'mockReport2', createdAt: new Date(), report: { reportId: 'mockReport2' } },
      ]),
    ),
    createBusinessReportAndTriggerReportCreation: jest.fn(),
    createReport: jest.fn().mockImplementation(reportDetails => {
      return Promise.resolve({ id: 'newMockReport', ...reportDetails });
    }),
  };

  const mockCustomers = async () => {
    return [
      {
        id: 'customer1',
        name: 'Test Customer 1',
        displayName: 'Test Customer Display 1',
        logoImageUri: 'http://example.com/logo1.png',
        config: {},
        subscriptions: {},
        features: {
          [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
            name: FEATURE_LIST.ONGOING_MERCHANT_REPORT,
            enabled: true,
            options: {
              intervalInDays: 7,
              workflowVersion: '2',
              proxyViaCountry: 'GB',
              scheduleType: 'interval',
              reportType: 'ONGOING_MERCHANT_REPORT_T1',
            },
          },
        },
        projects: [{ id: '1' } as unknown as Project],
      },
    ] satisfies TCustomerWithFeatures[];
  };

  const mockBusinesses = () => {
    return [
      {
        id: 'business1',
        companyName: 'Test Business 1',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
              enabled: false,
            },
          },
        },
      },
      {
        id: 'business2',
        companyName: 'Test Business 2',
      },
      {
        id: 'business3',
        companyName: 'Test Business 3',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
              name: FEATURE_LIST.ONGOING_MERCHANT_REPORT,
              enabled: true,
              options: {
                intervalInDays: 1,
                workflowVersion: '2',
                proxyViaCountry: 'GB',
                scheduleType: 'interval',
                reportType: 'ONGOING_MERCHANT_REPORT_T1',
              } satisfies TOngoingMerchantReportOptions,
            },
          },
        },
      },
      {
        id: 'business4',
        companyName: 'Test Business 4',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
              name: FEATURE_LIST.ONGOING_MERCHANT_REPORT,
              enabled: true,
              options: {
                intervalInDays: 14,
                workflowVersion: '2',
                proxyViaCountry: 'CA',
                scheduleType: 'interval',
                reportType: 'ONGOING_MERCHANT_REPORT_T1',
              } satisfies TOngoingMerchantReportOptions,
            },
          },
        },
      },
    ] as unknown as Array<
      Business & {
        metadata?: {
          lastOngoingReportInvokedAt?: number;
          featureConfig?: TCustomerWithFeatures['features'];
        };
      }
    >;
  };
});
