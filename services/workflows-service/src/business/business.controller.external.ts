import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { Param } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
import * as errors from '../errors';
// import * as nestAccessControl from 'nest-access-control';
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

@swagger.ApiTags('external/businesses')
@common.Controller('external/businesses')
export class BusinessControllerExternal {
  constructor(
    protected readonly service: BusinessService,
    protected readonly workflowService: WorkflowService, // @nestAccessControl.InjectRolesBuilder() // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @UseCustomerAuthGuard()
  async create(
    @common.Body() data: BusinessCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ): Promise<Pick<BusinessModel, 'id' | 'companyName'>> {
    return this.service.create({
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

    return this.service.list(args, projectIds);
  }

  @UseKeyAuthOrSessionGuard()
  @common.Get('/business-information')
  async getCompanyInfo(@common.Query() query: BusinessInformation) {
    const { jurisdictionCode, vendor, registrationNumber } = query;

    return this.service.fetchCompanyInformation({
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
      const business = await this.service.getById(params.id, {}, projectIds);

      return business;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Put(':id')
  @UseCustomerAuthGuard()
  async update(
    @common.Param('id') businessId: string,
    @common.Body() data: BusinessUpdateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return this.service.updateById(businessId, {
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
