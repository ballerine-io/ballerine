import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IFileIds } from './types';

@Injectable()
export class FileRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.FileCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileCreateArgs>,
  ): Promise<File> {
    return await this.prisma.file.create<T>(args);
  }

  async findMany<T extends Prisma.FileFindManyArgs>(
    args?: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>,
  ): Promise<File[]> {
    return await this.prisma.file.findMany(args);
  }

  async findById<T extends Prisma.FileFindFirstArgs>(
    { id }: IFileIds,
    args: Prisma.SelectSubset<T, Prisma.FileFindFirstArgs>,
  ): Promise<File | null> {
    const { where, ...restArgs } = args;

    return await this.prisma.file.findFirst({
      ...restArgs,
      where: { ...(where || {}), id },
    });
  }
}
