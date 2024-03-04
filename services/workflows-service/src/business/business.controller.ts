import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
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
import { ProjectScopeService } from '@/project/project-scope.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiTags('internal/businesses')
@common.Controller('internal/businesses')
export class BusinessControllerExternal {
  constructor(
    protected readonly service: BusinessService,
    // @nestAccessControl.InjectRolesBuilder()
    // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
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

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
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
}
