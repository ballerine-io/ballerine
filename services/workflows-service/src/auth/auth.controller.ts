import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post, Req, Res } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserModel } from '@/user/user.model';
import type { Request, Response } from 'express';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';
import util from 'util';
import { Public } from '@/common/decorators/public.decorator';
import type { AuthenticatedEntity } from '@/types';
import { User } from '@prisma/client';

@Public()
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
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ user: undefined }> {
    const asyncLogout = util.promisify(req.logout.bind(req));
    await asyncLogout();
    res.clearCookie('session');
    res.clearCookie('session.sig');

    return { user: undefined };
  }

  @common.Get('session')
  @swagger.ApiOkResponse({ type: UserModel })
  getSession(@Req() req: Request): {
    user: Partial<User> | undefined;
  } {
    return {
      user: (req?.user as unknown as AuthenticatedEntity)?.user,
    };
  }
}
