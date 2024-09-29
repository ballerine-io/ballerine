import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class BullBoardAuthMiddleware implements NestMiddleware {
  constructor(private readonly config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (
      this.config.get('NODE_ENV') === 'production' &&
      req.session?.passport.user.type !== 'admin'
    ) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  }
}
