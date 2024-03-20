import { Test } from '@nestjs/testing';
import { OngoingMonitoringCron } from './ongoing-monitoring.cron';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Business, Project } from '@prisma/client';
import {
  FEATURE_LIST,
  TCustomerFeatures,
  TCustomerWithDefinitionsFeatures,
  TOngoingAuditReportDefinitionConfig,
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
      // Mock additional service methods as needed

      await service.handleCron();

      expect(businessService.list).toHaveBeenCalledTimes(1);
      expect(mockWorkflowService.createOrUpdateWorkflowRuntime).toHaveBeenCalledTimes(1);
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

  function mockPrismaService() {
    return {
      acquireLock: jest.fn(),
      releaseLock: jest.fn(),
    };
  }

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
        { id: 'mockReport1', createdAt: new Date(new Date().setDate(new Date().getDate() - 30)) },
        { id: 'mockReport2', createdAt: new Date() },
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
          [FEATURE_LIST.ONGOING_AUDIT_REPORT_T1]: {
            name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T1,
            enabled: true,
            options: {
              definitionVariation: 'ongoing_merchant_audit_t1',
              intervalInDays: 7,
              active: true,
              checkType: ['lob', 'content', 'reputation'],
              proxyViaCountry: 'GB',
            },
          },
        },
        projects: [{ id: 1 } as unknown as Project],
      },
      {
        id: 'customer2',
        name: 'Test Customer 2',
        displayName: 'Test Customer Display 2',
        logoImageUri: 'http://example.com/logo2.png',
        features: {
          [FEATURE_LIST.ONGOING_AUDIT_REPORT_T2]: {
            name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T2,
            enabled: true,
            options: {
              definitionVariation: 'ongoing_merchant_audit_t2',
              intervalInDays: 0,
              active: true,
              checkType: ['lob', 'content', 'reputation'],
              proxyViaCountry: 'GB',
            },
          },
        },
        projects: [{ id: 2 } as unknown as Project],
      },
      {
        id: 'customer3',
        name: 'Test Customer 3',
        displayName: 'Test Customer Display 3',
        logoImageUri: 'http://example.com/logo3.png',
        features: {
          [FEATURE_LIST.ONGOING_AUDIT_REPORT_T2]: {
            name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T2,
            enabled: false,
            options: {
              definitionVariation: 'ongoing_merchant_audit_t2',
              intervalInDays: 0,
              active: true,
              checkType: ['lob', 'content', 'reputation'],
              proxyViaCountry: 'GB',
            },
          },
        },
        projects: [{ id: 3 } as unknown as Project],
      },
      {
        id: 'customer4',
        name: 'Test Customer 4',
        displayName: 'Test Customer Display 4',
        logoImageUri: 'http://example.com/logo4.png',
        features: {
          [FEATURE_LIST.ONGOING_AUDIT_REPORT_T2]: {
            name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T2,
            enabled: true,
            options: {
              definitionVariation: 'ongoing_merchant_audit_t2',
              intervalInDays: 0,
              active: false,
              checkType: ['lob', 'content', 'reputation'],
              proxyViaCountry: 'GB',
            },
          },
        },
        projects: [{ id: 4 } as unknown as Project],
      },
    ] as TCustomerWithDefinitionsFeatures[];
  };

  const mockBusinesses = () => {
    return [
      {
        id: 'business1',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_AUDIT_REPORT_T1]: {
              name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T1,
              enabled: false,
              options: {
                definitionVariation: 'variation1',
                intervalInDays: 30,
                active: true, // active false
                checkType: ['type1', 'type2'],
                proxyViaCountry: 'US',
              } as TOngoingAuditReportDefinitionConfig,
            },
          } as Record<string, TCustomerFeatures>,
        },
      },
      {
        id: 'business2',
      },
      {
        id: 'business3',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_AUDIT_REPORT_T1]: {
              name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T1,
              enabled: true,
              options: {
                definitionVariation: 'variation2',
                intervalInDays: 1,
                active: true,
                checkType: ['lob', 'content', 'reputation', 'businessConfig'],
                proxyViaCountry: 'GB',
              } as TOngoingAuditReportDefinitionConfig,
            },
          } as Record<string, TCustomerFeatures>,
        },
      },
      {
        id: 'business4',
        metadata: {
          featureConfig: {
            [FEATURE_LIST.ONGOING_AUDIT_REPORT_T1]: {
              name: FEATURE_LIST.ONGOING_AUDIT_REPORT_T1,
              enabled: true,
              options: {
                definitionVariation: 'variation3',
                intervalInDays: 14,
                active: false,
                checkType: ['type5', 'type6'],
                proxyViaCountry: 'CA',
              } as TOngoingAuditReportDefinitionConfig,
            },
          } as Record<string, TCustomerFeatures>,
        },
      },
    ] as unknown as (Business & {
      metadata?: {
        featureConfig?: TCustomerWithDefinitionsFeatures['features'];
        lastOngoingAuditReportInvokedAt?: number;
      };
    })[];
  };
});
