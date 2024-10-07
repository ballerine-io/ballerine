import { BadRequestException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Business, BusinessReportStatus, BusinessReportType, Prisma } from '@prisma/client';
import { type ObjectValues, TProjectId, TProjectIds } from '@/types';
import { BusinessReportRepository } from '@/business-report/business-report.repository';
import { GetBusinessReportDto } from './dto/get-business-report.dto';
import { toPrismaOrderByGeneric } from '@/workflow/utils/toPrismaOrderBy';
import { parseCsv } from '@/common/utils/parse-csv/parse-csv';
import { BusinessReportRequestSchema } from '@/common/schemas';
import { PrismaService } from '@/prisma/prisma.service';
import { BusinessService } from '@/business/business.service';
import {
  TReportRequest,
  UnifiedApiClient,
} from '@/common/utils/unified-api-client/unified-api-client';
import { env } from '@/env';
import { randomUUID } from 'crypto';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isNumber } from 'lodash';
import { CountryCode } from '@/common/countries';
import axios from 'axios';

@Injectable()
export class BusinessReportService {
  constructor(
    protected readonly businessReportRepository: BusinessReportRepository,
    protected readonly prisma: PrismaService,
    protected readonly businessService: BusinessService,
    protected readonly logger: AppLoggerService,
  ) {}

  async checkBusinessReportsLimit(
    maxBusinessReports: number | undefined,
    currentProjectId: string,
  ) {
    if (!isNumber(maxBusinessReports) || maxBusinessReports <= 0) {
      return;
    }

    const businessReportsCount = await this.count({}, [currentProjectId]);

    if (businessReportsCount >= maxBusinessReports) {
      throw new BadRequestException(
        `You have reached the maximum number of business reports allowed (${maxBusinessReports}).`,
      );
    }
  }

