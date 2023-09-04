import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserCreateDto } from '@/user/dtos/user-create';
import { Prisma } from '@prisma/client';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { UseGuards } from '@nestjs/common';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';

@swagger.ApiTags('internal/users')
@common.Controller('internal/users')
export class UserControllerInternal {
  constructor(protected readonly service: UserService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  async list(@ProjectIds() projectIds: TProjectIds): Promise<UserModel[]> {
    return this.service.list(
      {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
          updatedAt: true,
          createdAt: true,
        },
      },
      projectIds,
    );
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

    if (projectIds && projectIds.length > 0) {
      (userCreatInfo as Prisma.UserCreateInput).userToProjects = {
        createMany: {
          data: projectIds.map(projectId => {
            return { projectId };
          }),
          skipDuplicates: true,
        },
      };
    }

    // @ts-ignore
    delete userCreatInfo.projectIds;

    return this.service.create(
      {
        data: userCreatInfo,
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
      currentProjectId,
    );
  }
}
