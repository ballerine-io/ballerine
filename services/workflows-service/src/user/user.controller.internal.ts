import * as common from '@nestjs/common';
import { UseGuards, NotFoundException, BadRequestException } from '@nestjs/common';
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
          status: true,
          lastActiveAt: true,
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
        status: true,
        lastActiveAt: true,
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

  @common.Put(':id')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiParam({ name: 'id', type: String, description: 'User ID' })
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  @swagger.ApiForbiddenResponse()
  async update(
    @common.Param('id') id: string,
    @common.Body()
    updateData: Partial<{
      firstName: string;
      lastName: string;
      phone: string;
      avatarUrl: string;
      roles: string[];
      status: UserStatus;
    }>,
  ): Promise<UserModel> {
    try {
      // Check if user exists
      const existingUser = await this.userService.getByIdUnscoped(id, {});

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Update user
      return await this.userService.updateById(id, {
        data: updateData,
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
          status: true,
          lastActiveAt: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to update user');
    }
  }

  @common.Delete(':id')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiParam({ name: 'id', type: String, description: 'User ID' })
  @swagger.ApiOkResponse({ description: 'User deleted successfully' })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  @swagger.ApiForbiddenResponse()
  async delete(@common.Param('id') id: string): Promise<{ success: boolean }> {
    try {
      // Check if user exists
      const existingUser = await this.userService.getByIdUnscoped(id, {});

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Soft delete by setting status to Deleted
      await this.userService.updateById(id, {
        data: { status: UserStatus.Deleted },
      });

      return { success: true };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to delete user');
    }
  }

  @common.Post(':id/block')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiParam({ name: 'id', type: String, description: 'User ID' })
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  @swagger.ApiForbiddenResponse()
  async blockUser(@common.Param('id') id: string): Promise<UserModel> {
    try {
      // Check if user exists
      const existingUser = await this.userService.getByIdUnscoped(id, {});

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Block user
      return await this.userService.updateById(id, {
        data: { status: UserStatus.Blocked },
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
          status: true,
          lastActiveAt: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to block user');
    }
  }

  @common.Post(':id/unblock')
  @UseGuards(AdminAuthGuard)
  @swagger.ApiParam({ name: 'id', type: String, description: 'User ID' })
  @swagger.ApiOkResponse({ type: UserModel })
  @swagger.ApiNotFoundResponse({ description: 'User not found' })
  @swagger.ApiForbiddenResponse()
  async unblockUser(@common.Param('id') id: string): Promise<UserModel> {
    try {
      // Check if user exists
      const existingUser = await this.userService.getByIdUnscoped(id, {});

      if (!existingUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      // Unblock user
      return await this.userService.updateById(id, {
        data: { status: UserStatus.Active },
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
          status: true,
          lastActiveAt: true,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      throw new BadRequestException('Failed to unblock user');
    }
  }
}
