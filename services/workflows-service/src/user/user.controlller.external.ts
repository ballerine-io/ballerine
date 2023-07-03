import * as common from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserModel } from './user.model';
import { Query } from '@nestjs/common';
import { GetActiveUsersDto } from '@/user/dtos/get-active-users.dto';
import { plainToClass } from 'class-transformer';
import { UseKeyAuthOrSessionGuard } from '@/common/decorators/use-key-auth-or-session-guard.decorator';
import { ApiOkResponse } from '@nestjs/swagger';
import { GetUsersCaseResolvingStatsDto } from '@/user/dtos/get-users-case-resolving-stats-input.dto';
import { UserCaseResolvingStatsModel } from '@/user/user-case-resolving-stats.model';

@swagger.ApiTags('external/users')
@common.Controller('external/users')
export class UserControllerExternal {
  constructor(protected readonly service: UserService) {}

  @common.Get('/active-users')
  @swagger.ApiOkResponse({ type: [UserModel] })
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

  @common.Get('/case-resolving-stats')
  @ApiOkResponse({ type: [UserCaseResolvingStatsModel] })
  async getUsersActivityStats(
    @common.Query() query: GetUsersCaseResolvingStatsDto,
  ): Promise<UserCaseResolvingStatsModel[]> {
    const results = await this.service.listUsersCaseResolveStats({ fromDate: query.fromDate });

    return results.map(result => plainToClass(UserCaseResolvingStatsModel, result));
  }
}
