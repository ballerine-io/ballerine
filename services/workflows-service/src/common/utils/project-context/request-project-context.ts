import {Inject, Injectable, Scope} from '@nestjs/common';
import { TProjectId } from "@/types";
import { REQUEST } from '@nestjs/core';
import {Request} from "express";


@Injectable({ scope: Scope.REQUEST })
export class RequestProjectContext {
  constructor(@Inject(REQUEST) private request: Request) {}

  getProjectIds(): TProjectId {
    // @ts-ignore
    return this.request?.user?.projectIds;
  }
}
