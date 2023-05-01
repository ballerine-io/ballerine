import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserModel } from '@/user/user.model';
import { Request } from 'express';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';

@ApiTags('auth')
@Controller('internal/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @common.UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(
    @Req() req: Request,
    @Body() body: LoginDto,
  ): Promise<{ user: Express.User | undefined }> {
    return { user: req.user };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request): Promise<{ user: undefined }> {
    req.session.destroy(() => {});
    req.logOut(() => {});

    return { user: undefined };
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  async getSession(@Req() req: Request): Promise<{
    user: Express.User | undefined;
  }> {
    return {
      user: req?.user,
    };
  }
}
