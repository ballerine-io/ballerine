import { WorkflowTokenService } from '@/auth/workflow-token/workflow-token.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(protected readonly tokenService: WorkflowTokenService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request>();
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Unauthorized');
    }

    const tokenEntity = await this.tokenService.findByToken(token);

    if (!tokenEntity) throw new UnauthorizedException('Unauthorized');

    (req as any).tokenScope = tokenEntity;

    return true;
  }
}
