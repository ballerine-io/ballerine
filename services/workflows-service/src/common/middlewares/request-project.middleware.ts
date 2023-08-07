import { Injectable, NestMiddleware, Scope } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import {RequestProjectContext} from "@/common/utils/request-project-context";

@Injectable({ scope: Scope.REQUEST })
export class RequestProjectMiddleware implements NestMiddleware {

  use(req: Request, res: Response, next: NextFunction) {
    new RequestProjectContext(req);
    next();
  }
}
