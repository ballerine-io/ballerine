import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { PrismaService } from '@/prisma/prisma.service';
import { ProjectScopeService } from '@/project/project-scope.service';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { assertIsDocumentWithFiles } from './helpers/assert-is-document-with-files';

@Injectable()
export class DocumentRepository {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly logger: AppLoggerService,
    protected readonly projectScopeService: ProjectScopeService,
  ) {}

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
    return await transaction.document.findMany(
      this.projectScopeService.scopeFindMany(args, projectIds),
    );
  }

  async findById(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindFirstArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.findFirst(
      this.projectScopeService.scopeFindOne(
        // @ts-expect-error - dynamically typed for all queries
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

  async findByEntityIdAndWorkflowId(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return transaction.document.findMany(
      this.projectScopeService.scopeFindMany(
        {
          ...args,
          where: {
            ...args?.where,
            OR: [{ businessId: entityId }, { endUserId: entityId }],
            workflowRuntimeDataId,
          },
        },
        projectIds,
      ),
    );
  }

  async updateMany(
    projectIds: TProjectId[],
    args: { data: Prisma.DocumentUpdateManyArgs['data'] } & Partial<Prisma.DocumentUpdateManyArgs>,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.updateMany(
      this.projectScopeService.scopeUpdateMany(args, projectIds),
    );
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentUpdateInput,
    args?: Omit<Prisma.DocumentUpdateManyArgs, 'data'>,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.updateMany(
      this.projectScopeService.scopeUpdateMany(
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

  async findByIdWithFiles(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindFirstArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    if (!id) {
      throw new BadRequestException('Document ID is required');
    }

    const documentWithFiles = await transaction.document.findFirst(
      this.projectScopeService.scopeFindOne(
        // @ts-expect-error - dynamically typed for all queries
        {
          ...args,
          where: {
            ...args?.where,
            id,
          },
          include: {
            files: {
              include: {
                file: true,
              },
            },
          },
        },
        projectIds,
      ),
    );

    if (!documentWithFiles) {
      return null;
    }

    const documentWithFilesAsArray = [documentWithFiles];

    assertIsDocumentWithFiles(documentWithFilesAsArray, this.logger);

    return documentWithFilesAsArray[0];
  }

  async findByEntityIdAndWorkflowIdWithFiles(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    const documentsWithFiles = await transaction.document.findMany(
      this.projectScopeService.scopeFindMany(
        {
          ...args,
          where: {
            ...args?.where,
            OR: [{ businessId: entityId }, { endUserId: entityId }],
            workflowRuntimeDataId,
          },
          include: {
            ...args?.include,
            files: {
              include: {
                file: true,
              },
            },
          },
        },
        projectIds,
      ),
    );

    assertIsDocumentWithFiles(documentsWithFiles, this.logger);

    return documentsWithFiles;
  }

  async findByEntityIdsAndWorkflowIdWithFiles(
    entityIds: string[],
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    const documentsWithFiles = await transaction.document.findMany(
      this.projectScopeService.scopeFindMany(
        {
          ...args,
          where: {
            ...args?.where,
            OR: [{ businessId: { in: entityIds } }, { endUserId: { in: entityIds } }],
            workflowRuntimeDataId,
          },
          include: {
            ...args?.include,
            files: {
              include: {
                file: true,
              },
            },
          },
        },
        projectIds,
      ),
    );

    assertIsDocumentWithFiles(documentsWithFiles, this.logger);

    return documentsWithFiles;
  }

  async findManyWithFiles(
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    const documentsWithFiles = await transaction.document.findMany(
      this.projectScopeService.scopeFindMany(
        {
          ...args,
          where: {
            ...args?.where,
          },
          include: {
            files: {
              include: {
                file: true,
              },
            },
          },
        },
        projectIds,
      ),
    );

    assertIsDocumentWithFiles(documentsWithFiles, this.logger);

    return documentsWithFiles;
  }

  async deleteByIds(
    ids: string[],
    projectIds: TProjectId[],
    args?: Prisma.DocumentDeleteManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.deleteMany(
      this.projectScopeService.scopeDelete(
        {
          ...args,
          where: {
            ...args?.where,
            id: { in: ids },
          },
        },
        projectIds,
      ),
    );
  }

  async findDocumentFiles(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFileFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.documentFile.findMany({
      ...args,
      where: {
        ...args?.where,
        documentId: id,
        projectId: { in: projectIds },
      },
    });
  }
}
