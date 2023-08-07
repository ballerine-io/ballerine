import { Request } from 'express';
import {TProjectId} from "@/types";

export class RequestProjectContext {
  private request: Request;

  constructor(req: Request) {
    this.request = req;
  }

  static getProjectId(): TProjectId {
    // @ts-ignore
    return this.request?.user?.projectIds;
  }
}
