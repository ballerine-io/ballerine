import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { BusinessReportStatus, BusinessReportType, Prisma } from '@prisma/client';
import { TProjectId, TProjectIds } from '@/types';
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
import { AppLoggerService } from "@/common/app-logger/app-logger.service";

@Injectable()
export class BusinessReportService {
  constructor(
    protected readonly businessReportRepository: BusinessReportRepository,
    protected readonly prisma: PrismaService,
    protected readonly businessService: BusinessService,
    protected readonly logger: AppLoggerService,
  ) {}

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
    file,
    type,
    projectId,
  }: {
    file: Express.Multer.File;
    type: BusinessReportType;
    projectId: TProjectId;
  }) {
    const businessReportsRequests = await parseCsv(file, BusinessReportRequestSchema,  this.logger);

    if (businessReportsRequests.length > 100) {
      throw new UnprocessableEntityException('Batch size is too large');
    }

    const batchId = randomUUID();
    await this.prisma.$transaction(async transaction => {
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
              companyName: businessReportRequest.parentCompanyName || '',
              projectId,
            },
          },
          transaction,
        );

        const businessReport = await this.businessReportRepository.create({
          data: {
            type,
            status: BusinessReportStatus.new,
            report: {},
            businessId: business.id,
            batchId,
            projectId,
          },
        });

        return {
          businessReport: businessReport,
          businessReportRequest: businessReportRequest,
          businessId: business.id,
        } as const;
      });

      const businessWithRequests = await Promise.all(businessCreatePromises);

      const businessReportRequests = businessWithRequests.map(
        ({ businessReport, businessReportRequest }) => {
          return {
            callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${businessReport.businessId}&businessReportId=${businessReport.id}`,
            websiteUrl: businessReportRequest.websiteUrl,
            parentCompanyName: businessReportRequest.parentCompanyName,
            lineOfBusiness: businessReportRequest.lineOfBusiness,
            businessReportId: businessReport.id,
          };
        },
      ) satisfies TReportRequest;

      await new UnifiedApiClient().postBatchBusinessReport({
        reportRequests: businessReportRequests,
        clientName: 'merchant',
        reportType: type,
        workflowVersion: '3',
      });
    });
  }
}
