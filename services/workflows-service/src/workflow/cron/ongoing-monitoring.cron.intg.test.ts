import { Test } from '@nestjs/testing';
import { OngoingMonitoringCron } from './ongoing-monitoring.cron';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Business, Project } from '@prisma/client';
import {
  FEATURE_LIST,
  TCustomerWithDefinitionsFeatures,
  TOngoingMerchantReportOptions,
} from '@/customer/types';
import { BusinessReportService } from '@/business-report/business-report.service';
import { WorkflowDefinitionService } from '@/workflow-defintion/workflow-definition.service';
import { WorkflowService } from '@/workflow/workflow.service';

describe('OngoingMonitoringCron', () => {
  let service: OngoingMonitoringCron;
  let prismaService: PrismaService;
  let customerService: CustomerService;
  let businessService: BusinessService;
  let loggerService: AppLoggerService;
  // Add other services as needed

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OngoingMonitoringCron,
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
    loggerService = module.get<AppLoggerService>(AppLoggerService);
  });

  describe('handleCron', () => {
    it('should process businesses correctly when the lock is acquired', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      jest.spyOn(customerService, 'list').mockResolvedValue(mockCustomers());
      jest.spyOn(businessService, 'list').mockResolvedValue(mockBusinesses());

      await service.handleCron();

      expect(businessService.list).toHaveBeenCalledTimes(1);
      expect(mockWorkflowService.createOrUpdateWorkflowRuntime).toHaveBeenCalledTimes(4);
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
  });

  const mockWorkflowService = {
    createOrUpdateWorkflowRuntime: jest.fn().mockImplementation(params => {
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
    findMany: jest.fn().mockImplementation(criteria => {
      // Return an array of mock reports or a Promise of such an array
      return Promise.resolve([
        {
          id: 'mockReport1',
          reportId: 'mockReport1',
          createdAt: new Date(new Date().setDate(new Date().getDate() - 30)),
          report: { reportId: 'mockReport1' },
        },
        { id: 'mockReport2', createdAt: new Date(), report: { reportId: 'mockReport2' } },
      ]); // Example, adjust as needed
    }),
    // Simulate other needed service methods
    createReport: jest.fn().mockImplementation(reportDetails => {
      return Promise.resolve({ id: 'newMockReport', ...reportDetails });
    }),
  };

  // Mock data generators
  const mockCustomers = async () => {
    return [
      {
        id: 'customer1',
        name: 'Test Customer 1',
        displayName: 'Test Customer Display 1',
        logoImageUri: 'http://example.com/logo1.png',
        features: {
          [FEATURE_LIST.ONGOING_MERCHANT_REPORT]: {
            name: FEATURE_LIST.ONGOING_MERCHANT_REPORT,
            enabled: true,
            options: {
              definitionVariation: 'ongoing_merchant_audit_t1',
              intervalInDays: 7,
              active: true,
              checkTypes: ['lob', 'content', 'reputation'],
              proxyViaCountry: 'GB',
            },
          },
        },
        projects: [{ id: 1 } as unknown as Project],
      },
    ] as unknown as TCustomerWithDefinitionsFeatures[];
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
              options: {
                intervalInDays: 30,
                proxyViaCountry: 'US',
                scheduleType: 'interval',
                reportType: 'ONGOING_MERCHANT_REPORT_T1',
              } as TOngoingMerchantReportOptions,
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
                proxyViaCountry: 'GB',
                scheduleType: 'interval',
                reportType: 'ONGOING_MERCHANT_REPORT_T1',
              } as TOngoingMerchantReportOptions,
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
                proxyViaCountry: 'CA',
                scheduleType: 'interval',
                reportType: 'ONGOING_MERCHANT_REPORT_T1',
              } as TOngoingMerchantReportOptions,
            },
          },
        },
      },
    ] as unknown as Array<
      Business & {
        metadata?: {
          lastOngoingReportInvokedAt?: number;
          featureConfig?: TCustomerWithDefinitionsFeatures['features'];
        };
      }
    >;
  };
});
