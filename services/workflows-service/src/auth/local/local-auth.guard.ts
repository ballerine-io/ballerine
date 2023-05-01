import { AuthGuard } from '@nestjs/passport';
import { ExecutionContext } from '@nestjs/common';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = await super.canActivate(context);
    const request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result as boolean;
  }
}
