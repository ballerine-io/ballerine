import * as common from '@nestjs/common';
import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import * as swagger from '@nestjs/swagger';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserModel } from '@/user/user.model';
import { Request } from 'express';
import { LocalAuthGuard } from '@/auth/local/local-auth.guard';
import { Public } from '@/common/decorators/public.decorator';

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
  logout(@Req() req: Request): { user: undefined } {
    req.session.destroy(() => {
      return;
    });
    req.logOut(() => {
      return;
    });

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
