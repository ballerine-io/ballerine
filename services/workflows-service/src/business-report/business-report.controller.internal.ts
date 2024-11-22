import * as common from '@nestjs/common';
import { Body, Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { BusinessReportService } from '@/business-report/business-report.service';

import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { BusinessReportHookBodyDto } from '@/business-report/dtos/business-report-hook-body.dto';
import { BusinessReportHookSearchQueryParamsDto } from '@/business-report/dtos/business-report-hook-search-query-params.dto';

@ApiBearerAuth()
@swagger.ApiTags('Business Reports')
@common.Controller('internal/business-reports')
export class BusinessReportControllerInternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
  ) {}

  @common.Post('/hook')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @swagger.ApiExcludeEndpoint()
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async createBusinessReportCallback(
    @Query() { businessId }: BusinessReportHookSearchQueryParamsDto,
    @Body()
    { reportData: unvalidatedReportData, base64Pdf, reportId }: BusinessReportHookBodyDto,
  ) {
    // const business = await this.businessService.getByIdUnscoped(businessId, {
    //   select: {
    //     id: true,
    //     companyName: true,
    //     projectId: true,
    //   },
    // });
    //
    // const customer = await this.customerService.getByProjectId(business.projectId);
    // const reportData = ReportWithRiskScoreSchema.parse(unvalidatedReportData);
    //
    //
    // this.alertService
    //   .checkOngoingMonitoringAlert({
    //     businessReport: businessReport,
    //     businessCompanyName: business.companyName,
    //   })
    //   .then(() => {
    //     this.logger.debug(`Alert Tested for ${reportId}}`);
    //   })
    //   .catch(error => {
    //     this.logger.error(error);
    //   });
  }
}
