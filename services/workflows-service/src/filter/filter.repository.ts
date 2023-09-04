import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterModel } from './filter.model';
import { TProjectId, TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class FilterRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.FilterCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterCreateArgs>,
    projectId: TProjectId,
  ) {
    return await this.prisma.filter.create(this.scopeService.scopeCreate(args, projectId));
  }

  async findMany<T extends Prisma.FilterFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.filter.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async findById(id: string, args: Prisma.FilterFindFirstArgs, projectIds: TProjectIds) {
    return await this.prisma.filter.findFirst(
      this.scopeService.scopeFindFirst({
        ...args,
        where: { ...args?.where, id: id },
      }),
    );
  }

  async updateById(
    id: string,
    args: Prisma.FilterUpdateArgs,
    projectId: TProjectId,
  ): Promise<FilterModel> {
    return await this.prisma.filter.update(
      this.scopeService.scopeUpdate(
        {
          ...args,
          where: { ...args.where, id: id },
        },
        projectId,
      ),
    );
  }
}
