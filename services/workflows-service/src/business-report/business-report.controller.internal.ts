import * as common from '@nestjs/common';
import { BadRequestException, Body, Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import type { InputJsonValue, ObjectValues, TProjectId } from '@/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import * as errors from '@/errors';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { BusinessReportService } from '@/business-report/business-report.service';
import { GetLatestBusinessReportDto } from '@/business-report/get-latest-business-report.dto';
import {
  ListBusinessReportsDto,
  ListBusinessReportsSchema,
} from '@/business-report/list-business-reports.dto';
import { Business, BusinessReportStatus, BusinessReportType, Prisma } from '@prisma/client';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import axios from 'axios';
import { env } from '@/env';
import { CreateBusinessReportDto } from '@/business-report/dto/create-business-report.dto';
import {
  HookCallbackHandlerService,
  ReportWithRiskScoreSchema,
} from '@/workflow/hook-callback-handler.service';
import { CustomerService } from '@/customer/customer.service';
import { BusinessService } from '@/business/business.service';
import { AlertService } from '@/alert/alert.service';
import { IsIn, IsString, MinLength } from 'class-validator';
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';

export class BusinessReportHookSearchQueryParamsDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  businessId!: string;
}

export class BusinessReportHookBodyDto {
  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  reportId!: string;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsIn(Object.values(BusinessReportType))
  reportType!: ObjectValues<typeof BusinessReportType>;

  @ApiProperty({
    required: true,
    type: Object,
  })
  reportData!: Record<string, unknown>;

  @ApiProperty({
    required: true,
    type: String,
  })
  @IsString()
  @MinLength(1)
  base64Pdf!: string;
}

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
      callbackUrl,
      businessId,
      reportType,
    }: CreateBusinessReportDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    if (!merchantName && !businessId) {
      throw new BadRequestException('Merchant name or business id is required');
    }

    let business: Pick<Business, 'id'> | undefined;

    if (!businessId && merchantName) {
      business = await this.businessService.create({
        data: {
          companyName: merchantName,
          country: countryCode,
          website: websiteUrl,
          projectId: currentProjectId,
        },
        select: {
          id: true,
          projectId: true,
        },
      });
    }

    await axios.post(
      `${env.UNIFIED_API_URL}/tld/reports`,
      {
        websiteUrl,
        countryCode,
        merchantName,
        reportType,
        callbackUrl: `${callbackUrl}?businessId=${business?.id ?? businessId}`,
      },
      {
        headers: {
          Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
        },
      },
    );

    return;
  }

  @common.Post('/hook')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @Public()
  @VerifyUnifiedApiSignatureDecorator()
  async createBusinessReportCallback(
    @Query() searchQueryParams: BusinessReportHookSearchQueryParamsDto,
    @Body() body: BusinessReportHookBodyDto,
  ) {
    const business = await this.businessService.getByIdUnscoped(searchQueryParams.businessId, {
      select: {
        id: true,
        companyName: true,
        projectId: true,
      },
    });
    const customer = await this.customerService.getByProjectId(business.projectId);
    const { reportData: unvalidatedReportData, base64Pdf, reportId, reportType } = body;
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

    const reportRiskScore = reportData.summary.riskScore;

    const currentReportId = reportId as string;

    const businessReport = await this.businessReportService.create({
      data: {
        type: reportType as BusinessReportType,
        riskScore: reportRiskScore,
        status: BusinessReportStatus.completed,
        report: {
          reportFileId: pdfReportBallerineFileId,
          data: reportData as InputJsonValue,
        },
        reportId: currentReportId,
        businessId: business.id,
        projectId: business.projectId,
      },
    });

    this.alertService
      .checkOngoingMonitoringAlert(businessReport, business.companyName)
      .then(() => {
        this.logger.debug(`Alert Tested for ${currentReportId}}`);
      })
      .catch(error => {
        this.logger.error(error);
      });

    return;
  }

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getLatestBusinessReport(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: GetLatestBusinessReportDto,
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
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() searchQueryParams: ListBusinessReportsDto,
  ) {
    return await this.businessReportService.findMany(
      {
        where: {
          businessId: searchQueryParams.businessId,
          ...(searchQueryParams.type ? { type: searchQueryParams.type } : {}),
        },
        select: {
          createdAt: true,
          updatedAt: true,
          report: true,
          riskScore: true,
          status: true,
          business: {
            select: {
              companyName: true,
              country: true,
              website: true,
            },
          },
        },
        orderBy: searchQueryParams.orderBy as
          | Prisma.Enumerable<Prisma.BusinessReportOrderByWithRelationInput>
          | undefined,
      },
      [currentProjectId],
    );
  }
}
