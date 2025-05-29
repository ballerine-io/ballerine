import { DocumentRepository } from '@/document/document.repository';
import { DocumentService } from '@/document/document.service';
import { TProjectId } from '@/types';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStatus, Prisma } from '@prisma/client';
import { CreateDocumentDto } from '../dto/create-document.dto';
import {
  beginTransactionIfNotExistCurry,
  defaultPrismaTransactionOptions,
} from '@/prisma/prisma.util';
import { PrismaService } from '@/prisma/prisma.service';
import { CollectionFlowDocumentModel } from '../models/collection-flow-document.model';
import { CollectionFlowFileModel } from '../models/collection-flow-file.model';
import { validate } from 'class-validator';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isObject } from '@ballerine/common';
import { DocumentFileRepository } from '@/document-file/document-file.repository';

@Injectable()
export class CollectionFlowDocumentsService {
  constructor(
    protected readonly prismaService: PrismaService,
    protected readonly documentRepository: DocumentRepository,
    protected readonly documentService: DocumentService,
    protected readonly documentFileRepository: DocumentFileRepository,
    protected readonly appLogger: AppLoggerService,
  ) {}

  async getDocuments(workflowId: string, projectIds: TProjectId[]) {
    const allDocuments = await this.documentRepository.findMany(projectIds, {
      where: {
        workflowRuntimeDataId: workflowId,
      },
      include: {
        files: true,
      },
    });

    const latestDocuments = this.documentService.getLatestDocumentVersions(allDocuments);

    return latestDocuments;
  }

  async getDocumentById(documentId: string, projectIds: TProjectId[]) {
    const document = await this.documentRepository.findById(documentId, projectIds, {
      include: {
        files: true,
      },
    });

    return document;
  }

