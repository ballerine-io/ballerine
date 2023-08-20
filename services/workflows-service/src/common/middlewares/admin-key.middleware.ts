import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { env } from '@/env';

@Injectable({ scope: Scope.REQUEST })
export class AdminKeyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const apiKey = authHeader?.split?.(' ')?.[1];

    if (!!apiKey && apiKey == env.ADMIN_API_KEY) {
      req.user = {
        // @ts-ignore
        projectIds: ['*'],
        type: 'admin',
      };
    }

    next();
  }
}
