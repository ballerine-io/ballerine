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
import * as errors from '@/errors';
import { BusinessReportService } from '@/business-report/business-report.service';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import type { AuthenticatedEntity, TProjectId } from '@/types';
import { GetLatestBusinessReportDto } from '@/business-report/get-latest-business-report.dto';
import {
  BusinessReportListRequestParamDto,
  BusinessReportListResponseDto,
  ListBusinessReportsSchema,
} from '@/business-report/dtos/business-report-list.dto';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CreateBusinessReportDto } from '@/business-report/dtos/create-business-report.dto';
import { Business } from '@prisma/client';
import { BusinessReportDto } from '@/business-report/dtos/business-report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { fileFilter } from '@/storage/file-filter';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { CreateBusinessReportBatchBodyDto } from '@/business-report/dtos/create-business-report-batch-body.dto';
import type { Response } from 'express';
import { BusinessReportFindingsListResponseDto } from '@/business-report/dtos/business-report-findings.dto';
import { MerchantMonitoringClient } from '@/merchant-monitoring/merchant-monitoring.client';
import {
  BusinessReportMetricsRequestQueryDto,
  BusinessReportsMetricsQuerySchema,
} from '@/business-report/dtos/business-report-metrics.dto';
import { BusinessReportMetricsDto } from './dtos/business-report-metrics-dto';
import { BusinessReportStatusUpdateRequestParamsDto } from '@/business-report/dtos/business-report-status-update.dto';
import { UserData } from '@/user/user-data.decorator';

