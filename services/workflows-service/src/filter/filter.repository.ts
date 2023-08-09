import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterModel } from './filter.model';

@Injectable()
export class FilterRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.FilterCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FilterCreateArgs>,
  ) {
    return await this.prisma.filter.create(args);
  }

  async findMany<T extends Prisma.FilterFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.FilterFindManyArgs>,
  ) {
    return await this.prisma.filter.findMany(args);
  }

  async findById<T extends Omit<Prisma.FilterFindUniqueOrThrowArgs, 'where'>>(
    id: string,
    args?: Prisma.SelectSubset<T, Omit<Prisma.FilterFindUniqueOrThrowArgs, 'where'>>,
  ) {
    return await this.prisma.filter.findUniqueOrThrow({
      where: { id },
      ...args,
    });
  }

  async updateById<T extends Omit<Prisma.FilterUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Omit<Prisma.FilterUpdateArgs, 'where'>>,
  ): Promise<FilterModel> {
    return await this.prisma.filter.update({
      where: { id },
      ...args,
    });
  }
}
