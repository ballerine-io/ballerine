import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { Logger, UsePipes } from '@nestjs/common';
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
  @ApiNestedQuery(EndUserFindManyArgs)
  async list(@common.Req() request: Request): Promise<EndUserModel[]> {
    const { filterId, ...args } = plainToClass(EndUserFindManyArgs, request.query);
    let query: JsonValue = {};

    if (filterId) {
      const filter = await this.filterService.getById(filterId);
      query = filter.query;
    }

    return this.service.list({
      ...args,
      ...(query as InputJsonValue),
    });
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: EndUserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param() params: EndUserWhereUniqueInput): Promise<EndUserModel | null> {
    try {
      const endUser = await this.service.getById(params.id);

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
        query: data?.query as InputJsonValue,
      },
    });

    return filter as EndUserFilterModel;
  }
}
