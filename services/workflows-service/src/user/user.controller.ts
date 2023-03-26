import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import * as nestAccessControl from 'nest-access-control';
import * as defaultAuthGuard from '../auth/default-auth.guard';
import { isRecordNotFoundError } from '../prisma/prisma.util';
import * as errors from '../errors';
import { Request } from 'express';
import { plainToClass } from 'class-transformer';
import { ApiNestedQuery } from '../decorators/api-nested-query.decorator';
import { UserService } from './user.service';
import { AclValidateRequestInterceptor } from '../access-control/interceptors/acl-validate-request.interceptor';
import { AclFilterResponseInterceptor } from '../access-control/interceptors/acl-filter-response.interceptor';
import { UserCreateDto } from './dtos/user-create';
import { UserWhereUniqueInput } from './dtos/user-where-unique-input';
import { UserFindManyArgs } from './dtos/user-find-many-args';
import { UserUpdateDto } from './dtos/user-update';
import { UserModel } from './user.model';

@swagger.ApiTags('users')
@common.Controller('users')
@swagger.ApiBearerAuth()
@common.UseGuards(defaultAuthGuard.DefaultAuthGuard, nestAccessControl.ACGuard)
export class UserController {
  constructor(
    protected readonly service: UserService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: 'User',
    action: 'create',
    possession: 'any',
  })
  @common.Post()
  @swagger.ApiCreatedResponse({ type: UserModel })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async create(@common.Body() data: UserCreateDto): Promise<UserModel> {
    return await this.service.create({
      data,
      select: {
        id: true,
        username: true,
        roles: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: 'User',
    action: 'read',
    possession: 'any',
  })
  @common.Get()
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  @ApiNestedQuery(UserFindManyArgs)
  async list(@common.Req() request: Request): Promise<UserModel[]> {
    const args = plainToClass(UserFindManyArgs, request.query);
    return this.service.list({
      ...args,
      select: {
        id: true,
        username: true,
        roles: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  @common.UseInterceptors(AclFilterResponseInterceptor)
  @nestAccessControl.UseRoles({
    resource: 'User',
    action: 'read',
    possession: 'own',
  })
  @common.Get('/:id')
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async getById(
    @common.Param() params: UserWhereUniqueInput,
  ): Promise<UserModel | null> {
    const user = await this.service.getById(params.id, {
      select: {
        id: true,
        username: true,
        roles: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (user === null) {
      throw new errors.NotFoundException(
        `No resource was found for ${JSON.stringify(params)}`,
      );
    }
    return user;
  }

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @nestAccessControl.UseRoles({
    resource: 'User',
    action: 'update',
    possession: 'any',
  })
  @common.Patch('/:id')
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async updateById(
    @common.Param() params: UserWhereUniqueInput,
    @common.Body() data: UserUpdateDto,
  ): Promise<UserModel | null> {
    try {
      return await this.service.updateById(params.id, {
        data,
        select: {
          id: true,
          roles: true,
          username: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`,
        );
      }
      throw error;
    }
  }

  @nestAccessControl.UseRoles({
    resource: 'User',
    action: 'delete',
    possession: 'any',
  })
  @common.Delete('/:id')
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  @swagger.ApiForbiddenResponse({ type: errors.ForbiddenException })
  async deleteById(
    @common.Param() params: UserWhereUniqueInput,
  ): Promise<UserModel | null> {
    try {
      return await this.service.deleteById(params.id, {
        select: {
          id: true,
          username: true,
          roles: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`,
        );
      }
      throw error;
    }
  }
}
