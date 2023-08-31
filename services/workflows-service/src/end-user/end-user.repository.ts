import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EndUserModel } from './end-user.model';
import { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class EndUserRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.EndUserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.EndUserCreateArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prisma.endUser.create(this.scopeService.scopeCreate(args, projectIds));
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

  async findByIdUnscoped<T extends Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.endUser.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationIdUnscoped<T extends Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.endUser.findUnique({
      where: { correlationId: id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.EndUserUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserUpdateArgs, 'where'>>,
    projectIds: TProjectIds,
  ): Promise<EndUserModel> {
    return await this.prisma.endUser.update(
      this.scopeService.scopeUpdate(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async getCorrelationIdByIdUnscoped(id: string): Promise<string | null> {
    return (
      await this.prisma.endUser.findUniqueOrThrow({
        where: { id },
        select: { correlationId: true },
      })
    ).correlationId;
  }
}
