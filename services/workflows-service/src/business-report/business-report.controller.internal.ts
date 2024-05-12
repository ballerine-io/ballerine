import { BusinessReportService } from '@/business-report/business-report.service';
import { GetBusinessReportDto } from '@/business-report/dto/get-business-report.dto';
import { GetBusinessReportsDto } from '@/business-report/dto/get-business-reports.dto';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import * as errors from '@/errors';
import type { TProjectId } from '@/types';
import * as common from '@nestjs/common';
import { Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';

@common.Controller('internal/business-reports')
@swagger.ApiExcludeController()
export class BusinessReportControllerInternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
  ) {}

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getLatestBusinessReport(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: GetBusinessReportDto,
  ) {
    return await this.businessReportService.findFirstOrThrow(
      {
        where: {
          businessId: searchQueryParams.businessId,
          type: searchQueryParams.type,
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      [currentProjectId],
    );
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: GetBusinessReportsDto,
  ) {
    console.log('project id', currentProjectId, searchQueryParams);

    return await this.businessReportService.findMany(
      {
        where: {
          businessId: searchQueryParams.businessId,
          ...(searchQueryParams.type ? { type: searchQueryParams.type } : {}),
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
      [currentProjectId],
    );
  }
}
