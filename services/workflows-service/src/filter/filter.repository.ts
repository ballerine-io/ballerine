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

  async findById(id: string, args?: Prisma.FilterFindFirstArgs) {
    return await this.prisma.filter.findFirst({
      ...args,
      where: { ...args?.where, id: id },
    });
  }

  async updateById(id: string, args: Prisma.FilterUpdateArgs): Promise<FilterModel> {
    return await this.prisma.filter.update({
      ...args,
      where: { ...args.where, id: id },
    });
  }
}
