import { PrismaService } from '@/prisma/prisma.service';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentRepository {
  constructor(protected readonly prismaService: PrismaService) {}

  async create(
    data: Prisma.DocumentUncheckedCreateInput,
    args?: Prisma.DocumentCreateArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.document.create({
      ...args,
      data,
    });
  }

  async createMany(
    data: Prisma.DocumentCreateManyInput[],
    args?: Prisma.DocumentCreateManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.document.createMany({ ...args, data });
  }

  async findMany(
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.findMany({
      ...args,
      where: {
        ...args?.where,
        projectId: { in: projectIds },
      },
    });
  }

  async findByEntityIdAndWorkflowId(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.document.findMany({
      ...args,
      where: {
        ...args?.where,
        OR: [{ businessId: entityId }, { endUserId: entityId }],
        workflowRuntimeDataId,
        projectId: { in: projectIds },
      },
    });
  }

  async updateMany(
    projectIds: TProjectId[],
    args: { data: Prisma.DocumentUpdateManyArgs['data'] } & Partial<Prisma.DocumentUpdateManyArgs>,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.updateMany({
      ...args,
      where: {
        ...args?.where,
        projectId: { in: projectIds },
      },
    });
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentUpdateInput,
    args?: Prisma.DocumentUpdateManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.updateMany({
      ...args,
      where: {
        ...args?.where,
        id,
        projectId: { in: projectIds },
      },
      data,
    });
  }

  async deleteByIds(
    ids: string[],
    projectIds: TProjectId[],
    args?: Prisma.DocumentDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.deleteMany({
      ...args,
      where: {
        ...args?.where,
        id: { in: ids },
        projectId: { in: projectIds },
      },
    });
  }
}
