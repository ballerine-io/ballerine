import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Injectable()
export class DefaultAuthGuard extends JwtAuthGuard {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext): ReturnType<JwtAuthGuard['canActivate']> {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }
}
