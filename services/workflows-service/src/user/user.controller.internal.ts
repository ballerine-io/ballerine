import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { UserRepository } from '@/user/user.repository';
import { UserCreateDto } from '@/user/dtos/user-create';

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
  @swagger.ApiForbiddenResponse()
  async create(@common.Body() userCreatInfo: UserCreateDto) {
    return this.service.create({
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
    });
  }
}