  async createDocument({
    data,
    file,
    workflowId,
    projectId,
  }: {
    data: CreateDocumentDto;
    workflowId: string;
    file: Express.Multer.File;
    projectId: TProjectId;
  }) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return beginTransactionIfNotExist(async transaction => {
      const isDocumentUnique = await this.documentService.checkDocumentUniqueness(
        {
          category: data.category,
          type: data.type,
          businessId: data.businessId,
          endUserId: data.endUserId,
          version: 1,
        },
        [projectId],
        transaction,
      );

      if (!isDocumentUnique) {
        this.appLogger.error(
          `Document with following data already exists: ${JSON.stringify({
            category: data.category,
            type: data.type,
            businessId: data.businessId,
            endUserId: data.endUserId,
            version: 1,
          })}`,
        );

        throw new ConflictException(
          `Document with provided data already exists. Please update the existing document instead.`,
        );
      }

      const document = await this.documentService.create(
        {
          type: data.type,
          category: data.category,
          issuingVersion: data.issuingVersion,
          issuingCountry: data.issuingCountry,
          workflowRuntimeDataId: workflowId,
          version: 1,
          status: DocumentStatus.provided,
          comment: undefined,
          properties: {},
          metadata: {
            type: data.documentType,
            variant: data.documentVariant,
            page: Number(data.page),
          },
          endUserId: data.endUserId,
          businessId: data.businessId,
          file,
          projectId,
        },
        {} as Prisma.DocumentCreateArgs,
        transaction,
      );

      if (!document) {
        this.appLogger.error(`Failed to create document`);
        throw new InternalServerErrorException('Failed to create document');
      }

      const serializedDocument = await this.serializeDocumentWithFiles(document);

      return serializedDocument;
    });
  }

  async reuploadDocument({
    documentId,
    file,
    workflowId,
    projectId,
  }: {
    documentId: string;
    file: Express.Multer.File;
    workflowId: string;
    projectId: TProjectId;
  }) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
    });

    return beginTransactionIfNotExist(async transaction => {
      const document = await this.documentService.getDocumentById(documentId, projectId);

      if (!document) {
        this.appLogger.error(`Document with id ${documentId} not found`);
        throw new NotFoundException(`Document with id ${documentId} not found`);
      }

      const latestDocument = await this.getLatestDocumentVersion(
        {
          type: document.type,
          category: document.category,
          endUserId: document.endUserId!,
          businessId: document.businessId!,
        },
        projectId,
        transaction,
      );

      if (document.version + 1 <= latestDocument?.version!) {
        this.appLogger.error(
          `Re-uploading document with id ${documentId} is not allowed. Expected new version ${
            document.version + 1
          } is not the latest version. Latest version is ${latestDocument?.version}.`,
        );
        throw new ConflictException(
          `Re-uploading document with id ${documentId} is not allowed. Expected new version ${
            document.version + 1
          } is not the latest version. Latest version is ${latestDocument?.version}.`,
        );
      }

      const documentFiles = await this.documentFileRepository.findByDocumentId(
        documentId,
        [projectId],
        {} as Prisma.DocumentFileFindManyArgs,
        transaction,
      );

      if (!documentFiles?.length) {
        this.appLogger.error(`Document with id ${documentId} has no files`);
        throw new InternalServerErrorException(`Document with id ${documentId} has no files`);
      }

      const latestDocumentFile = documentFiles.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )[0];

      const newDocument = await this.documentService.create(
        {
          type: document.type,
          category: document.category,
          issuingVersion: document.issuingVersion,
          issuingCountry: document.issuingCountry,
          version: document.version + 1,
          status: DocumentStatus.provided,
          properties: isObject(document.properties) ? document.properties : {},
          metadata: {
            type: latestDocumentFile!.type,
            variant: latestDocumentFile!.variant,
            page: latestDocumentFile!.page,
          },
          comment: undefined,
          file,
          projectId,
          workflowRuntimeDataId: workflowId,
          ...(document.businessId && { businessId: document.businessId }),
          ...(document.endUserId && { endUserId: document.endUserId }),
        },
        {} as Prisma.DocumentCreateArgs,
        transaction,
      );

      if (!newDocument) {
        this.appLogger.error(`Failed to create new document`);
        throw new InternalServerErrorException('Failed to create new document');
      }

      const serializedDocument = await this.serializeDocumentWithFiles(newDocument);

      return serializedDocument;
    });
  }

  private async getLatestDocumentVersion(
    {
      type,
      category,
      endUserId,
      businessId,
    }: {
      type: string;
      category: string;
      endUserId: string;
      businessId: string;
    },
    projectId: TProjectId,
    transaction: Prisma.TransactionClient,
  ) {
    const beginTransactionIfNotExist = beginTransactionIfNotExistCurry({
      prismaService: this.prismaService,
      options: defaultPrismaTransactionOptions,
      transaction,
    });

    return beginTransactionIfNotExist(async transaction => {
      const documents = await this.documentRepository.findMany(
        [projectId],
        {
          where: {
            type,
            category,
            businessId,
            endUserId,
          },
        },
        transaction,
      );

      const latestDocuments = this.documentService.getLatestDocumentVersions(documents);

      const lastDocument = latestDocuments[0];

      return lastDocument;
    });
  }

  private async serializeDocumentWithFiles(
    document: NonNullable<Awaited<ReturnType<typeof this.documentService.create>>>,
  ): Promise<CollectionFlowDocumentModel> {
    const serializedDocument = new CollectionFlowDocumentModel();
    serializedDocument.id = document.id;
    serializedDocument.businessId = document.businessId;
    serializedDocument.endUserId = document.endUserId;
    serializedDocument.category = document.category;
    serializedDocument.type = document.type;
    serializedDocument.version = document.version;
    serializedDocument.decision = document.decision;
    serializedDocument.decisionReason = document.decisionReason;
    serializedDocument.comment = document.comment;
    serializedDocument.files = document.files.map(file => {
      const fileModel = new CollectionFlowFileModel();
      fileModel.id = file.id;
      fileModel.fileId = file.fileId;
      fileModel.documentId = document.id;
      fileModel.name = file.file.fileName;
      fileModel.mimeType = file.file.mimeType;
      fileModel.uri = file.file.uri;
      fileModel.createdAt = file.file.createdAt;
      return fileModel;
    });

    const errors = await validate(serializedDocument);

    if (errors.length > 0) {
      this.appLogger.error(
        `Failed to serialize document with files. Errors: ${errors
          .map(error => error.toString())
          .join(', ')}`,
      );

      throw new InternalServerErrorException({
        message: 'Failed to serialize document with files.',
      });
    }

    return serializedDocument;
  }
}
