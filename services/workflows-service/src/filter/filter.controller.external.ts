import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as nestAccessControl from 'nest-access-control';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { FilterFindManyArgs } from '@/filter/dtos/filter-find-many-args';
import { FilterModel } from '@/filter/filter.model';
import { FilterWhereUniqueInput } from '@/filter/dtos/filter-where-unique-input';
import { FilterService } from '@/filter/filter.service';
import { UseGuards, UsePipes } from '@nestjs/common';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { FilterCreateDto } from '@/filter/dtos/filter-create';
import { FilterCreateSchema } from '@/filter/dtos/temp-zod-schemas';
import { InputJsonValue, TProjectIds } from '@/types';
import { CustomerAuthGuard } from '@/common/guards/customer-auth.guard';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { ProjectScopeService } from '@/project/project-scope.service';

@swagger.ApiTags('external/filters')
@common.Controller('external/filters')
export class FilterControllerExternal {
  constructor(
    protected readonly service: FilterService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [FilterModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(FilterFindManyArgs)
  async list(@common.Req() request: Request): Promise<FilterModel[]> {
    const args = plainToClass(FilterFindManyArgs, request.query);
    return this.service.list(args);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: FilterModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param() params: FilterWhereUniqueInput): Promise<FilterModel | null> {
    try {
      return await this.service.getById(params.id);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Post()
  @UseGuards(CustomerAuthGuard)
  @swagger.ApiCreatedResponse({ type: FilterModel })
  @swagger.ApiForbiddenResponse()
  @UsePipes(new ZodValidationPipe(FilterCreateSchema, 'body'))
  async createFilter(@ProjectIds() projectIds: TProjectIds, @common.Body() data: FilterCreateDto) {
    return await this.service.create({
      data: {
        ...data,
        query: data?.query as InputJsonValue,
        projectId: projectIds?.[0],
      },
    });
  }
}
