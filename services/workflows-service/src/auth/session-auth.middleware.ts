import { ExecutionContext, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { SessionAuthGuard } from './session-auth.guard';

@Injectable()
export class SessionAuthMiddleware implements NestMiddleware {
  private sessionAuthGuard: SessionAuthGuard = new SessionAuthGuard();

  use(req: Request, res: Response, next: NextFunction) {
    if (isInternalAuthEndpoint(req.originalUrl)) {
      next();
      return;
    }

    if (
      !this.sessionAuthGuard.canActivate(<ExecutionContext>{
        switchToHttp: () => ({ getRequest: () => req }),
      })
    ) {
      res.status(401).send('Unauthorized');
      return;
    }

    next();
  }
}

function isInternalAuthEndpoint(url: string) {
  return RegExp('^/api/v(\\d)+/internal/auth').test(url);
}
