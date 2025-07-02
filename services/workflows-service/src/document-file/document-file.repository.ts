import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { ProjectScopeService } from '@/project/project-scope.service';

@Injectable()
export class DocumentFileRepository {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly projectScopeService: ProjectScopeService,
  ) {}

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
    return transaction.documentFile.findMany(
      this.projectScopeService.scopeFindMany(
        {
          ...args,
          where: {
            ...args?.where,
            deletedAt: null,
            documentId,
          },
        },
        projectIds,
      ),
    );
  }

  async updateById(
    id: string,
    data: Prisma.DocumentFileUpdateInput,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileUpdateArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.update(
      this.projectScopeService.scopeUpdate(
        {
          ...args,
          data,
          where: {
            ...args?.where,
            id,
          },
        },
        projectIds,
      ),
    );
  }

  async deleteById(
    id: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFileUpdateManyArgs, 'data'>,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.updateMany(
      this.projectScopeService.scopeUpdateMany(
        {
          ...args,
          where: {
            ...args?.where,
            deletedAt: null,
            id,
          },
          data: {
            deletedAt: new Date(),
          },
        },
        projectIds,
      ),
    );
  }

  async deleteByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFileUpdateManyArgs, 'data'>,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.updateMany(
      this.projectScopeService.scopeUpdateMany(
        {
          ...args,
          where: {
            ...args?.where,
            deletedAt: null,
            documentId,
          },
          data: {
            deletedAt: new Date(),
          },
        },
        projectIds,
      ),
    );
  }

  async deleteManyByDocumentIds(
    documentIds: string[],
    projectIds: TProjectId[],
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.updateMany(
      this.projectScopeService.scopeUpdateMany(
        {
          where: {
            deletedAt: null,
            documentId: { in: documentIds },
          },
          data: {
            deletedAt: new Date(),
          },
        },
        projectIds,
      ),
    );
  }
}
