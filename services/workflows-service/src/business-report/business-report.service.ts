import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import uniqBy from 'lodash/uniqBy';
import { Business } from '@prisma/client';
import { type PrismaTransaction, TProjectId } from '@/types';
import { parseCsv } from '@/common/utils/parse-csv/parse-csv';
import { BusinessReportRequestSchema, TBusinessReportRequest } from '@/common/schemas';
import { PrismaService } from '@/prisma/prisma.service';
import { BusinessService } from '@/business/business.service';
import { env } from '@/env';
import { randomUUID } from 'crypto';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isNumber } from 'lodash';
import { CountryCode } from '@/common/countries';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import { MerchantReportType, MerchantReportVersion } from '@ballerine/common';
import { TCustomerWithFeatures } from '@/customer/types';
import { CustomerService } from '@/customer/customer.service';
import { AnalyticsService, EventNamesMap } from '@/common/analytics-logger/analytics.service';

@Injectable()
export class BusinessReportService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly businessService: BusinessService,
    protected readonly customerService: CustomerService,
    protected readonly logger: AppLoggerService,
    private readonly merchantMonitoringClient: MerchantMonitoringClient,
    private readonly analyticsService: AnalyticsService,
  ) {}

  async checkBusinessReportsLimit(customer: TCustomerWithFeatures) {
    const accessDetails = await this.customerService.getAccessDetails(customer);

    if (customer.config?.isDemoAccount) {
      if (accessDetails.demoDaysLeft <= 0) {
        throw new BadRequestException(
          'Your demo account has expired. Talk to us to unlock additional features and continue effective risk management with Ballerine.',
        );
      }

      if (accessDetails.reportsLeft <= 0) {
        throw new BadRequestException(
          "You've hit your reports limit. Talk to us to unlock additional features and continue effective risk management with Ballerine.",
        );
      }
    }
  }

  async findLatest(args: Parameters<MerchantMonitoringClient['findLatest']>[0]) {
    return await this.merchantMonitoringClient.findLatest(args);
  }

  async createBusinessReportAndTriggerReportCreation({
    reportType,
    business,
    websiteUrl,
    countryCode,
    merchantName,
    workflowVersion,
    compareToReportId,
    withQualityControl,
    customerId,
    requestedByUserId,
    projectId,
  }: {
    reportType: MerchantReportType;
    business: Pick<Business, 'id' | 'correlationId'>;
    websiteUrl: string;
    countryCode?: CountryCode | undefined;
    merchantName: string | undefined;
    compareToReportId?: string;
    workflowVersion: MerchantReportVersion;
    withQualityControl: boolean;
    customerId: string;
    requestedByUserId: string | undefined;
    projectId: TProjectId;
  }) {
    await this.merchantMonitoringClient.create({
      reportType,
      businessId: business.id,
      customerId,
      websiteUrl,
      workflowVersion,
      withQualityControl,
      parentCompanyName: merchantName,
      ...(countryCode && { countryCode }),
      ...(compareToReportId && { compareToReportId }),
      requestedByUserId,
      projectId,
    });

    void this.analyticsService.trackSafe({
      event: EventNamesMap.BUSINESS_REPORT_REQUESTED,
      distinctId: requestedByUserId,
      properties: {
        reportType,
        businessId: business.id,
        customerId,
        projectId,
      },
      customerId,
    });
  }

  async findMany(args: Parameters<MerchantMonitoringClient['findMany']>[0]) {
    return await this.merchantMonitoringClient.findMany(args);
  }

  async findById(args: Parameters<MerchantMonitoringClient['findById']>[0]) {
    return await this.merchantMonitoringClient.findById(args);
  }

  async count(args: Parameters<MerchantMonitoringClient['count']>[0]) {
    return await this.merchantMonitoringClient.count(args);
  }

  private async createBusiness(
    projectId: string,
    businessReportRequest: TBusinessReportRequest,
    transaction?: PrismaTransaction,
  ) {
    return await this.businessService.create(
      {
        data: {
          ...(businessReportRequest.correlationId
            ? { correlationId: businessReportRequest.correlationId }
            : {}),
          companyName: businessReportRequest.merchantName || 'Not detected',
          website: businessReportRequest.websiteUrl || '',
          country: businessReportRequest.countryCode || '',
          projectId,
        },
      },
      transaction,
    );
  }

  async processBatchFile({
    type,
    projectId,
    merchantSheet,
    workflowVersion,
    maxBusinessReports,
    withQualityControl,
    customerId,
  }: {
    customerId: string;
    projectId: TProjectId;
    type: MerchantReportType;
    maxBusinessReports: number;
    withQualityControl: boolean;
    workflowVersion: MerchantReportVersion;
    merchantSheet: Express.Multer.File;
  }) {
    const businessReportsRequests = await parseCsv({
      filePath: merchantSheet.path,
      schema: BusinessReportRequestSchema,
      logger: this.logger,
    });

    const businessReportsCount = await this.count({ customerId });

    if (
      isNumber(maxBusinessReports) &&
      maxBusinessReports > 0 &&
      businessReportsCount + businessReportsRequests.length > maxBusinessReports
    ) {
      const reportsLeft = maxBusinessReports - businessReportsCount;

      throw new BadRequestException(
        `This batch will exceed your reports limit. You have ${reportsLeft} report${
          reportsLeft > 1 ? 's' : ''
        } remaining from a quota of ${maxBusinessReports}. Talk to us to unlock additional features and continue effective risk management with Ballerine.`,
      );
    }

    if (businessReportsRequests.length > 1_000) {
      throw new UnprocessableEntityException('Batch size is too large, the maximum is 1,000');
    }

    const batchId = randomUUID();

    await this.prisma.$transaction(
      async transaction => {
        const businessesLookup = new Map<string, Business>();

        const allCorrelationIds = new Set(
          businessReportsRequests
            .map(({ correlationId }) => correlationId)
            .filter(Boolean) as string[],
        );

        if (allCorrelationIds.size > 0) {
          const businesses = await this.businessService.list(
            {
              where: {
                correlationId: {
                  in: [...allCorrelationIds],
                },
              },
            },
            [projectId],
            transaction,
          );
          for (const business of businesses) {
            businessesLookup.set(business.correlationId || business.id, business);
          }
        }

        const businessesToCreate = uniqBy(
          businessReportsRequests.filter(
            ({ correlationId }) => !!correlationId && !businessesLookup.has(correlationId),
          ),
          'correlationId',
        );
        if (businessesToCreate.length > 0) {
          const businesses = await Promise.all(
            businessesToCreate.map(business =>
              this.createBusiness(projectId, business, transaction),
            ),
          );
          for (const business of businesses) {
            businessesLookup.set(business.correlationId || business.id, business);
          }
        }

        const businessCreatePromises = businessReportsRequests.map(async businessReportRequest => {
          let business =
            businessReportRequest.correlationId &&
            businessesLookup.get(businessReportRequest.correlationId);

          business ||= await this.createBusiness(projectId, businessReportRequest, transaction);

          return {
            businessReportRequest,
            businessId: business.id,
          } as const;
        });

        const businessWithRequests = await Promise.all(businessCreatePromises);

        await this.merchantMonitoringClient.createBatch({
          customerId,
          workflowVersion,
          withQualityControl,
          reportType: type,
          reports: businessWithRequests.map(({ businessReportRequest, businessId }) => ({
            businessId,
            websiteUrl: businessReportRequest.websiteUrl,
            countryCode: businessReportRequest.countryCode,
            parentCompanyName: businessReportRequest.parentCompanyName,
            callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessId}`,
          })),
        });
      },
      {
        timeout: 1000 * 60 * 3,
        maxWait: 1000 * 60 * 3,
      },
    );

    return { batchId };
  }
}
