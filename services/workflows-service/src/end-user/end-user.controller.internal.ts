import { ApiNestedQuery } from '@/common/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as errors from '../errors';
import { EndUserWhereUniqueInput } from './dtos/end-user-where-unique-input';
import { EndUserFindManyArgs } from './dtos/end-user-find-many-args';
import { EndUserModel } from './end-user.model';
import { plainToClass } from 'class-transformer';
import type { Request } from 'express';
// import * as nestAccessControl from 'nest-access-control';
import { EndUserService } from './end-user.service';
import { isRecordNotFoundError } from '@/prisma/prisma.util';
import type { InputJsonValue, TProjectIds } from '@/types';
import type { JsonValue } from 'type-fest';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';

@swagger.ApiTags('internal/end-users')
@common.Controller('internal/end-users')
export class EndUserControllerInternal {
  constructor(
    protected readonly service: EndUserService, // @nestAccessControl.InjectRolesBuilder() // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [EndUserModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(EndUserFindManyArgs)
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Req() request: Request,
  ): Promise<EndUserModel[]> {
    const args = plainToClass(EndUserFindManyArgs, request.query);
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
  @swagger.ApiOkResponse({ type: EndUserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse()
  async getById(
    @common.Param() params: EndUserWhereUniqueInput,
    @ProjectIds() projectIds: TProjectIds,
  ): Promise<EndUserModel | null> {
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
