import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { Query } from '@nestjs/common';
import { GetActiveUsersDto } from '@/user/dtos/get-active-users.dto';
import { plainToClass } from 'class-transformer';
import { UseKeyAuthGuard } from '@/common/decorators/use-key-auth-guard.decorator';

@swagger.ApiTags('external/users')
@common.Controller('external/users')
export class UserControllerExternal {
  constructor(protected readonly service: UserService) {}

  @common.Get('/active-users')
  @swagger.ApiOkResponse({ type: [UserModel] })
  @UseKeyAuthGuard()
  async getActiveUsers(@Query() query: GetActiveUsersDto) {
    const results = await this.service.list({
      where: {
        lastActiveAt: {
          ...(query.fromDate ? { gte: query.fromDate } : { not: null }),
        },
      },
    });

    return results.map(result => plainToClass(UserModel, result));
  }
}
