import { Injectable } from '@nestjs/common';
import { File, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { IFileIds } from './types';
import type { TProjectIds } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class FileRepository {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly scopeService: ProjectScopeService,
  ) {}

  async create<T extends Prisma.FileCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileCreateArgs>,
  ): Promise<File> {
    return await this.prisma.file.create<T>(args);
  }

  async findMany<T extends Prisma.FileFindManyArgs>(
    args: Prisma.SelectSubset<T, Prisma.FileFindManyArgs>,
    projectIds: TProjectIds,
  ): Promise<File[]> {
    return await this.prisma.file.findMany(this.scopeService.scopeFindMany(args, projectIds));
  }

  async findById<T extends Prisma.FileFindFirstArgs>(
    { id }: IFileIds,
    args: Prisma.SelectSubset<T, Prisma.FileFindFirstArgs>,
    projectIds: TProjectIds,
  ): Promise<File | null> {
    const { where, ...restArgs } = args;

    return await this.prisma.file.findFirst(
      this.scopeService.scopeFindFirst(
        {
          ...restArgs,
          where: { ...(where || {}), id },
        },
        projectIds,
      ),
    );
  }
}
