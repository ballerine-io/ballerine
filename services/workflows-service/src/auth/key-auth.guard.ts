import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class KeyAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();

    const authHeader = req.headers.authorization || '';
    const apiKey = authHeader.split(' ')[1];

    if (apiKey !== process.env.API_KEY) {
      throw new UnauthorizedException('Invalid API key');
    }

    return true;
  }
}
