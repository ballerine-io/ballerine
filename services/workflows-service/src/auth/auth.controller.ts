import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserInfo } from '../user/user-info';
import { UserModel } from '@/user/user.model';
import { UserData } from '@/user/user-data.decorator';

@ApiTags('auth')
@Controller('internal/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<UserInfo> {
    return this.authService.login(body);
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  async getSession(
    @UserData()
    userInfo: UserInfo,
  ): Promise<{
    user: UserInfo | undefined;
  }> {
    return {
      user: userInfo,
    };
  }
}
