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

@swagger.ApiTags('internal/users')
@common.Controller('internal/users')
export class UserControllerInternal {
  constructor(protected readonly service: UserService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  async list(@ProjectIds() projectIds: TProjectIds): Promise<UserModel[]> {
    const userList = await this.service.list(
      {
        where: { status: { in: [UserStatus.Active, UserStatus.Blocked] } },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          avatarUrl: true,
          updatedAt: true,
          createdAt: true,
        },
      },
      projectIds,
    );

    return userList.sort((a, b) => {
      if (a.status === UserStatus.Active && b.status === UserStatus.Blocked) return -1;
      if (a.status === UserStatus.Blocked && b.status === UserStatus.Active) return 1;

      return a.firstName.localeCompare(b.firstName);
    });
  }

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [UserModel] })
  @UseGuards(AdminAuthGuard)
  @swagger.ApiForbiddenResponse()
  async create(
    @common.Body() userCreatInfo: UserCreateDto,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    const { projectIds, ...userInfo } = userCreatInfo;

    return this.service.create(
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
