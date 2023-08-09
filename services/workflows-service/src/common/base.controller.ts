import { Prisma } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import {Request} from "express";
import {Controller, Req} from "@nestjs/common";
import {AuthenticatedEntity, TProjectIds} from "@/types";

export interface PrismaGeneralQueryArgs {
  select?: Record<string, unknown> | null;
  include?: Record<string, unknown> | null;
  where?: Record<string, unknown> | null;
  orderBy?: Record<string, unknown> | null;
  cursor?: Record<string, unknown> | null;
  take?: number;
  skip?: number;
  distinct?: Record<string, unknown> | null;
}
export interface PrismaGeneralInsertArgs extends PrismaGeneralQueryArgs {
  data: Record<string, unknown> | null;
}

export interface PrismaGeneralUpsertArgs extends PrismaGeneralQueryArgs {
  create: Record<string, unknown> | null;
  update: Record<string, unknown> | null;
  where: Record<string, unknown> | null;
}
export class BaseController {
  scopeFindMany<T extends PrismaGeneralQueryArgs>(
    args?: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds?: TProjectIds): T {
    // @ts-ignore
    args ||= {};
    args!.where = {
      ...args?.where,
      projectId: projectIds,
    };

    return args!;
  }

  scopeFindOne<T extends PrismaGeneralQueryArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds?: TProjectIds
  ) {
    args.where = {
      ...args?.where,
      projectId: projectIds,
    };

    return args;
  }

  scopeCreate<T extends PrismaGeneralInsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralInsertArgs>,
    projectIds?: TProjectIds
  ) {
    args.data = {
      ...args.data,
      projectId: projectIds,
    };

    return args;
  }

  scopeUpdate<T extends Prisma.FilterUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>,
    projectIds?: TProjectIds
  ) {
    args = this.scopeCreate(args);
    args.where = {
      ...args.where,
      projectId: projectIds,
    };
    args.data = {
      ...args.data,
      projectId: projectIds,
    };
    return args;
  }

  scopeUpsert<T extends PrismaGeneralUpsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralUpsertArgs>,
    projectIds?: TProjectIds
  ) {
    args.where = {
      ...args.where,
      projectId: projectIds,
    };
    args.update = {
      ...args.update,
      projectId: projectIds,
    };
    args.create = {
      ...args.create,
      projectId: projectIds,
    };

    return args;
  }

  scopeDelete<T extends Prisma.FilterDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterDeleteArgs>,
    projectIds?: TProjectIds
  ) {
    args.where = {
      ...args.where,
      projectId: projectIds,
    };
    return args;
  }
}
