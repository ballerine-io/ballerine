import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { EndUserModel } from './end-user.model';

@Injectable()
export class EndUserRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.EndUserCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.EndUserCreateArgs>,
  ) {
    return await this.prisma.endUser.create(args);
  }

  async findMany<T extends Prisma.EndUserFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.EndUserFindManyArgs>,
  ) {
    return await this.prisma.endUser.findMany(args);
  }

  async findById<T extends Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.endUser.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async findByCorrelationId<T extends Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.EndUserFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.endUser.findUnique({
      where: { correlationId: id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.EndUserUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.EndUserUpdateArgs, 'where'>>,
  ): Promise<EndUserModel> {
    return await this.prisma.endUser.update({
      where: { id },
      ...args,
    });
  }

  async getCorrelationIdById(id: string): Promise<string | null> {
    return (
      await this.prisma.endUser.findUniqueOrThrow({
        where: { id },
        select: { correlationId: true },
      })
    ).correlationId;
  }
}
