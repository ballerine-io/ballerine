import { BadRequestException, Injectable } from '@nestjs/common';
import { DocumentRepository } from './document.repository';
import { Document, DocumentFile, Prisma } from '@prisma/client';
import { PrismaTransactionClient, TProjectId } from '@/types';
import { DocumentFileService } from '@/document-file/document-file.service';
import { StorageService } from '@/storage/storage.service';
import { FileService } from '@/providers/file/file.service';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { Static } from '@sinclair/typebox';
import { CreateDocumentSchema } from './dtos/document.dto';
import { CreateDocumentFileSchema } from '@/document-file/dtos/document-file.dto';
import { WorkflowService } from '@/workflow/workflow.service';

@Injectable()
export class DocumentService {
  constructor(
    protected readonly repository: DocumentRepository,
    protected readonly documentFileService: DocumentFileService,
    protected readonly fileService: FileService,
    protected readonly workflowService: WorkflowService,
    protected readonly storageService: StorageService,
  ) {}

  async create(
    {
      file,
      metadata,
      projectId,
      ...data
    }: Static<typeof CreateDocumentSchema> & {
      file: Express.Multer.File;
      metadata: Omit<
        Static<typeof CreateDocumentFileSchema>,
        'documentId' | 'fileId' | 'projectId'
      >;
      projectId: string;
    },
    args?: Prisma.DocumentCreateArgs,
    transaction?: PrismaTransactionClient,
  ) {
    if (!data.businessId && !data.endUserId) {
      throw new BadRequestException('Business or end user id is required');
    }

    if (data.businessId && data.endUserId) {
      throw new BadRequestException('Business and end user id cannot be set at the same time');
    }

    if (!data.workflowRuntimeDataId) {
      throw new BadRequestException('Workflow runtime data id is required');
    }

    const getEntityId = () => {
      if (data.businessId) {
        return data.businessId;
      }

      if (data.endUserId) {
        return data.endUserId;
      }

      throw new BadRequestException('Business or end user id is required');
    };

    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      data.workflowRuntimeDataId,
      {},
      [projectId],
    );

    const uploadedFile = await this.fileService.uploadNewFile(projectId, workflowRuntimeData, {
      ...file,
      mimetype:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType ||
        '',
    });
    const document = await this.repository.create(
      {
        ...data,
        ...(data.businessId && { businessId: data.businessId }),
        ...(data.endUserId && { endUserId: data.endUserId }),
        projectId,
      },
      args,
      transaction,
    );

    await this.documentFileService.create(
      {
        documentId: document.id,
        fileId: uploadedFile.id,
        projectId,
        ...metadata,
      },
      undefined,
      transaction,
    );

    const entityId = getEntityId();

    return await this.getByEntityIdAndWorkflowId(entityId, data.workflowRuntimeDataId, [projectId]);
  }

  async getByEntityIdAndWorkflowId(
    entityId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    args?: Omit<Prisma.DocumentFindManyArgs, 'where'>,
    transaction?: PrismaTransactionClient,
  ) {
    const documents = await this.repository.findByEntityIdAndWorkflowId(
      entityId,
      workflowRuntimeDataId,
      projectIds,
      {
        ...args,
        include: {
          ...args?.include,
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async updateById(
    id: string,
    projectIds: TProjectId[],
    data: Prisma.DocumentUpdateInput,
    args?: Prisma.DocumentUpdateManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.updateById(id, projectIds, data, args, transaction);

    const documents = await this.repository.findMany(
      projectIds,
      {
        include: {
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async deleteByIds(
    ids: string[],
    projectIds: TProjectId[],
    args?: Prisma.DocumentDeleteManyArgs,
    transaction?: PrismaTransactionClient,
  ) {
    await this.repository.deleteByIds(ids, projectIds, args, transaction);

    const documents = await this.repository.findMany(
      projectIds,
      {
        include: {
          files: true,
        },
      },
      transaction,
    );
    const documentsWithFiles = await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });

    return documentsWithFiles;
  }

  async fetchDocumentsFiles({
    documents,
    format,
  }: {
    documents: Array<Document & { files: DocumentFile[] }>;
    format: Parameters<StorageService['fetchFileContent']>[0]['format'];
  }) {
    return await Promise.all(
      documents?.map(async document => {
        const files = await Promise.all(
          document.files?.map(async file => {
            const uploadedFile = await this.storageService.fetchFileContent({
              id: file.fileId,
              projectIds: [document.projectId],
              format,
            });

            return {
              ...file,
              mimeType: uploadedFile.mimeType,
              signedUrl: uploadedFile.signedUrl,
            };
          }) ?? [],
        );

        return {
          ...document,
          files,
        };
      }) ?? [],
    );
  }

  async reuploadDocumentFileById(
    fileId: string,
    workflowRuntimeDataId: string,
    projectIds: TProjectId[],
    file: Express.Multer.File,
  ) {
    if (!projectIds[0]) {
      throw new BadRequestException('Project id is required');
    }

    const workflowRuntimeData = await this.workflowService.getWorkflowRuntimeDataById(
      workflowRuntimeDataId,
      {},
      projectIds,
    );
    const uploadedFile = await this.fileService.uploadNewFile(projectIds[0], workflowRuntimeData, {
      ...file,
      mimetype:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType ||
        '',
    });

    await this.documentFileService.updateById(fileId, {
      file: {
        connect: { id: uploadedFile.id },
      },
    });

    const documents = await this.repository.findMany(projectIds, {
      include: {
        files: true,
      },
    });

    return await this.fetchDocumentsFiles({
      documents: documents as Array<Document & { files: DocumentFile[] }>,
      format: 'signed-url',
    });
  }
}
