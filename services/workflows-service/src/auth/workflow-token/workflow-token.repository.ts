import { Prisma, PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import type { PrismaTransaction, TProjectId } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class WorkflowTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    projectId: TProjectId,
    data: Pick<
      Prisma.WorkflowRuntimeDataTokenUncheckedCreateInput,
      'workflowRuntimeDataId' | 'endUserId' | 'expiresAt'
    >,
    transaction: PrismaTransaction | PrismaService = this.prismaService,
  ) {
    return await transaction.workflowRuntimeDataToken.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async count(args: Prisma.WorkflowRuntimeDataTokenCountArgs, projectId: TProjectId) {
    return await this.prismaService.workflowRuntimeDataToken.count({
      ...args,
      where: { ...args.where, projectId },
    });
  }

  async findFirstByWorkflowRuntimeDataIdUnscoped(workflowRuntimeDataId: string) {
    return await this.prismaService.workflowRuntimeDataToken.findFirst({
      where: {
        workflowRuntimeDataId,
        deletedAt: null,
        expiresAt: { gt: new Date() },
      },
      take: 1,
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async findByTokenUnscoped(token: string) {
    return await this.prismaService.workflowRuntimeDataToken.findFirst({
      where: {
        token,
        AND: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
      },
    });
  }

  async findByTokenWithExpiredUnscoped(token: string) {
    return await this.prismaService.workflowRuntimeDataToken.findFirst({
      where: {
        token,
        deletedAt: null,
      },
    });
  }

  async deleteByTokenUnscoped(token: string) {
    return await this.prismaService.workflowRuntimeDataToken.updateMany({
      data: {
        deletedAt: new Date(),
      },
      where: {
        token,
        AND: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
      },
    });
  }

  async updateByToken(
    token: string,
    data: Prisma.WorkflowRuntimeDataTokenUpdateInput,
    transaction: PrismaTransaction | PrismaClient = this.prismaService,
  ) {
    return await transaction.workflowRuntimeDataToken.update({
      where: {
        token,
      },
      data,
    });
  }
}
