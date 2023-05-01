import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class ExtendSessionMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.session!.touch();

    next();
  }
}
