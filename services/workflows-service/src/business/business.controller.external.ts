import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import {Param, UseGuards} from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as errors from '../errors';
import * as nestAccessControl from 'nest-access-control';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessModel } from './business.model';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { BusinessCreateDto } from './dtos/business-create';
import { UseKeyAuthInDevGuard } from '@/common/decorators/use-key-auth-in-dev-guard.decorator';
import { WorkflowDefinitionModel } from '@/workflow/workflow-definition.model';
import { WorkflowDefinitionFindManyArgs } from '@/workflow/dtos/workflow-definition-find-many-args';
import { WorkflowService } from '@/workflow/workflow.service';
import { makeFullWorkflow } from '@/workflow/utils/make-full-workflow';
import { BusinessUpdateDto } from '@/business/dtos/business.update';
import { BusinessInformation } from '@/business/dtos/business-information';
import {CustomerAuthGuard} from "@/common/guards/customer-auth.guard";

@swagger.ApiTags('external/businesses')
@common.Controller('external/businesses')
export class BusinessControllerExternal {
  constructor(
    protected readonly service: BusinessService,
    protected readonly workflowService: WorkflowService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @UseKeyAuthInDevGuard()
  async create(
    @common.Body() data: BusinessCreateDto,
  ): Promise<Pick<BusinessModel, 'id' | 'companyName'>> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.service.create({
      data: {
        ...data,
        legalForm: 'name',
        countryOfIncorporation: 'US',
        address: 'addess',
        industry: 'telecom',
        documents: 's',
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
  async list(@common.Req() request: Request): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);
    return this.service.list(args);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  @UseKeyAuthInDevGuard()
  async getById(@common.Param() params: BusinessWhereUniqueInput): Promise<BusinessModel | null> {
    try {
      const business = await this.service.getById(params.id);

      return business;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Put(':id')
  @UseKeyAuthInDevGuard()
  async update(@common.Param('id') businessId: string, @common.Body() data: BusinessUpdateDto) {
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
      },
    });
  }

  @common.Get('/business-information/:registrationNumber')
  @UseGuards(CustomerAuthGuard)
  async getCompanyInfo(
    @common.Query() query: BusinessInformation,
    @common.Param('registrationNumber') registrationNumber: string,
  ) {
    const { jurisdictionCode, vendor } = query;

    return this.service.fetchCompanyInformation({
      registrationNumber,
      jurisdictionCode,
      vendor,
    });
  }

  // curl -v http://localhost:3000/api/v1/external/businesses/:businessId/workflows
  @common.Get('/:businessId/workflows')
  @swagger.ApiOkResponse({ type: [WorkflowDefinitionModel] })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  @common.HttpCode(200)
  @ApiNestedQuery(WorkflowDefinitionFindManyArgs)
  @UseKeyAuthInDevGuard()
  async listWorkflowRuntimeDataByBusinessId(@Param('businessId') businessId: string) {
    const workflowRuntimeDataWithDefinition =
      await this.workflowService.listFullWorkflowDataByUserId({
        entityId: businessId,
        entity: 'business',
      });

    return makeFullWorkflow(workflowRuntimeDataWithDefinition);
  }
}
