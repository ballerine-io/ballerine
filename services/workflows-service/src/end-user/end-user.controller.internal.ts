import { ApiNestedQuery } from '@/decorators/api-nested-query.decorator';
import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { EndUserWhereUniqueInput } from './dtos/end-user-where-unique-input';
import { EndUserFindManyArgs } from './dtos/end-user-find-many-args';
import { EndUserModel } from './end-user.model';
import { plainToClass } from 'class-transformer';
import { Request } from 'express';
import * as nestAccessControl from 'nest-access-control';
import { EndUserService } from './end-user.service';

@swagger.ApiTags('internal/end-users')
@common.Controller('internal/end-users')
export class EndUserControllerInternal {
  constructor(
    protected readonly service: EndUserService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [EndUserModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(EndUserFindManyArgs)
  async list(@common.Req() request: Request): Promise<EndUserModel[]> {
    const args = plainToClass(EndUserFindManyArgs, request.query);
    return this.service.list(args);
  }

  @common.Get(':id')
  @swagger.ApiOkResponse({ type: EndUserModel })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param() params: EndUserWhereUniqueInput): Promise<EndUserModel> {
    return this.service.getById(params.id);
  }
}
