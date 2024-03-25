import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { ApiKey, Prisma } from '@prisma/client';

@Injectable()
export class ApiKeyRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async create<T extends Prisma.ApiKeyCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.ApiKeyCreateArgs>,
  ): Promise<ApiKey> {
    return await this.prisma.apiKey.create<T>(args);
  }

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
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

  // eslint-disable-next-line ballerine/verify-repository-project-scoped
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
