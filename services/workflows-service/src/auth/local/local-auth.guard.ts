import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();

    await super.logIn(request);

    return (await super.canActivate(context)) as boolean;
  }
}
