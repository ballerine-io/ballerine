import { Injectable } from '@nestjs/common';
import { Business, Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { PrismaTransaction } from '@/types';
import { BusinessCreateInputSchema } from '@/business/schemas';
import { ValidationError } from '@/errors';

@Injectable()
export class BusinessRepository {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
    transaction: PrismaClient | PrismaTransaction = this.prismaService,
  ) {
    const result = BusinessCreateInputSchema.safeParse(args.data);

    if (!result.success) {
      throw ValidationError.fromZodError(result.error);
    }

    return await transaction.business.create({
      ...args,
      data: result.data,
    });
  }

  async findMany<T extends Prisma.BusinessFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prismaService.business.findMany(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }

  async findManyUnscoped<T extends Prisma.BusinessFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
  ) {
    return await this.prismaService.business.findMany(args);
  }

  async findById<T extends Omit<Prisma.BusinessFindFirstOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindFirstOrThrowArgs, 'where'>>,
    projectIds: TProjectIds,
  ) {
    return await this.prismaService.business.findFirstOrThrow(
      this.scopeService.scopeFindFirst(
        {
          where: { id },
          ...args,
        },
        projectIds,
      ),
    );
  }

  async findByIdUnscoped<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
    transaction: PrismaClient | PrismaTransaction = this.prismaService,
  ) {
    return await transaction.business.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationId<T extends Omit<Prisma.BusinessFindFirstArgs, 'where'>>(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindFirstArgs, 'where'>>,
  ) {
    return await this.prismaService.business.findFirst(
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
      await this.prismaService.business.findFirstOrThrow(
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
    transaction: PrismaClient | PrismaTransaction = this.prismaService,
  ): Promise<Business> {
    return await transaction.business.update({
      where: { id },
      ...args,
    });
  }

  async count<T extends Prisma.BusinessCountArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCountArgs>,
    projectIds: TProjectIds,
  ) {
    return await this.prismaService.business.count(
      this.scopeService.scopeFindMany(args, projectIds),
    );
  }
}
