import * as common from '@nestjs/common';
import {
  BadRequestException,
  Body,
  Param,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
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
import { Business } from '@prisma/client';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CreateBusinessReportDto } from '@/business-report/dto/create-business-report.dto';
import { HookCallbackHandlerService } from '@/workflow/hook-callback-handler.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { AlertService } from '@/alert/alert.service';
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { BusinessReportHookBodyDto } from '@/business-report/dtos/business-report-hook-body.dto';
import { BusinessReportHookSearchQueryParamsDto } from '@/business-report/dtos/business-report-hook-search-query-params.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { fileFilter } from '@/storage/file-filter';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { CreateBusinessReportBatchBodyDto } from '@/business-report/dto/create-business-report-batch-body.dto';
import type { Response } from 'express';

@ApiBearerAuth()
@swagger.ApiTags('Business Reports')
@common.Controller('internal/business-reports')
@swagger.ApiExcludeController()
export class BusinessReportControllerInternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    protected readonly alertService: AlertService,
    protected readonly hookCallbackService: HookCallbackHandlerService,
  ) {}

  @common.Post()
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async createBusinessReport(
    @Body()
    {
      websiteUrl,
      countryCode,
      merchantName,
      businessCorrelationId,
      reportType,
      workflowVersion,
    }: CreateBusinessReportDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { id: customerId, config } = await this.customerService.getByProjectId(currentProjectId);

    const { maxBusinessReports, withQualityControl } = config || {};
    await this.businessReportService.checkBusinessReportsLimit(maxBusinessReports, customerId);

    let business: Pick<Business, 'id' | 'correlationId'> | undefined;
    const merchantNameWithDefault = merchantName || 'Not detected';

    if (!businessCorrelationId) {
      business = await this.businessService.create({
        data: {
          companyName: merchantNameWithDefault,
          country: countryCode,
          website: websiteUrl,
          projectId: currentProjectId,
        },
        select: {
          id: true,
          correlationId: true,
        },
      });
    }

    if (businessCorrelationId) {
      business =
        (await this.businessService.getByCorrelationId(businessCorrelationId, [currentProjectId], {
          select: {
            id: true,
            correlationId: true,
          },
        })) ?? undefined;
    }

    if (!business) {
      throw new BadRequestException(
        `Business with an id of ${businessCorrelationId} was not found`,
      );
    }

    await this.businessReportService.createBusinessReportAndTriggerReportCreation({
      reportType,
      business,
      websiteUrl,
      countryCode,
      merchantName: merchantNameWithDefault,
      workflowVersion,
      withQualityControl,
      customerId,
    });
  }

  @common.Post('/hook')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
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

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getLatestBusinessReport(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { businessId, type }: GetLatestBusinessReportDto,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    const latestReport = await this.businessReportService.findLatest({
      businessId,
      customerId,
      reportType: type,
    });

    return latestReport ?? {};
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { businessId, page, search, orderBy }: ListBusinessReportsDto,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    return await this.businessReportService.findMany({
      withoutUnpublishedOngoingReports: true,
      limit: page.size,
      page: page.number,
      customerId: customerId,
      ...(businessId ? { businessId } : {}),
      ...(search ? { searchQuery: search } : {}),
    });
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async getBusinessReportById(
    @CurrentProject() currentProjectId: TProjectId,
    @Param('id') id: string,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    return await this.businessReportService.findById({ id, customerId });
  }

  @common.Post('/upload-batch')
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: getDiskStorage(),
      fileFilter,
    }),
    RemoveTempFileInterceptor,
  )
  async createBusinessReportBatch(
    @UploadedFile() file: Express.Multer.File,
    @Body() { type, workflowVersion }: CreateBusinessReportBatchBodyDto,
    @Res() res: Response,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { id: customerId, config } = await this.customerService.getByProjectId(currentProjectId);

    const { maxBusinessReports, withQualityControl } = config || {};
    await this.businessReportService.checkBusinessReportsLimit(maxBusinessReports, customerId);

    const result = await this.businessReportService.processBatchFile({
      type,
      workflowVersion,
      customerId,
      maxBusinessReports,
      merchantSheet: file,
      projectId: currentProjectId,
      withQualityControl: typeof withQualityControl === 'boolean' ? withQualityControl : false,
    });

    res.status(201);
    res.setHeader('content-type', 'application/json');
    res.send(result);
  }
}
