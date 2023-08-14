import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserCreateDto } from '@/user/dtos/user-create';
import { Prisma } from '@prisma/client';
import { AdminAuthGuard } from '@/common/guards/admin-auth.guard';
import { UseGuards } from '@nestjs/common';

@swagger.ApiTags('internal/users')
@common.Controller('internal/users')
export class UserControllerInternal {
  constructor(protected readonly service: UserService) {}

  @common.Get()
  @swagger.ApiOkResponse({ type: [UserModel] })
  @swagger.ApiForbiddenResponse()
  async list(): Promise<UserModel[]> {
    return this.service.list({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        updatedAt: true,
        createdAt: true,
      },
    });
  }

  @common.Post()
  @swagger.ApiCreatedResponse({ type: [UserModel] })
  @UseGuards(AdminAuthGuard)
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() userCreatInfo: UserCreateDto) {
    const { projectIds, ...user } = userCreatInfo;

    if (projectIds && projectIds.length > 0) {
      (user as Prisma.UserCreateInput).userToProjects = {
        createMany: {
          data: projectIds.map(projectId => {
            return { projectId };
          }),
          skipDuplicates: true,
        },
      };
    }

    return this.service.create({
      data: user,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        roles: true,
        workflowRuntimeData: true,
      },
    });
  }
}
