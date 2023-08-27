import { env } from '@/env';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class DemoGuard implements CanActivate {
  canActivate(): boolean {
    return Boolean(env.IS_DEMO);
  }
}
