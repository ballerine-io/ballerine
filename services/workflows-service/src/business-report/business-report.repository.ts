import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class BusinessReportRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.BusinessReportCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportCreateArgs>,
  ) {
    return await this.prisma.businessReport.create(args);
  }

  async updateById<T extends Omit<Prisma.BusinessReportUpdateArgs, 'where'>>(
    { id }: { id: string },
    args: Prisma.SelectSubset<T, Prisma.BusinessReportUpdateArgs>,
  ) {
    return await this.prisma.businessReport.update({
      ...args,
      where: { id },
    });
  }
  async updateMany<T extends Prisma.BusinessReportUpdateManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportUpdateManyArgs>,
  ) {
    return await this.prisma.businessReport.updateMany(args);
  }

  async findMany<T extends Prisma.BusinessReportFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.businessReport.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async findFirstOrThrow<T extends Prisma.BusinessReportFindFirstArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessReportFindFirstArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.businessReport.findFirstOrThrow(
      this.scopeService.scopeFindFirst(args, projectIds),
    );
  }

  async findById<T extends Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessReportFindFirstOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.businessReport.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }
}
