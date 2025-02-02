import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';

@Injectable()
export class DocumentFileRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.DocumentFileUncheckedCreateInput,
    args?: Prisma.DocumentFileCreateArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.create({
      ...args,
      data,
    });
  }

  async createMany(
    data: Prisma.Enumerable<Prisma.DocumentFileCreateManyInput>,
    args?: Prisma.DocumentFileCreateManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.createMany({
      ...args,
      data,
    });
  }

  async findByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.findMany({
      ...args,
      where: {
        ...args?.where,
        documentId,
        projectId: { in: projectIds },
      },
    });
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentFileUncheckedUpdateManyInput,
    args?: Prisma.DocumentFileUpdateManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.updateMany({
      ...args,
      where: {
        ...args?.where,
        id,
        projectId: { in: projectIds },
      },
      data,
    });
  }

  async deleteById(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.deleteMany({
      ...args,
      where: {
        ...args?.where,
        id,
        projectId: { in: projectIds },
      },
    });
  }

  async deleteByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.deleteMany({
      ...args,
      where: {
        ...args?.where,
        documentId,
        projectId: { in: projectIds },
      },
    });
  }
}
