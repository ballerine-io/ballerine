import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserModel } from '@/user/user.model';
import { Request, Response } from 'express';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';

@ApiTags('auth')
@Controller('internal/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @common.UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  login(@Req() req: Request, @Body() body: LoginDto): { user: Express.User | undefined } {
    return { user: req.user };
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, res: Response): Promise<{ user: undefined }> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await req.logout({}, console.log);
    res.clearCookie('session', { path: '/', httpOnly: true });
    res.clearCookie('session.sig', { path: '/', httpOnly: true });
    // @ts-ignore
    return { user: undefined };
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  getSession(@Req() req: Request): {
    user: Express.User | undefined;
  } {
    return {
      user: req?.user,
    };
  }
}
