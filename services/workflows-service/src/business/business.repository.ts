import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BusinessModel } from './business.model';

@Injectable()
export class BusinessRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.BusinessCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.BusinessCreateArgs>,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return await this.prisma.business.create(args);
  }

  async findMany<T extends Prisma.BusinessFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.BusinessFindManyArgs>,
  ) {
    return await this.prisma.business.findMany(args);
  }

  async findById<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationId<T extends Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.BusinessFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.business.findUnique({
      where: { correlationId: id },
      ...args,
    });
  }

  async getCorrelationIdById(id: string): Promise<string | null> {
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
  ): Promise<BusinessModel> {
    return await this.prisma.business.update({
      where: { id },
      ...args,
    });
  }
}
