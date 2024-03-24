import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import type { TProjectId, TProjectIds } from '@/types';
import { ApiKey, Prisma } from '@prisma/client';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class ApiKeyRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.ApiKeyCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ApiKeyCreateArgs>,
  ): Promise<ApiKey> {
    return await this.prisma.apiKey.create<T>(args);
  }

  async find(hashedKey: string) {
    return await this.prisma.apiKey.findFirst({
      include: {
        customer: {
          include: {
            projects: true,
          },
        },
      },
      where: {
        hashedKey,
        deletedAt: null,
      },
    });
  }

  async findMany<T extends Omit<Prisma.ApiKeyFindManyArgs, 'where'>>(customerId: string, args?: T) {
    return await this.prisma.apiKey.findMany({
      ...(args || {}),
      where: {
        customerId,
        deletedAt: null,
      },
    });
  }

  async delete(hashedKey: string): Promise<void> {
    await this.prisma.apiKey.update({
      where: {
        hashedKey,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
