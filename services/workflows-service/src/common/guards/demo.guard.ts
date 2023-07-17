import { env } from '@/env';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
@Injectable()
export class DemoGuard implements CanActivate {
  canActivate(): boolean {
    return this.isDemo() ? true : false;
  }

  private isDemo() {
    return env.NODE_ENV === 'demo';
  }
}
