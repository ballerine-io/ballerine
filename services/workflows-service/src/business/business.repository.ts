import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessModel } from './business.model';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectId, TProjectIds } from '@/types';

@Injectable()
export class BusinessRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
    projectId: TProjectId,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.business.create(this.scopeService.scopeCreate(args, projectId));
  }

  async findMany<T extends Prisma.BusinessFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.business.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async findById<T extends Omit<Prisma.BusinessFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.business.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByCorrelationId<T extends Omit<Prisma.BusinessFindFirstArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindFirstArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.business.findFirst(
      this.scopeService.scopeFindFirst(
        {
          where: { correlationId: id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async getCorrelationIdById(id: string, projectIds: TProjectIds): Promise<string | null> {
    return (
      await this.prisma.business.findFirstOrThrow(
        this.scopeService.scopeFindFirst(
          {
            where: { id },
            select: { correlationId: true },
          },
          projectIds,
        ),
      )
    ).correlationId;
  }

  async updateById<T extends Omit<Prisma.BusinessUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessUpdateArgs, 'where'>>,
    projectId: TProjectId,
  ): Promise<BusinessModel> {
    return await this.prisma.business.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectId,
      ),
    );
  }
}
