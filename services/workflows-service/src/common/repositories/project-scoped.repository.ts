import { Prisma } from '@prisma/client';
import { RequestProjectContext } from '@/common/utils/request-project-context';
import { PrismaService } from '@/prisma/prisma.service';

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
export class ProjectScopedRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly requestProjectContext: RequestProjectContext
  ) {}
  scopeFindMany<T extends PrismaGeneralQueryArgs>(
    args?: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
  ): T {
    const projectId = this.requestProjectContext.getProjectIds();

    // @ts-ignore
    args ||= {};
    args!.where = {
      ...args?.where,
      projectId: projectId,
    };

    return args!;
  }

  scopeFindOne<T extends PrismaGeneralQueryArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralQueryArgs>,
  ) {
    const projectIds = this.requestProjectContext.getProjectIds();
    // if proejct/user == admin ... dont filter by project
    args.where = {
      ...args?.where,
      projectId: projectIds,
    };

    return args;
  }

  scopeCreate<T extends PrismaGeneralInsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralInsertArgs>,
  ) {
    const projectId = this.requestProjectContext.getProjectIds();

    args.data = {
      ...args.data,
      projectId: projectId,
    };

    return args;
  }

  scopeUpdate<T extends Prisma.FilterUpdateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterUpdateArgs>,
  ) {
    const projectId = this.requestProjectContext.getProjectIds();

    args = this.scopeCreate(args);
    args.where = {
      ...args.where,
      projectId: projectId,
    };
    args.data = {
      ...args.data,
      projectId: projectId,
    };
    return args;
  }

  scopeUpsert<T extends PrismaGeneralUpsertArgs>(
    args: Prisma.SelectSubset<T, PrismaGeneralUpsertArgs>,
  ) {
    const projectId = this.requestProjectContext.getProjectIds();
    args.where = {
      ...args.where,
      projectId: projectId,
    };
    args.update = {
      ...args.update,
      projectId: projectId,
    };
    args.create = {
      ...args.create,
      projectId: projectId,
    };

    return args;
  }

  scopeDelete<T extends Prisma.FilterDeleteArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterDeleteArgs>,
  ) {
    const projectId = this.requestProjectContext.getProjectIds();
    args.where = {
      ...args.where,
      projectId: projectId,
    };
    return args;
  }
}
