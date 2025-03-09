import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { assertIsDocumentWithFiles } from './helpers/assert-is-document-with-files';

@Injectable()
export class DocumentRepository {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly logger: AppLoggerService,
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
    return await transaction.document.findMany({
      ...args,
      where: {
        ...args?.where,
        projectId: { in: projectIds },
      },
    });
  }

  async findById(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindFirstArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    return await transaction.document.findFirst({
      ...args,
      where: {
        ...args?.where,
        id,
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

  async findByIdWithFiles(
    id: string,
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindFirstArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    if (!id) {
      throw new BadRequestException('Document ID is required');
    }

    const documentWithFiles = await transaction.document.findFirst({
      ...args,
      where: {
        ...args?.where,
        id,
        projectId: { in: projectIds },
      },
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });

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
    const documentsWithFiles = await transaction.document.findMany({
      ...args,
      where: {
        ...args?.where,
        OR: [{ businessId: entityId }, { endUserId: entityId }],
        workflowRuntimeDataId,
        projectId: { in: projectIds },
      },
      include: {
        ...args?.include,
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    assertIsDocumentWithFiles(documentsWithFiles, this.logger);

    return documentsWithFiles;
  }

  async findManyWithFiles(
    projectIds: TProjectId[],
    args?: Prisma.DocumentFindManyArgs,
    transaction: PrismaTransactionClient = this.prismaService,
  ) {
    const documentsWithFiles = await transaction.document.findMany({
      ...args,
      where: {
        ...args?.where,
        projectId: { in: projectIds },
      },
      include: {
        files: {
          include: {
            file: true,
          },
        },
      },
    });

    assertIsDocumentWithFiles(documentsWithFiles, this.logger);

    return documentsWithFiles;
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
