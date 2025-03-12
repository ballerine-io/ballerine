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
    args?: Prisma.DocumentFileDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.deleteMany(
      this.projectScopeService.scopeDelete(
        {
          ...args,
          where: {
            ...args?.where,
            id,
          },
        },
        projectIds,
      ),
    );
  }

  async deleteByDocumentId(
    documentId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.documentFile.deleteMany(
      this.projectScopeService.scopeDelete(
        {
          ...args,
          where: {
            ...args?.where,
            documentId,
          },
        },
        projectIds,
      ),
    );
  }
}
