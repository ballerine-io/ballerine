import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Business } from '@prisma/client';
import { TProjectId } from '@/types';
import { parseCsv } from '@/common/utils/parse-csv/parse-csv';
import { BusinessReportRequestSchema } from '@/common/schemas';
import { PrismaService } from '@/prisma/prisma.service';
import { BusinessService } from '@/business/business.service';
import { TReportRequest } from '@/common/utils/unified-api-client/unified-api-client';
import { env } from '@/env';
import { randomUUID } from 'crypto';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isNumber } from 'lodash';
import { CountryCode } from '@/common/countries';
import { MerchantMonitoringClient } from '@/business-report/merchant-monitoring-client';
import { MerchantReportType, MerchantReportVersion } from '@/business-report/constants';

@Injectable()
export class BusinessReportService {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly businessService: BusinessService,
    protected readonly logger: AppLoggerService,
    private readonly merchantMonitoringClient: MerchantMonitoringClient,
  ) {}

  async checkBusinessReportsLimit(maxBusinessReports: number | undefined, customerId: string) {
    if (!isNumber(maxBusinessReports) || maxBusinessReports <= 0) {
      return;
    }

    const businessReportsCount = await this.merchantMonitoringClient.count({ customerId });

    if (businessReportsCount >= maxBusinessReports) {
      throw new BadRequestException(
        `You have reached the maximum number of business reports allowed (${maxBusinessReports}).`,
      );
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

    if (businessReportsCount + businessReportsRequests.length > maxBusinessReports) {
      const reportsLeft = maxBusinessReports - businessReportsCount;

      throw new UnprocessableEntityException(
        `Batch size is too large, there are too many reports (${reportsLeft} report${
          reportsLeft > 1 ? 's' : ''
        } left from a qouta of ${maxBusinessReports})`,
      );
    }

    if (businessReportsRequests.length > 100) {
      throw new UnprocessableEntityException('Batch size is too large');
    }

    const batchId = randomUUID();

    await this.prisma.$transaction(
      async transaction => {
        const businessCreatePromises = businessReportsRequests.map(async businessReportRequest => {
          let business =
            businessReportRequest.correlationId &&
            (await this.businessService.getByCorrelationId(businessReportRequest.correlationId, [
              projectId,
            ]));

          business ||= await this.businessService.create(
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

          return {
            businessReportRequest,
            businessId: business.id,
          } as const;
        });

        const businessWithRequests = await Promise.all(businessCreatePromises);

        const businessReportRequests = businessWithRequests.map(
          ({ businessReportRequest, businessId }) => {
            return {
              withQualityControl,
              websiteUrl: businessReportRequest.websiteUrl,
              lineOfBusiness: businessReportRequest.lineOfBusiness,
              parentCompanyName: businessReportRequest.parentCompanyName,
              callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessId}`,
              merchantId: businessId,
              customerId,
            };
          },
        ) satisfies TReportRequest;

        await this.merchantMonitoringClient.createBatch({
          reportRequests: businessReportRequests,
          clientName: 'merchant',
          reportType: type,
          withQualityControl,
          workflowVersion,
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
