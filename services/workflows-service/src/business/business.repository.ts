import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessModel } from './business.model';
import { ProjectScopeService } from '@/project/project-scope.service';
import { TProjectIds } from '@/types';

@Injectable()
export class BusinessRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
    projectIds: TProjectIds,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.business.create(this.scopeService.scopeCreate(args, projectIds));
  }

  async findMany<T extends Prisma.BusinessFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.business.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async findByIdUnscoped<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationIdUnscoped<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUnique({
      where: { correlationId: id },
      ...args,
    });
  }

  async getCorrelationIdByIdUnscoped(id: string): Promise<string | null> {
    return (
      await this.prisma.business.findUniqueOrThrow({
        where: { id },
        select: { correlationId: true },
      })
    ).correlationId;
  }

  async updateById<T extends Omit<Prisma.BusinessUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessUpdateArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<BusinessModel> {
    return await this.prisma.business.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }
}
