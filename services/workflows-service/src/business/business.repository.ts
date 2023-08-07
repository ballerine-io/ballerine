import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessModel } from './business.model';
import { ProjectScopedRepository } from '@/common/repositories/project-scoped.repository';

@Injectable()
export class BusinessRepository extends ProjectScopedRepository {
  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.business.create(this.scopeCreate(args));
  }

  async findMany<T extends Prisma.BusinessFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
  ) {
    // @ts-expect-error - Generic model args update
    return await this.prisma.business.findMany(this.scopeFindMany(args));
  }

  async findById<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUniqueOrThrow(
      this.scopeFindOne({
        where: { id },
        ...args,
      }),
    );
  }

  async findByCorrelationId<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUnique(
      this.scopeFindOne({
        where: { correlationId: id },
        ...args,
      }),
    );
  }

  async getCorrelationIdById(id: string): Promise<string | null> {
    return (
      await this.prisma.business.findUniqueOrThrow(
        this.scopeFindOne({
          where: { id },
          select: { correlationId: true },
        }),
      )
    ).correlationId;
  }

  async updateById<T extends Omit<Prisma.BusinessUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.BusinessUpdateArgs, 'where'>>,
  ): Promise<BusinessModel> {
    return await this.prisma.business.update(
      this.scopeUpdate({
        where: { id },
        ...args,
      }),
    );
  }
}
