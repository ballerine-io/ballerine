import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EndUserModel } from './end-user.model';
import { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class EndUserRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.EndUserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.EndUserCreateArgs>,
    projectId: TProjectId,
  ) {
    return await this.prisma.endUser.create(this.scopeService.scopeCreate(args, projectId));
  }

  async findMany<T extends Prisma.EndUserFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.EndUserFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.endUser.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async find<T extends Prisma.EndUserFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.EndUserFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.endUser.findFirst(this.scopeService.scopeFindOne(args, projectIds));
  }

  async findById<T extends Omit<Prisma.EndUserFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.endUser.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByCorrelationId<T extends Omit<Prisma.EndUserFindFirstArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindFirstArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.endUser.findFirst({
      where: { correlationId: id, projectId: { in: projectIds } },
      ...args,
    });
  }

  async findByCorrelationIdUnscoped<T extends Omit<Prisma.EndUserFindUniqueArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindUniqueArgs, 'where'>>,
  ) {
    return await this.prisma.endUser.findUnique({
      where: { correlationId: id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.EndUserUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserUpdateArgs, 'where'>>,
    projectId: TProjectId,
  ): Promise<EndUserModel> {
    return await this.prisma.endUser.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectId,
      ),
    );
  }

  async getCorrelationIdById(id: string, projectIds: TProjectIds): Promise<string | null> {
    const endUser = await this.prisma.endUser.findFirst(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          select: { correlationId: true },
        },
        projectIds,
      ),
    );

    return endUser ? endUser.correlationId : null;
  }
}
