import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
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

@swagger.ApiTags('internal/businesses')
@common.Controller('internal/businesses')
export class BusinessControllerInternal {
  constructor(
    protected readonly service: BusinessService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  list(@common.Req() request: Request): Promise<BusinessModel[]> {
    const {
      // @ts-expect-error - Avoids passing filterId to Prisma, temporary until filters are implemented.
      filterId: _filterId,
      ...args
    } = plainToClass(BusinessFindManyArgs, request.query);
    return this.service.list(args);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
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
}
