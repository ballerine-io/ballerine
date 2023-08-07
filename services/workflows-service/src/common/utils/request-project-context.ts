import { Injectable, Scope } from '@nestjs/common';
import { Request } from 'express';
import { TProjectId } from "@/types";

@Injectable({ scope: Scope.REQUEST })
export class RequestProjectContext {
  constructor(private request: Request) {}

  getProjectIds(): TProjectId {
    // @ts-ignore
    return this.request?.user?.projectIds;
  }
}
