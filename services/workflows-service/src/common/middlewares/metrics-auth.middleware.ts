import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { env } from '@/env';
import { ClsService } from 'nestjs-cls';

@Injectable({ scope: Scope.REQUEST })
export class MetricsAuthMiddleware implements NestMiddleware {
  constructor(private readonly cls: ClsService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split?.(' ')?.[1];

    if (!!token && token === env.METRICS_TOKEN) {
      const entity = {
        projectIds: ['*'],
        type: 'metrics',
      };
      this.cls.set('entity', entity);
      (req as any).user = entity;
      
return next();
    }

    return res.status(401).send('Unauthorized');
  }
}
