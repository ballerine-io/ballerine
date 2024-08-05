import * as common from '@nestjs/common';
import { BadRequestException, Body, Param, Query } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
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
import { Public } from '@/common/decorators/public.decorator';
import { VerifyUnifiedApiSignatureDecorator } from '@/common/decorators/verify-unified-api-signature.decorator';
import { BusinessReportHookBodyDto } from '@/business-report/dtos/business-report-hook-body.dto';
import { BusinessReportHookSearchQueryParamsDto } from '@/business-report/dtos/business-report-hook-search-query-params.dto';
import { QueryMode } from '@/common/query-filters/query-mode';
import { isNumber } from 'lodash';

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
    }: CreateBusinessReportDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const customer = await this.customerService.getByProjectId(currentProjectId);
    const maxBusinessReports = customer.config?.maxBusinessReports;

    if (isNumber(maxBusinessReports) && maxBusinessReports > 0) {
      const businessReportsCount = await this.businessReportService.count({}, [currentProjectId]);

      if (businessReportsCount >= maxBusinessReports) {
        throw new BadRequestException(
          `You have reached the maximum number of business reports allowed (${maxBusinessReports}).`,
        );
      }
    }

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

    const businessReport = await this.businessReportService.create({
      data: {
        type: reportType,
        status: BusinessReportStatus.new,
        report: {},
        businessId: business.id,
        projectId: currentProjectId,
      },
    });

    const response = await axios.post(
      `${env.UNIFIED_API_URL}/merchants/analysis`,
      {
        websiteUrl,
        countryCode,
        parentCompanyName: merchantName,
        reportType,
        callbackUrl: `${env.APP_API_URL}/api/v1/internal/business-reports/hook?businessId=${business.id}&businessReportId=${businessReport.id}`,
        metadata: {
          customerId: customer.id,
          customerName: customer.displayName,
          workflowRuntimeDataId: null,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${env.UNIFIED_API_TOKEN}`,
        },
      },
    );

    await this.businessReportService.updateById(
      { id: businessReport.id },
      {
        data: {
          reportId: response.data.reportId,
          status: BusinessReportStatus.in_progress,
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
    @Query() { businessId, page, search, type, orderBy }: ListBusinessReportsDto,
  ) {
    const args = {
      where: {
        businessId,
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
    });
  }
}
