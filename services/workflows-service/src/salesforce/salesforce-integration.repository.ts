import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SalesforceIntegrationRepository {
  constructor(protected readonly prisma: PrismaService) {}

  async findByProjectId(projectId: string) {
    return await this.prisma.salesforceIntegration.findUnique({
      where: { projectId },
    });
  }

  async create(
    projectId: string,
    data: Omit<Prisma.SalesforceIntegrationUncheckedCreateInput, 'id' | 'projectId'>,
  ) {
    return await this.prisma.salesforceIntegration.create({
      data: { project: { connect: { id: projectId } }, ...data },
    });
  }

  async updateAccessToken(
    projectId: string,
    data: Pick<
      Prisma.SalesforceIntegrationUncheckedCreateInput,
      'accessToken' | 'accessTokenIssuedAt'
    >,
  ) {
    return await this.prisma.salesforceIntegration.update({
      where: { projectId },
      data: data,
    });
  }

  async removeByProjectId(projectId: string) {
    return await this.prisma.salesforceIntegration.delete({
      where: { projectId },
    });
  }
}
