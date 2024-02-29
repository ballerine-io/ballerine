import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import type { PrismaTransaction, TProjectId } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class WorkflowTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: TProjectId,
    data: Pick<
      Prisma.WorkflowRuntimeDataTokenUncheckedCreateInput,
      'workflowRuntimeDataId' | 'endUserId' | 'expiresAt'
    >,
    transaction: PrismaTransaction | PrismaService = this.prisma,
  ) {
    return await transaction.workflowRuntimeDataToken.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  async findByTokenUnscoped(token: string) {
    return await this.prisma.workflowRuntimeDataToken.findFirst({
      where: {
        token,
        AND: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
      },
    });
  }

  async deleteByTokenUnscoped(token: string) {
    return await this.prisma.workflowRuntimeDataToken.updateMany({
      data: {
        deletedAt: new Date(),
      },
      where: {
        token,
        AND: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
      },
    });
  }
}
