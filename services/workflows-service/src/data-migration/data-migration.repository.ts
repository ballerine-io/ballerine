import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DataMigrationVersion, Prisma } from '@prisma/client';

@Injectable()
export class DataMigrationRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async getLatestTimestamp() {
    return await this.prisma.dataMigrationVersion.findFirst({
      where: { status: 'completed' },
      orderBy: {
        version: 'desc',
      },
    });
  }

  async create<T extends Prisma.DataMigrationVersionCreateArgs>(
    args: Prisma.SelectSubset<T, Prisma.DataMigrationVersionCreateArgs>,
  ): Promise<DataMigrationVersion> {
    return await this.prisma.dataMigrationVersion.create(args);
  }

  async updateById<T extends Omit<Prisma.DataMigrationVersionUpdateArgs, 'where'>>(
    id: string,
    args: Prisma.SelectSubset<T, Prisma.DataMigrationVersionUpdateArgs>,
  ): Promise<DataMigrationVersion> {
    return await this.prisma.dataMigrationVersion.update({
      where: { id },
      data: args.data,
    });
  }
}
