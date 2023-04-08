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

  async findById<T extends Omit<Prisma.FileFindFirstArgs, 'where'>>(
    { id, userId }: IFileIds,
    args?: Prisma.SelectSubset<T, Omit<Prisma.FileFindFirstArgs, 'where'>>,
  ): Promise<File | null> {
    return await this.prisma.file.findFirst({
      where: { id, userId },
      ...args,
    });
  }

  async findNameById({ id, userId }: IFileIds) {
    return (
      await this.findById(
        {
          userId,
          id,
        },
        {
          select: {
            fileNameOnDisk: true,
          },
        },
      )
    )?.fileNameOnDisk;
  }
}
