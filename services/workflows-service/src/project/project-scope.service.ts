import type { TProjectIds } from '@/types';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { checkIsNonEmptyArrayOfNonEmptyStrings } from '@ballerine/common';

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

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function assertIsValidProjectIds(
  projectIds: unknown,
): asserts projectIds is NonNullable<TProjectIds> {
  if (checkIsNonEmptyArrayOfNonEmptyStrings(projectIds)) {
    return;
  }

  throw new InternalServerErrorException(
    'Project IDs must be a non-empty array of non-empty strings',
  );
}

@Injectable()
export class ProjectScopeService {
  scopeFindMany<T>(
    args?: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds?: TProjectIds,
  ): T {
    assertIsValidProjectIds(projectIds);

    // @ts-expect-error - dynamically typed for all queries
    args ||= {};
    // @ts-expect-error - dynamically typed for all queries
    args!.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args?.where,
      project:
        typeof projectIds === 'string'
          ? { id: projectIds } // Single ID
          : { id: { in: projectIds } }, // Array of IDs
    };

    return args!;
  }

  scopeFindOne<T>(
    args: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
    projectIds: TProjectIds,
  ): T {
    assertIsValidProjectIds(projectIds);

    // @ts-expect-error
    args.where = {
      // @ts-expect-error
      ...args.where,
      projectId: {
        in: projectIds,
      },
    };

    return args as T;
  }

  scopeUpdateMany<T>(
    args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>,
    projectIds: TProjectIds,
  ): T {
    assertIsValidProjectIds(projectIds);
    // @ts-expect-error - dynamically typed for all queries
    args.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.where,
      project: {
        id: { in: projectIds },
      },
    };

    return args as T;
  }

  scopeUpdate<T>(
    args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>,
    projectIds: TProjectIds,
  ): T {
    assertIsValidProjectIds(projectIds);

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

    return args as T;
  }

  scopeFindFirst<T>(args: any, projectIds?: TProjectIds): any {
    assertIsValidProjectIds(projectIds);

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

  scopeDelete<T>(args: Prisma.SelectSubset<T, Prisma.FilterDeleteArgs>, projectIds?: TProjectIds) {
    assertIsValidProjectIds(projectIds);

    // @ts-expect-error - dynamically typed for all queries
    args.where = {
      // @ts-expect-error - dynamically typed for all queries
      ...args.where,
      ...(projectIds
        ? {
            project: {
              id: {
                in: projectIds,
              },
            },
          }
        : {}),
    };

    return args;
  }

  scopeGroupBy<T>(
    args: Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any>,
    projectIds?: TProjectIds,
  ): Prisma.SubsetIntersection<T, Prisma.WorkflowRuntimeDataGroupByArgs, any> {
    assertIsValidProjectIds(projectIds);

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
