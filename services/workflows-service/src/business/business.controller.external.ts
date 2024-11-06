import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { Param } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiBearerAuth, ApiExcludeEndpoint } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
import * as errors from '../errors';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessModel } from './business.model';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { BusinessCreateDto } from './dtos/business-create';
import { WorkflowDefinitionModel } from '@/workflow/workflow-definition.model';
import { WorkflowDefinitionFindManyArgs } from '@/workflow/dtos/workflow-definition-find-many-args';
import { WorkflowService } from '@/workflow/workflow.service';
import { makeFullWorkflow } from '@/workflow/utils/make-full-workflow';
import { BusinessUpdateDto } from '@/business/dtos/business.update';
import { BusinessInformation } from '@/business/dtos/business-information';
import { UseKeyAuthOrSessionGuard } from '@/common/decorators/use-key-auth-or-session-guard.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { BusinessPatchDto } from '@/business/dtos/business.patch.dto';
import { BusinessDto } from '@/business/dtos/business.dto';
import { PrismaService } from '@/prisma/prisma.service';
import { ARRAY_MERGE_OPTION } from '@ballerine/workflow-core';

@ApiBearerAuth()
@swagger.ApiTags('Businesses')
@common.Controller('external/businesses')
export class BusinessControllerExternal {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly businessService: BusinessService,
    protected readonly workflowService: WorkflowService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @UseCustomerAuthGuard()
  async create(
    @common.Body() data: BusinessCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<Pick<BusinessModel, 'id' | 'companyName'>> {
    return this.businessService.create({
      data: {
        ...data,
        legalForm: 'name',
        countryOfIncorporation: 'US',
        address: 'addess',
        industry: 'telecom',
        documents: 's',
        projectId: currentProjectId,
      },
      select: {
        id: true,
        companyName: true,
      },
    });
  }

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  async list(
    @common.Req() request: Request,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);

    return this.businessService.list(args, projectIds);
  }

  @UseKeyAuthOrSessionGuard()
  @common.Get('/business-information')
  async getCompanyInfo(@common.Query() query: BusinessInformation) {
    const { jurisdictionCode, vendor, registrationNumber } = query;

    return this.businessService.fetchCompanyInformation({
      registrationNumber,
      jurisdictionCode,
      vendor,
    });
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  @UseCustomerAuthGuard()
  async getById(
    @common.Param() params: BusinessWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<BusinessModel | null> {
    try {
      return await this.businessService.getById(params.id, {}, projectIds);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Put(':id')
  @ApiExcludeEndpoint()
  @UseCustomerAuthGuard()
  async update(
    @common.Param('id') businessId: string,
    @common.Body() data: BusinessUpdateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.businessService.updateById(businessId, {
      data: {
        companyName: data.companyName,
        address: data.address,
        registrationNumber: data.registrationNumber,
        website: data.website,
        documents: data.documents ? JSON.stringify(data.documents) : undefined,
        shareholderStructure:
          data.shareholderStructure && data.shareholderStructure.length
            ? JSON.stringify(data.shareholderStructure)
            : undefined,
        projectId: currentProjectId,
      },
    });
  }

  @common.Patch(':id')
  @UseCustomerAuthGuard()
  @swagger.ApiForbiddenResponse()
  @swagger.ApiOkResponse({ type: BusinessDto })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async patch(
    @common.Param('id') businessId: string,
    @common.Body() data: BusinessPatchDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const {
      documents,
      shareholderStructure,
      additionalInfo,
      bankInformation,
      address,
      metadata,
      ...restOfData
    } = data;

    return await this.prismaService.$transaction(async transaction => {
      try {
        // Validating the business exists
        await this.businessService.getById(businessId, { select: { metadata: true } }, [
          currentProjectId,
        ]);

        if (metadata) {
          const stringifiedMetadata = JSON.stringify(metadata);

          await transaction.$executeRaw`
              UPDATE "Business"
              SET "metadata" = jsonb_deep_merge_with_options(
                COALESCE("metadata", '{}'::jsonb),
                ${stringifiedMetadata}::jsonb,
                ${ARRAY_MERGE_OPTION.BY_INDEX}
              )
              WHERE "id" = ${businessId} AND "projectId" = ${currentProjectId};
            `;
        }

        return this.businessService.updateById(
          businessId,
          {
            data: {
              ...restOfData,
              documents: documents ? JSON.stringify(documents) : undefined,
              additionalInfo: additionalInfo ? JSON.stringify(additionalInfo) : undefined,
              bankInformation: bankInformation ? JSON.stringify(bankInformation) : undefined,
              address: address ? JSON.stringify(address) : undefined,
              shareholderStructure:
                shareholderStructure && shareholderStructure.length
                  ? JSON.stringify(shareholderStructure)
                  : undefined,
              projectId: currentProjectId,
            },
          },
          transaction,
        );
      } catch (error) {
        if (isRecordNotFoundError(error)) {
          throw new errors.NotFoundException(`No business was found for id "${businessId}"`);
        }

        throw error;
      }
    });
  }

  // curl -v http://localhost:3000/api/v1/external/businesses/:businessId/workflows
  @common.Get('/:businessId/workflows')
  @swagger.ApiOkResponse({ type: [WorkflowDefinitionModel] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  @ApiNestedQuery(WorkflowDefinitionFindManyArgs)
  @UseCustomerAuthGuard()
  async listWorkflowRuntimeDataByBusinessId(
    @Param('businessId') businessId: string,
    @ProjectIds() projectIds: TProjectIds,
  ) {
    const workflowRuntimeDataWithDefinition =
      await this.workflowService.listFullWorkflowDataByUserId(
        {
          entityId: businessId,
          entity: 'business',
        },
        projectIds,
      );

    //@ts-expect-error
    return makeFullWorkflow(workflowRuntimeDataWithDefinition);
  }
}
