import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { UseGuards, UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
import * as errors from '../errors';
// import * as nestAccessControl from 'nest-access-control';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { FilterCreateDto } from '@/filter/dtos/filter-create';
import { FilterFindManyArgs } from '@/filter/dtos/filter-find-many-args';
import { FilterWhereUniqueInput } from '@/filter/dtos/filter-where-unique-input';
import { FilterCreateSchema } from '@/filter/dtos/temp-zod-schemas';
import { FilterModel } from '@/filter/filter.model';
import { FilterService } from '@/filter/filter.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { InputJsonValue, TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { UseCustomerAuthGuard } from '@/common/decorators/use-customer-auth-guard.decorator';

@swagger.ApiBearerAuth()
@swagger.ApiTags('Filters')
@common.Controller('external/filters')
export class FilterControllerExternal {
  constructor(
    protected readonly service: FilterService,
    // @nestAccessControl.InjectRolesBuilder()
    // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [FilterModel] })
  @swagger.ApiForbiddenResponse()
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Req() request: Request,
  ): Promise<
    | FilterModel[]
    | {
        items: FilterModel[];
        meta: {
          pages: number;
          total: number;
        };
      }
  > {
    const { page, limit, ...queryParams } = request.query;

    const args = plainToClass(FilterFindManyArgs, queryParams);

    const isPaginationIncluded = page && limit;

    if (isPaginationIncluded) {
      const totalItems = await this.service.count(args, projectIds);

      return {
        items: await this.service.list(
          { ...args, skip: Number(limit) * (Number(page) - 1), take: Number(limit) },
          projectIds,
        ),
        meta: {
          pages: Math.max(Math.ceil(totalItems / Number(limit)), 1),
          total: totalItems,
        },
      };
    }

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

  @common.Post()
  @UseCustomerAuthGuard()
  @swagger.ApiCreatedResponse({ type: FilterModel })
  @swagger.ApiForbiddenResponse()
  @UsePipes(new ZodValidationPipe(FilterCreateSchema, 'body'))
  async createFilter(
    @common.Body() data: FilterCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return await this.service.create(
      {
        data: {
          ...data,
          query: data.query as InputJsonValue,
        },
      },
      currentProjectId,
    );
  }
}
