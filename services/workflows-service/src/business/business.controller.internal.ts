import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import { UsePipes } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessModel } from './business.model';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as nestAccessControl from 'nest-access-control';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import { ZodValidationPipe } from '@/common/pipes/zod.pipe';
import { BusinessFilterCreateSchema } from '@/filter/dtos/temp-zod-schemas';
import { InputJsonValue } from '@/types';
import { FilterService } from '@/filter/filter.service';
import { BusinessFilterModel } from '@/business/dtos/business-filter.model';
import { BusinessFilterCreateDto } from '@/business/dtos/business-filter-create';
import { JsonValue } from 'type-fest';
import { BusinessFindUniqueArgs } from '@/business/dtos/business-find-unique-args';
import { TBusinessFilter } from '@/business/types';

@swagger.ApiTags('internal/businesses')
@common.Controller('internal/businesses')
export class BusinessControllerInternal {
  constructor(
    protected readonly service: BusinessService,
    protected readonly filterService: FilterService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  async list(@common.Req() request: Request): Promise<BusinessModel[]> {
    const { filterId, ...args } = plainToClass(BusinessFindManyArgs, request.query);
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
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindUniqueArgs)
  async getById(
    @common.Param() params: BusinessWhereUniqueInput,
    @common.Req() request: Request,
  ): Promise<BusinessModel | null> {
    try {
      const { filterId, ...args } = plainToClass(BusinessFindUniqueArgs, request.query);
      let query: TBusinessFilter['query'] = {};

      if (filterId) {
        const filter = await this.filterService.getById(filterId);
        // findUnique does not support `where`.
        const { where: _where, ...restQuery } = filter?.query as TBusinessFilter['query'];

        query = restQuery;
      }

      const business = await this.service.getById(params?.id, {
        ...args,
        ...(query as InputJsonValue),
      });

      return business;
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }

  @common.Post('filters')
  @swagger.ApiCreatedResponse({ type: BusinessFilterModel })
  @swagger.ApiForbiddenResponse()
  @UsePipes(new ZodValidationPipe(BusinessFilterCreateSchema))
  async createFilter(@common.Body() data: BusinessFilterCreateDto): Promise<BusinessFilterModel> {
    const filter = await this.filterService.create({
      data: {
        ...data,
        query: data?.query as InputJsonValue,
      },
    });

    return filter as BusinessFilterModel;
  }
}
