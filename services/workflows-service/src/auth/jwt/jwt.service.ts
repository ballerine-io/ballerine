import { UserInfo } from '@/user/user-info';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthService {
  constructor(private readonly jwtService: JwtService) {}

  signPayload(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload);
  }

  verifyToken(token: string): Promise<object> {
    return this.jwtService.verifyAsync(token);
  }
}
