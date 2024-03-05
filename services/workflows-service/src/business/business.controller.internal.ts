import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { BusinessWhereUniqueInput } from './dtos/business-where-unique-input';
import { BusinessFindManyArgs } from './dtos/business-find-many-args';
import { BusinessModel } from './business.model';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
import { BusinessService } from './business.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import type { InputJsonValue, TProjectIds } from '@/types';
import type { JsonValue } from 'type-fest';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';

@swagger.ApiTags('internal/businesses')
@common.Controller('internal/businesses')
export class BusinessControllerInternal {
  constructor(protected readonly service: BusinessService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [BusinessModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(BusinessFindManyArgs)
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Req() request: Request,
  ): Promise<BusinessModel[]> {
    const args = plainToClass(BusinessFindManyArgs, request.query);
    const query: JsonValue = {};

    return this.service.list(
      {
        ...args,
        ...(query as InputJsonValue),
      },
      projectIds,
    );
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
      return await this.service.getById(params?.id, {}, projectIds);
    } catch (err) {
      if (isRecordNotFoundError(err)) {
        throw new errors.NotFoundException(`No resource was found for ${JSON.stringify(params)}`);
      }

      throw err;
    }
  }
}
