import { Test } from '@nestjs/testing';
import { OngoingMonitoringCron } from './ongoing-monitoring.cron';
import { PrismaService } from '@/prisma/prisma.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Project } from '@prisma/client';
import { FEATURE_LIST, TCustomerWithDefinitionsFeatures } from '@/customer/types';

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
        { provide: CustomerService, useValue: mockCustomerService() },
        { provide: BusinessService, useValue: mockBusinessService() },
        { provide: AppLoggerService, useValue: mockLoggerService() },
        // Mock other services similarly
      ],
    }).compile();

    service = module.get<OngoingMonitoringCron>(OngoingMonitoringCron);
    prismaService = module.get<PrismaService>(PrismaService);
    customerService = module.get<CustomerService>(CustomerService);
    businessService = module.get<BusinessService>(BusinessService);
    loggerService = module.get<AppLoggerService>(AppLoggerService);
    // Initialize other mocked services
  });

  describe('handleCron', () => {
    it('should process businesses correctly when the lock is acquired', async () => {
      jest.spyOn(prismaService, 'acquireLock').mockResolvedValue(true);
      jest.spyOn(customerService, 'list').mockResolvedValue(mockCustomers());
      jest.spyOn(businessService, 'list').mockResolvedValue(mockBusinesses());
      // Mock additional service methods as needed

      await service.handleCron();

      // Assert that businesses were processed
      expect(businessService.list).toHaveBeenCalledTimes(1);
      // Add additional assertions to verify the flow within the method
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

    // Add more tests to cover other scenarios and functionalities within handleCron
  });

  function mockPrismaService() {
    return {
      acquireLock: jest.fn(),
      releaseLock: jest.fn(),
      // Mock other methods as needed
    };
  }

  function mockCustomerService() {
    return {
      list: jest.fn(),
      // Mock other methods as needed
    };
  }

  function mockBusinessService() {
    return {
      list: jest.fn(),
      // Mock other methods as needed
    };
  }

  function mockLoggerService() {
    return {
      log: jest.fn(),
      error: jest.fn(),
      // Mock other methods as needed
    };
  }

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

  function mockBusinesses() {
    return [
      // Generate mock businesses based on your schema
    ];
  }

  // Mock other services similarly
});
