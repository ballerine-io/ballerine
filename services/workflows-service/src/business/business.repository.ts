import { Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessModel } from './business.model';
import { ProjectScopeService } from '@/project/project-scope.service';
import type { TProjectIds } from '@/types';
import { PrismaTransaction } from '@/types';
import { BusinessCreateInputSchema } from '@/business/schemas';
import { ValidationError } from '@/errors';

@Injectable()
export class BusinessRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
    transaction: PrismaClient | PrismaTransaction = this.prisma,
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

  async findByIdUnscoped<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationId<T extends Omit<Prisma.BusinessFindFirstArgs, 'where'>>(
    id: string,
    projectIds: TProjectIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindFirstArgs, 'where'>>,
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
    transaction: PrismaClient | PrismaTransaction = this.prisma,
  ): Promise<BusinessModel> {
    return await transaction.business.update({
      where: { id },
      ...args,
    });
  }
}
