import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { TProjectId } from '@/types';
import { PrismaService } from '@/prisma/prisma.service';
import { randomUUID } from 'crypto';

@Injectable()
export class WorkflowTokenRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    projectId: TProjectId,
    data: Pick<
      Prisma.WorkflowRuntimeDataTokenUncheckedCreateInput,
      'workflowRuntimeDataId' | 'endUserId' | 'expiresAt'
    >,
  ) {
    const token = randomUUID();

    return await this.prisma.workflowRuntimeDataToken.create({
      data: {
        ...data,
        token,
        projectId,
      },
    });
  }

  async findByTokenUnscoped(token: string) {
    return await this.prisma.workflowRuntimeDataToken.findFirst({
      where: {
        token,
        OR: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
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
        OR: [{ expiresAt: { gt: new Date() } }, { deletedAt: null }],
      },
    });
  }
}
