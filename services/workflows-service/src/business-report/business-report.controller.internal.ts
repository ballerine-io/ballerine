import * as common from '@nestjs/common';
import { Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import type { TProjectId } from '@/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { BusinessReportService } from '@/business-report/business-report.service';
import { GetBusinessReportsDto } from '@/business-report/get-business-reports.dto';

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
    @Query() searchQueryParams: GetBusinessReportsDto,
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
