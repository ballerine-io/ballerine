import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login';
import { UserInfo } from '../user/user-info';

@ApiTags('auth')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginDto): Promise<UserInfo> {
    return this.authService.login(body);
  }
}
