import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserInfo } from '@/user/user-info';
import { UserModel } from '@/user/user.model';
import { Request } from 'express';

@ApiTags('auth')
@Controller('internal/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(
    @Req() req: Request,
    @Body() body: LoginDto,
  ): Promise<{ user: UserInfo | undefined }> {
    const { accessToken: _accessToken, ...user } = await this.authService.login(body);

    req.session = {
      user,
    };

    return { user: req.session?.user };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request): Promise<{ user: undefined }> {
    req.session = null;

    return { user: undefined };
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  async getSession(@Req() req: Request): Promise<{
    user: UserInfo | undefined;
  }> {
    return {
      user: req.session?.user,
    };
  }
}