@ApiBearerAuth()
@swagger.ApiTags('Business Reports')
@common.Controller('external/business-reports')
export class BusinessReportControllerExternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    private readonly merchantMonitoringClient: MerchantMonitoringClient,
  ) {}

  @common.Get('/latest')
  @swagger.ApiOperation({
    summary: 'Get latest business report',
    description:
      'Retrieves the most recent business report for a given business ID and report type',
  })
  @swagger.ApiQuery({
    name: 'businessId',
    required: true,
    description: 'ID of the business to get report for',
  })
  @swagger.ApiQuery({
    name: 'type',
    required: true,
    description: 'Type of report to retrieve',
  })
  @swagger.ApiOkResponse({
    description: 'Latest report retrieved successfully',
    type: [String],
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @swagger.ApiExcludeEndpoint()
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

  @swagger.ApiOperation({
    summary: 'List business reports',
    description: 'Get a paginated list of business reports with optional filters',
  })
  @swagger.ApiQuery({
    name: 'page',
    required: false,
    description: 'Pagination parameters',
  })
  @swagger.ApiQuery({
    name: 'search',
    required: false,
    description: 'Search term to filter reports',
  })
  @common.Get()
  @swagger.ApiOkResponse({
    description: 'Reports retrieved successfully',
    type: BusinessReportListResponseDto,
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query()
    {
      businessId,
      page,
      search,
      from,
      to,
      reportType,
      riskLevels,
      statuses,
      findings,
      isAlert,
    }: BusinessReportListRequestParamDto,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    const { data, totalPages, totalItems } = await this.businessReportService.findMany({
      withoutUnpublishedOngoingReports: true,
      ...(page ? { limit: page.size, page: page.number } : {}),
      customerId,
      from,
      to,
      riskLevels,
      statuses,
      findings,
      isAlert,
      ...(reportType ? { reportType } : {}),
      ...(businessId ? { businessId } : {}),
      ...(search ? { searchQuery: search } : {}),
    });

    return {
      totalPages,
      totalItems,
      data: data.map(report => ({
        ...report,
        monitoringStatus:
          report.customer.ongoingMonitoringEnabled && !report.business.unsubscribedMonitoringAt,
      })),
    };
  }

  @swagger.ApiOperation({
    summary: 'List findings',
    description: 'Get a list of all possible findings for business reports',
  })
  @common.Get('/findings')
  @swagger.ApiOkResponse({
    description: 'Findings retrieved successfully',
    type: BusinessReportFindingsListResponseDto,
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  async listFindings() {
    return await this.merchantMonitoringClient.listFindings();
  }

  @swagger.ApiOperation({
    summary: 'Get business report metrics',
    description: 'Get aggregated metrics about business reports within a date range',
  })
  @swagger.ApiQuery({
    name: 'from',
    required: false,
    description: 'Start date for metrics calculation',
  })
  @swagger.ApiQuery({
    name: 'to',
    required: false,
    description: 'End date for metrics calculation',
  })
  @common.Get('/metrics')
  @swagger.ApiOkResponse({
    description: 'Metrics retrieved successfully',
    type: BusinessReportMetricsDto,
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @common.UsePipes(new ZodValidationPipe(BusinessReportsMetricsQuerySchema, 'query'))
  async getMetrics(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { from, to }: BusinessReportMetricsRequestQueryDto,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    return await this.merchantMonitoringClient.getMetrics({
      customerId,
      from,
      to,
    });
  }

  @swagger.ApiOperation({
    summary: 'Update business report status',
    description: 'Update the status of a business report',
  })
  @swagger.ApiParam({
    name: 'reportId',
    required: true,
    description: 'The ID of the report to update',
  })
  @swagger.ApiParam({
    name: 'status',
    required: true,
    description: 'The status to update to',
  })
  @swagger.ApiOkResponse({
    description: 'Report status updated successfully',
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @common.Put('/:reportId/status/:status')
  async updateStatus(
    @CurrentProject() currentProjectId: TProjectId,
    @Param('reportId') reportId: BusinessReportStatusUpdateRequestParamsDto['reportId'],
    @Param('status') status: BusinessReportStatusUpdateRequestParamsDto['status'],
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    await this.merchantMonitoringClient.updateStatus({
      status,
      reportId,
      customerId,
    });

    return {
      status,
      reportId,
    };
  }

  @common.Post()
  @swagger.ApiOperation({
    summary: 'Create business report',
    description: 'Create a new business report for a merchant',
  })
  @swagger.ApiBody({
    type: CreateBusinessReportDto,
    description: 'Business report creation parameters',
  })
  @swagger.ApiOkResponse({
    description: 'Business report created successfully',
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @swagger.ApiBadRequestResponse({
    description: 'Invalid request parameters',
  })
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
    @UserData() user: AuthenticatedEntity,
  ) {
    const customer = await this.customerService.getByProjectId(currentProjectId);
    await this.businessReportService.checkBusinessReportsLimit(customer);

    let business: Pick<Business, 'id' | 'correlationId'> | undefined;

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
      business = await this.businessService.create({
        data: {
          companyName: merchantName || 'Not detected',
          country: countryCode,
          website: websiteUrl,
          projectId: currentProjectId,
          correlationId: businessCorrelationId,
        },
        select: {
          id: true,
          correlationId: true,
        },
      });
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
      merchantName,
      workflowVersion,
      withQualityControl: customer.config?.withQualityControl ?? false,
      customerId: customer.id,
      requestedByUserId: user.user?.id,
      projectId: currentProjectId,
    });
  }

  @swagger.ApiOperation({
    summary: 'Get business report by ID',
    description: 'Retrieve a specific business report by its ID',
  })
  @swagger.ApiParam({
    name: 'id',
    description: 'ID of the business report to retrieve',
  })
  @common.Get(':id')
  @swagger.ApiOkResponse({
    description: 'Business report retrieved successfully',
    type: BusinessReportDto,
  })
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async getBusinessReportById(
    @CurrentProject() currentProjectId: TProjectId,
    @Param('id') id: string,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    const report = await this.businessReportService.findById({ id, customerId });

    return {
      ...report,
      monitoringStatus:
        report.customer.ongoingMonitoringEnabled && !report.business.unsubscribedMonitoringAt,
    };
  }

  @swagger.ApiOperation({
    summary: 'Create batch business reports',
    description: 'Create multiple business reports from an uploaded file',
  })
  @swagger.ApiConsumes('multipart/form-data')
  @swagger.ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Excel/CSV file containing merchant data',
        },
        type: {
          type: 'string',
          description: 'Type of business reports to create',
        },
        workflowVersion: {
          type: 'string',
          description: 'Version of the workflow to use',
        },
      },
    },
  })
  @swagger.ApiExcludeEndpoint()
  @common.Post('/upload-batch')
  @swagger.ApiForbiddenResponse({
    description: 'Forbidden access',
    type: errors.ForbiddenException,
  })
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
    const customer = await this.customerService.getByProjectId(currentProjectId);
    const { maxBusinessReports, withQualityControl, isDemoAccount } = customer.config ?? {};

    if (isDemoAccount) {
      throw new BadRequestException("You don't have access to this feature");
    }

    await this.businessReportService.checkBusinessReportsLimit(customer);

    const result = await this.businessReportService.processBatchFile({
      type,
      workflowVersion,
      customerId: customer.id,
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
