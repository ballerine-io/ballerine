import { Prisma } from '@prisma/client';
import { TProjectId, TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';

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

@Injectable()
export class ProjectScopeService {
  scopeFindMany<T>(
    args?: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds?: TProjectIds,
  ): T {
    // @ts-expect-error - dynamically typed for all queries
    args ||= {};
    // @ts-expect-error - dynamically typed for all queries
    args!.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args?.where,
      project: {
        id: { in: projectIds },
      },
    };

    return args!;
  }

  scopeFindOne<T>(
    args: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds: TProjectIds,
  ): T {
    // @ts-expect-error
    args.where = {
      // @ts-expect-error
      ...args.where,
      project: {
        id: {
          in: projectIds,
        },
      },
    };

    return args as T;
  }

  scopeFindFirst<T>(args: any, projectIds?: TProjectIds): any {
    args.where = {
      ...args.where,
      project: {
        id: {
          in: projectIds,
        },
      },
    };

    return args;
  }

  scopeCreate<T>(args: Prisma.SelectSubset<T, PrismaGeneralInsertArgs>, projectId?: TProjectId) {
    // @ts-expect-error - dynamically typed for all queries
    args.data = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.data,
      project: {
        connect: {
          id: projectId,
        },
      },
    };

    return args;
  }

  scopeUpdate<T>(args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>, projectId: TProjectId) {
    args = this.scopeCreate(args);
    // @ts-expect-error - dynamically typed for all queries
    args.data = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.data,
      project: {
        connect: {
          id: projectId,
        },
      },
    };

    return args;
  }

  scopeUpsert<T>(args: Prisma.SelectSubset<T, PrismaGeneralUpsertArgs>, projectId?: TProjectId) {
    // @ts-expect-error - dynamically typed for all queries
    args.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.where,
      project: {
        id: { in: projectId ? [projectId] : [] },
      },
    };
    // @ts-expect-error - dynamically typed for all queries
    args.update = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.update,
      projectId: projectId,
    };
    // @ts-expect-error - dynamically typed for all queries
    args.create = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.create,
      project: {
        connect: {
          id: projectId,
        },
      },
    };

    return args;
  }

  scopeDelete<T>(args: Prisma.SelectSubset<T, Prisma.FilterDeleteArgs>, projectIds?: TProjectIds) {
    // @ts-expect-error - dynamically typed for all queries
    args.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.where,
      project: {
        id: {
          in: projectIds,
        },
      },
    };
    return args;
  }

  scopeGroupBy<T>(
    args: Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any>,
    projectIds?: TProjectIds,
  ): Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any> {
    args.where = {
      ...args.where,
      project: {
        id: {
          in: projectIds,
        },
      },
    };

    return args;
  }
}
