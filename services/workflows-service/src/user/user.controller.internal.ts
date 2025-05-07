import * as common from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserCreateDto } from '@/user/dtos/user-create';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { UserStatus } from '@prisma/client';

@swagger.ApiExcludeController()
@common.Controller('internal/users')
export class UserControllerInternal {
  constructor(protected readonly userService: UserService) {}

  @common.Get()
  @swagger.ApiQuery({ name: 'projectId', type: String })
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  async list(
    @ProjectIds() projectIds: TProjectIds,
    @common.Query('projectId') projectId: string,
  ): Promise<UserModel[]> {
    return this.userService.list(
      {
        where: { status: UserStatus.Active },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          updatedAt: true,
          createdAt: true,
          roles: true,
        },
      },
      projectId ? [projectId] : projectIds,
    );
  }

  @common.Get(':id')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiParam({ name: 'id', type: String, description: 'User ID' })
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  @swagger.ApiForbiddenResponse()
  async getById(@common.Param('id') id: string): Promise<UserModel> {
    return this.userService.getByIdUnscoped(id, {
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        avatarUrl: true,
        updatedAt: true,
        createdAt: true,
        roles: true,
      },
    });
  }

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [UserModel] })
  @UseGuards(AdminAuthGuard)
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() userCreateInfo: UserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { projectIds, ...userInfo } = userCreateInfo;

    return this.userService.create(
      {
        data: userInfo,
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          roles: true,
          workflowRuntimeData: true,
        },
      },
      projectIds?.[0] || currentProjectId,
    );
  }
}
