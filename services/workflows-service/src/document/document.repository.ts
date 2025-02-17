import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { DocumentFile, Document, Prisma, File } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { z } from 'zod';
import { isType, LoggerInterface } from '@ballerine/common';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- assert functions are expected to be function expressions
function assertIsDocumentWithFiles(
  documents: Document[],
  logger: LoggerInterface,
): asserts documents is Array<Document & { files: Array<DocumentFile & { file: File }> }> {
  const DocumentsWithFilesSchema = z.array(
    z.object({
      files: z.array(
        z.object({
          file: z.record(z.union([z.string(), z.number(), z.symbol()]), z.unknown()),
        }),
      ),
    }),
  );

  if (isType(DocumentsWithFilesSchema)(documents)) {
    return;
  }

  logger.error('Documents do not have files. Did you forget to specify `include` or `select`?');

  throw new InternalServerErrorException();
}

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