  async createBusinessReportAndTriggerReportCreation({
    reportType,
    business,
    currentProjectId,
    websiteUrl,
    countryCode,
    merchantName,
    workflowVersion,
    compareToReportId,
    withQualityControl,
    customerId,
    customerName,
  }: {
    reportType: ObjectValues<typeof BusinessReportType>;
    business: Pick<Business, 'id' | 'correlationId'>;
    currentProjectId: string;
    websiteUrl: string;
    countryCode?: CountryCode | undefined;
    merchantName: string | undefined;
    compareToReportId?: string;
    workflowVersion: '1' | '2' | '3';
    withQualityControl: boolean;
    customerId: string;
    customerName: string;
  }) {
    const businessReport = await this.create({
      data: {
        type: reportType,
        status: BusinessReportStatus.new,
        report: {},
        businessId: business.id,
        projectId: currentProjectId,
      },
    });

    let response;

    try {
      response = await axios.post(
        `${env.UNIFIED_API_URL}/merchants/analysis`,
        {
          websiteUrl,
          countryCode,
          parentCompanyName: merchantName,
          reportType,
          workflowVersion,
          compareToReportId,
          withQualityControl,
          callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${business.id}&businessReportId=${businessReport.id}`,
          metadata: {
            customerId,
            customerName,
            workflowRuntimeDataId: null,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
          },
        },
      );
    } catch (error) {
      this.logger.error('Failed to initiate report creation', { error });

      throw new Error('Failed to initiate report creation', { cause: error });
    }

    await this.updateById(
      { id: businessReport.id },
      {
        data: {
          reportId: response.data.reportId,
          status: BusinessReportStatus.in_progress,
        },
      },
    );
  }

  async create<T extends Prisma.BusinessReportCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportCreateArgs>,
  ) {
    return await this.businessReportRepository.create(args);
  }

  async findMany<T extends Prisma.BusinessReportFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findMany(args, projectIds);
  }

  async upsert<T extends Prisma.BusinessReportUpsertArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportUpsertArgs>,
    projectIds: NonNullable<TProjectIds>,
  ) {
    if (!args.where.id) {
      return await this.businessReportRepository.create({ data: args.create });
    }

    await this.businessReportRepository.updateMany({
      where: {
        id: args.where.id,
        project: { id: { in: projectIds } },
      },
      data: args.update,
    });

    return await this.businessReportRepository.findFirstOrThrow(
      {
        where: {
          id: args.where.id,
        },
      },
      projectIds,
    );
  }

  async findFirstOrThrow<T extends Prisma.BusinessReportFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.businessReportRepository.findFirstOrThrow(args, projectIds);
  }

  async findManyWithFilters(
    getTransactionsParameters: GetBusinessReportDto,
    projectId: string,
    options?: Prisma.BusinessReportFindManyArgs,
  ) {
    const args: Prisma.BusinessReportFindManyArgs = {};

    if (getTransactionsParameters.page?.number && getTransactionsParameters.page?.size) {
      // Temporary fix for pagination (class transformer issue)
      const size = parseInt(getTransactionsParameters.page.size as unknown as string, 10);
      const number = parseInt(getTransactionsParameters.page.number as unknown as string, 10);

      args.take = size;
      args.skip = size * (number - 1);
    }

    if (getTransactionsParameters.orderBy) {
      args.orderBy = toPrismaOrderByGeneric(getTransactionsParameters.orderBy);
    }

    return await this.businessReportRepository.findMany(
      {
        ...options,
        where: {
          businessId: getTransactionsParameters.businessId,
        },
        ...args,
      },
      [projectId],
    );
  }

  async findById<T extends Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>,
  ) {
    return await this.businessReportRepository.findById(id, projectIds, args);
  }

  async findManyByBatchId(projectIds: TProjectIds, batchId: string) {
    return await this.businessReportRepository.findMany(
      {
        where: {
          batchId,
        },
      },
      projectIds,
    );
  }

  async updateById(...args: Parameters<BusinessReportRepository['updateById']>) {
    return await this.businessReportRepository.updateById(...args);
  }

  async count(args: Parameters<BusinessReportRepository['count']>[0], projectIds: TProjectIds) {
    return await this.businessReportRepository.count(args, projectIds);
  }

  async processBatchFile({
    type,
    projectId,
    merchantSheet,
    workflowVersion,
    currentProjectId,
    maxBusinessReports,
    withQualityControl,
  }: {
    projectId: TProjectId;
    type: BusinessReportType;
    currentProjectId: string;
    maxBusinessReports: number;
    withQualityControl: boolean;
    workflowVersion: '1' | '2' | '3';
    merchantSheet: Express.Multer.File;
  }) {
    const businessReportsRequests = await parseCsv({
      filePath: merchantSheet.path,
      schema: BusinessReportRequestSchema,
      logger: this.logger,
    });

    const businessReportsCount = await this.count({}, [currentProjectId]);

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

    let results: Awaited<ReturnType<UnifiedApiClient['postBatchBusinessReport']>> = [];

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

          const businessReport = await this.businessReportRepository.create(
            {
              data: {
                type,
                status: BusinessReportStatus.new,
                report: {},
                businessId: business.id,
                batchId,
                projectId,
              },
            },
            transaction,
          );

          return {
            businessReport,
            businessReportRequest,
            businessId: business.id,
          } as const;
        });

        const businessWithRequests = await Promise.all(businessCreatePromises);

        const businessReportRequests = businessWithRequests.map(
          ({ businessReport, businessReportRequest }) => {
            return {
              withQualityControl,
              businessReportId: businessReport.id,
              websiteUrl: businessReportRequest.websiteUrl,
              lineOfBusiness: businessReportRequest.lineOfBusiness,
              parentCompanyName: businessReportRequest.parentCompanyName,
              callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessReport.businessId}&businessReportId=${businessReport.id}`,
            };
          },
        ) satisfies TReportRequest;

        results = await new UnifiedApiClient().postBatchBusinessReport({
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

    await Promise.all(
      results
        .filter(({ reportId, businessReportId }) => reportId && businessReportId)
        .map(async ({ reportId, businessReportId }) => {
          await this.updateById(
            { id: businessReportId },
            {
              data: {
                reportId,
                status: BusinessReportStatus.in_progress,
              },
            },
          );
        }),
    );

    return { batchId };
  }
}
