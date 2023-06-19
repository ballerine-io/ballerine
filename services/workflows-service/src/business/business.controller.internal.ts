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
import { InputJsonValue } from '@/types';
import { JsonValue } from 'type-fest';

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
  async list(@common.Req() request: Request): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);
    const query: JsonValue = {};

    return this.service.list({
      ...args,
      ...(query as InputJsonValue),
    });
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: BusinessModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param() params: BusinessWhereUniqueInput): Promise<BusinessModel | null> {
    try {
      return await this.service.getById(params?.id);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }
}
