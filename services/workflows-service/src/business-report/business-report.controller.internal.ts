import * as common from '@nestjs/common';
import { Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import type { TProjectId } from '@/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { BusinessReportService } from '@/business-report/business-report.service';
import { GetLatestBusinessReportDto } from '@/business-report/get-latest-business-report.dto';
import {
  ListBusinessReportsDto,
  ListBusinessReportsSchema,
} from '@/business-report/list-business-reports.dto';
import { Prisma } from '@prisma/client';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';

@common.Controller('internal/business-reports')
@swagger.ApiExcludeController()
export class BusinessReportControllerInternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Get('/')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: ListBusinessReportsDto,
  ) {
    return await this.businessReportService.findMany(
      {
        where: {
          type: searchQueryParams.type,
        },
        select: {
          createdAt: true,
          updatedAt: true,
          report: true,
          business: {
            select: {
              companyName: true,
              country: true,
              website: true,
            },
          },
        },
        take: searchQueryParams.page.size,
        skip: (searchQueryParams.page.number - 1) * searchQueryParams.page.size,
        orderBy: searchQueryParams.orderBy as
          | Prisma.Enumerable<Prisma.BusinessReportOrderByWithRelationInput>
          | undefined,
      },
      [currentProjectId],
    );
  }

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getLatestBusinessReport(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: GetLatestBusinessReportDto,
  ) {
    return await this.businessReportService.findFirst(
      {
        where: {
          businessId: searchQueryParams.businessId,
          type: searchQueryParams.type,
        },
      },
      [currentProjectId],
    );
  }
}
