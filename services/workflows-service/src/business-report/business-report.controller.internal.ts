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
import type { InputJsonValue, TProjectId } from '@/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { BusinessReportService } from '@/business-report/business-report.service';
import { GetLatestBusinessReportDto } from '@/business-report/get-latest-business-report.dto';
import {
  ListBusinessReportsDto,
  ListBusinessReportsSchema,
} from '@/business-report/list-business-reports.dto';
import { Business, BusinessReportStatus, Prisma } from '@prisma/client';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CreateBusinessReportDto } from '@/business-report/dto/create-business-report.dto';
import {
  HookCallbackHandlerService,
  ReportWithRiskScoreSchema,
} from '@/workflow/hook-callback-handler.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { AlertService } from '@/alert/alert.service';
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { BusinessReportHookBodyDto } from '@/business-report/dtos/business-report-hook-body.dto';
import { BusinessReportHookSearchQueryParamsDto } from '@/business-report/dtos/business-report-hook-search-query-params.dto';
import { QueryMode } from '@/common/query-filters/query-mode';
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
    const {
      id: customerId,
      displayName: customerName,
      config,
    } = await this.customerService.getByProjectId(currentProjectId);

    const { maxBusinessReports, withQualityControl } = config || {};
    await this.businessReportService.checkBusinessReportsLimit(
      maxBusinessReports,
      currentProjectId,
    );

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
      currentProjectId,
      websiteUrl,
      countryCode,
      merchantName,
      workflowVersion,
      withQualityControl,
      customerId,
      customerName,
    });
  }

  @common.Post('/hook')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async createBusinessReportCallback(
    @Query() { businessReportId, businessId }: BusinessReportHookSearchQueryParamsDto,
    @Body()
    { reportData: unvalidatedReportData, base64Pdf, reportId }: BusinessReportHookBodyDto,
  ) {
    const business = await this.businessService.getByIdUnscoped(businessId, {
      select: {
        id: true,
        companyName: true,
        projectId: true,
      },
    });

    const customer = await this.customerService.getByProjectId(business.projectId);
    const reportData = ReportWithRiskScoreSchema.parse(unvalidatedReportData);
    const { pdfReportBallerineFileId } =
      await this.hookCallbackService.persistPDFReportDocumentWithWorkflowDocuments({
        context: {
          entity: {
            id: business.id,
          },
          documents: [],
        },
        customer,
        projectId: business.projectId,
        base64PDFString: base64Pdf as string,
      });

    const businessReport = await this.businessReportService.updateById(
      { id: businessReportId },
      {
        data: {
          riskScore: reportData.summary.riskScore,
          status: BusinessReportStatus.completed,
          reportId,
          report: {
            reportFileId: pdfReportBallerineFileId,
            data: reportData as InputJsonValue,
          },
        },
      },
    );

    this.alertService
      .checkOngoingMonitoringAlert(businessReport, business.companyName)
      .then(() => {
        this.logger.debug(`Alert Tested for ${reportId}}`);
      })
      .catch(error => {
        this.logger.error(error);
      });
  }

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getLatestBusinessReport(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { businessId, type }: GetLatestBusinessReportDto,
  ) {
    return await this.businessReportService.findFirstOrThrow(
      {
        where: {
          type,
          businessId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          report: true,
          riskScore: true,
          status: true,
          business: {
            select: {
              id: true,
              companyName: true,
              country: true,
              website: true,
            },
          },
        },
      },
      [currentProjectId],
    );
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { businessId, batchId, page, search, type, orderBy }: ListBusinessReportsDto,
  ) {
    const args = {
      where: {
        businessId,
        batchId,
        ...(type ? { type } : {}),
        ...(search
          ? {
              OR: [
                { id: { contains: search, mode: QueryMode.Insensitive } },
                {
                  business: {
                    companyName: { contains: search, mode: QueryMode.Insensitive },
                  },
                },
                { business: { website: { contains: search, mode: QueryMode.Insensitive } } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        report: true,
        riskScore: true,
        status: true,
        business: {
          select: {
            id: true,
            companyName: true,
            country: true,
            website: true,
          },
        },
      },
      orderBy: orderBy as
        | Prisma.Enumerable<Prisma.BusinessReportOrderByWithRelationInput>
        | undefined,
      take: page.size,
      skip: (page.number - 1) * page.size,
    };

    const businessReports = await this.businessReportService.findMany(args, [currentProjectId]);

    const businessReportCount = await this.businessReportService.count({ where: args.where }, [
      currentProjectId,
    ]);

    return {
      businessReports,
      meta: {
        totalItems: businessReportCount,
        totalPages: Math.max(Math.ceil(businessReportCount / page.size), 1),
      },
    };
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async getBusinessReportById(
    @CurrentProject() currentProjectId: TProjectId,
    @Param('id') id: string,
  ) {
    return await this.businessReportService.findById(id, [currentProjectId], {
      select: {
        id: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        report: true,
        riskScore: true,
        status: true,
        business: {
          select: {
            id: true,
            companyName: true,
            country: true,
            website: true,
          },
        },
      },
    });
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
    const { config } = await this.customerService.getByProjectId(currentProjectId);

    const { maxBusinessReports, withQualityControl } = config || {};
    await this.businessReportService.checkBusinessReportsLimit(
      maxBusinessReports,
      currentProjectId,
    );

    const result = await this.businessReportService.processBatchFile({
      type,
      workflowVersion,
      currentProjectId,
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
