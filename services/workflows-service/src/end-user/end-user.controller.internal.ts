import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { Body, Logger, Query, UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { EndUserWhereUniqueInput } from './dtos/end-user-where-unique-input';
import { EndUserFindManyArgs } from './dtos/end-user-find-many-args';
import { EndUserModel } from './end-user.model';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as nestAccessControl from 'nest-access-control';
import { EndUserService } from './end-user.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { EndUserFilterModel } from '@/end-user/dtos/end-user-filter.model';
import { FilterService } from '@/filter/filter.service';
import { InputJsonValue } from '@/types';
import { EndUserFilterCreateDto } from '@/end-user/dtos/end-user-filter-create';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { EndUserFilterCreateSchema } from '@/filter/dtos/temp-zod-schemas';
import { JsonValue } from 'type-fest';
import { EndUserFindUniqueArgs } from '@/end-user/dtos/end-user-find-unique-args';
import { TEndUserFilter } from '@/end-user/types';
import {
  FindEndUsersListInternalDto,
  FindEndUsersListInternalSchema,
} from '@/end-user/dtos/find-end-users-list.internal.dto';
import { toPrismaOrderBy } from '@/common/to-prisma-order-by';

@swagger.ApiTags('internal/end-users')
@common.Controller('internal/end-users')
export class EndUserControllerInternal {
  private readonly logger = new Logger(EndUserControllerInternal.name);

  constructor(
    protected readonly service: EndUserService,
    protected readonly filterService: FilterService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [EndUserModel] })
  @swagger.ApiForbiddenResponse()
  @swagger.ApiBadRequestResponse()
  @UsePipes(new ZodValidationPipe(FindEndUsersListInternalSchema))
  @ApiNestedQuery(FindEndUsersListInternalDto)
  async list(
    @Query() findEndUsersListInternalDto: FindEndUsersListInternalDto,
  ): Promise<EndUserModel[]> {
    const {
      filterId,
      orderBy = 'createdAt',
      page: { size, after },
    } = findEndUsersListInternalDto;

    const filter = await this.filterService.getById(filterId);

    if (filter.entity !== 'individuals') {
      throw new errors.BadRequestException('Invalid filter');
    }

    const paginationOptions = after
      ? { cursor: { id: after }, skip: 1, take: size }
      : { take: size };

    const query = {
      ...(filter.query as InputJsonValue),
      ...paginationOptions,
      orderBy: toPrismaOrderBy(orderBy),
    };

    return this.service.list(query);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: EndUserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(EndUserFindUniqueArgs)
  async getById(
    @common.Param() params: EndUserWhereUniqueInput,
    @common.Req() request: Request,
  ): Promise<EndUserModel | null> {
    try {
      const { filterId, ...args } = plainToClass(EndUserFindUniqueArgs, request.query);
      let query: TEndUserFilter['query'] = {};

      if (filterId) {
        const filter = await this.filterService.getById(filterId);
        // findUnique does not support `where`.
        const { where: _where, ...restQuery } = filter?.query as TEndUserFilter['query'];

        query = restQuery;
      }

      const endUser = await this.service.getById(params?.id, {
        ...args,
        ...(query as InputJsonValue),
      });

      return endUser;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Post('filters')
  @swagger.ApiCreatedResponse({ type: EndUserFilterModel })
  @swagger.ApiForbiddenResponse()
  @UsePipes(new ZodValidationPipe(EndUserFilterCreateSchema))
  async createFilter(@common.Body() data: EndUserFilterCreateDto): Promise<EndUserFilterModel> {
    const filter = await this.filterService.create({
      data: {
        ...data,
        entity: 'individuals',
        query: data?.query as InputJsonValue,
      },
    });

    return filter as EndUserFilterModel;
  }
}
