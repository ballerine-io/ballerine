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
import type { TProjectId } from '@/types';
import { GetLatestBusinessReportDto } from '@/business-report/get-latest-business-report.dto';
import {
  BusinessReportListRequestParamDto,
  BusinessReportListResponseDto,
  ListBusinessReportsSchema,
} from '@/business-report/business-report-list.dto';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { CreateBusinessReportDto } from '@/business-report/dto/create-business-report.dto';
import { Business } from '@prisma/client';
import { BusinessReportDto } from '@/business-report/business-report.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { fileFilter } from '@/storage/file-filter';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { CreateBusinessReportBatchBodyDto } from '@/business-report/dto/create-business-report-batch-body.dto';
import type { Response } from 'express';
import { PrismaService } from '@/prisma/prisma.service';

@ApiBearerAuth()
@swagger.ApiTags('Business Reports')
@common.Controller('external/business-reports')
export class BusinessReportControllerExternal {
  constructor(
    protected readonly businessReportService: BusinessReportService,
    protected readonly logger: AppLoggerService,
    protected readonly customerService: CustomerService,
    protected readonly businessService: BusinessService,
    private readonly prisma: PrismaService,
  ) {}

  @common.Get('/latest')
  @swagger.ApiOkResponse({ type: [String] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
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

  @common.Get()
  @swagger.ApiOkResponse({ type: BusinessReportListResponseDto })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async listBusinessReports(
    @CurrentProject() currentProjectId: TProjectId,
    @Query() { businessId, page, search }: BusinessReportListRequestParamDto,
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

  @common.Post()
  @swagger.ApiOkResponse({})
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

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessReportDto })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.UsePipes(new ZodValidationPipe(ListBusinessReportsSchema, 'query'))
  async getBusinessReportById(
    @CurrentProject() currentProjectId: TProjectId,
    @Param('id') id: string,
  ) {
    const { id: customerId } = await this.customerService.getByProjectId(currentProjectId);

    return await this.businessReportService.findById({ id, customerId });
  }

  @swagger.ApiExcludeEndpoint()
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

  // @common.Get()
  // @UseGuards(AdminAuthGuard)
  // @swagger.ApiOkResponse({ type: [String] })
  // @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  // @swagger.ApiExcludeEndpoint()
  // async list() {
  //   return await this.prisma.businessReport.findMany({
  //     include: {
  //       project: {
  //         include: {
  //           customer: true,
  //         },
  //       },
  //     },
  //   });
  // }
}
