import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
// import * as nestAccessControl from 'nest-access-control';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { FilterFindManyArgs } from '@/filter/dtos/filter-find-many-args';
import { FilterModel } from '@/filter/filter.model';
import { FilterWhereUniqueInput } from '@/filter/dtos/filter-where-unique-input';
import { FilterService } from '@/filter/filter.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectIds } from '@/types';

@swagger.ApiTags('internal/filters')
@common.Controller('internal/filters')
export class FilterControllerInternal {
  constructor(
    protected readonly service: FilterService, // @nestAccessControl.InjectRolesBuilder() // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [FilterModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(FilterFindManyArgs)
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Req() request: Request,
  ): Promise<FilterModel[]> {
    const args = plainToClass(FilterFindManyArgs, request.query);

    return this.service.list(args, projectIds);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: FilterModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(
    @ProjectIds() projectIds: TProjectIds,
    @common.Param() params: FilterWhereUniqueInput,
  ): Promise<FilterModel | null> {
    try {
      return await this.service.getById(params.id, {}, projectIds);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }
}
