import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { DocumentFileJsonSchema } from '@/document-file/dtos/document-file.dto';
import { DocumentService } from '@/document/document.service';
import { DeleteDocumentsSchema } from '@/document/dtos/document.dto';
import { FILE_MAX_SIZE_IN_BYTE, FILE_SIZE_EXCEEDED_MSG, fileFilter } from '@/storage/file-filter';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { StorageService } from '@/storage/storage.service';
import { WorkflowService } from '@/workflow/workflow.service';
import { isObject } from '@ballerine/common';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseFilePipeBuilder,
  Post,
  Put,
  Query,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiExcludeController, ApiResponse } from '@nestjs/swagger';
import { Document, DocumentDecision, DocumentFile, DocumentStatus } from '@prisma/client';
import { Type, type Static } from '@sinclair/typebox';
import type { Response } from 'express';
import * as z from 'zod';
import * as errors from '../../errors';
import { CollectionFlowService } from '../collection-flow.service';
import { CollectionFlowDocumentSchema } from '../dto/create-collection-flow-document.schema';
import { GetDocumentsByIdsDto } from '../dto/get-documents-by-ids.dto';
import { UpdateCollectionFlowDocumentSchema } from '../dto/update-collection-flow-document.schema';
import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';

@UseWorkflowAuthGuard()
@ApiExcludeController()
@Controller('collection-flow/files')
export class CollectionFlowFilesController {
  constructor(
    protected readonly storageService: StorageService,
    protected readonly workflowService: WorkflowService,
    protected readonly documentService: DocumentService,
    protected readonly collectionFlowService: CollectionFlowService,
  ) {}

  @Get()
  async getDocuments(
    @TokenScope() tokenScope: ITokenScope,
    @Query() { ids }: GetDocumentsByIdsDto,
  ) {
    return this.documentService.getDocumentsByIds(ids, tokenScope.projectId);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: getDiskStorage(),
      limits: {
        files: 1,
      },
      fileFilter,
    }),
    RemoveTempFileInterceptor,
  )
  @Post()
  @ApiResponse({
    status: 200,
    description: 'Document created successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  async createDocument(
    @TokenScope() tokenScope: ITokenScope,
    @Body()
    data: Omit<Static<typeof CollectionFlowDocumentSchema>, 'properties'> & {
      metadata: string;
      properties: string;
    },
    @UploadedFile(
      new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: FILE_MAX_SIZE_IN_BYTE }).build({
        fileIsRequired: true,
        exceptionFactory: (error: string) => {
          if (error.includes('expected size')) {
            throw new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG);
          }

          throw new UnprocessableEntityException(error);
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    const metadata = DocumentFileJsonSchema.parse(data.metadata);
    const properties = z
      .preprocess(value => {
        if (typeof value !== 'string') {
          return value;
        }

        return JSON.parse(value);
      }, z.record(z.string(), z.unknown()))
      .parse(data.properties);

    // FormData returns version as a string
    // Manually converting to number to avoid validation errors
    data.version = Number(data.version);

    const createdDocument = await this.documentService.create({
      ...data,
      workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
      properties,
      metadata,
      file,
      projectId: tokenScope.projectId,
    });

    const documentWithDocumentFile: Document & { documentFile?: DocumentFile } = createdDocument;

    const documentFiles = await this.documentService.getDocumentFiles(createdDocument.id, [
      tokenScope.projectId,
    ]);

    documentWithDocumentFile.documentFile = documentFiles.at(-1);

    return createdDocument;
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: getDiskStorage(),
      limits: {
        files: 1,
      },
      fileFilter,
    }),
    RemoveTempFileInterceptor,
  )
  @Put()
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  async updateDocument(
    @TokenScope() tokenScope: ITokenScope,
    @Body()
    data: Omit<Static<typeof UpdateCollectionFlowDocumentSchema>, 'properties'> & {
      metadata: string;
      properties: string;
    },
    @UploadedFile(
      new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: FILE_MAX_SIZE_IN_BYTE }).build({
        fileIsRequired: true,
        exceptionFactory: (error: string) => {
          if (error.includes('expected size')) {
            throw new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG);
          }

          throw new UnprocessableEntityException(error);
        },
      }),
    )
    file: Express.Multer.File,
  ) {
    const metadata = DocumentFileJsonSchema.parse(data.metadata);
    const properties = z
      .preprocess(value => {
        if (typeof value !== 'string') {
          return value;
        }

        return JSON.parse(value);
      }, z.record(z.string(), z.unknown()))
      .parse(data.properties);

    const document = await this.documentService.getDocumentById(
      data.documentId,
      tokenScope.projectId,
    );

    if (document && document?.decision === DocumentDecision.revisions) {
      const createdDocument = await this.documentService.create({
        type: data.type,
        category: document.category,
        issuingVersion: document.issuingVersion,
        issuingCountry: document.issuingCountry,
        version: document.version + 1,
        status: DocumentStatus.provided,
        properties: isObject(document.properties) ? document.properties : {},
        metadata,
        comment: undefined,
        file,
        projectId: tokenScope.projectId,
        workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
        ...(document.businessId && { businessId: document.businessId }),
        ...(document.endUserId && { endUserId: document.endUserId }),
      });

      const documentWithDocumentFile: Document & { documentFile?: DocumentFile } = createdDocument;
      const documentFiles = await this.documentService.getDocumentFiles(createdDocument.id, [
        tokenScope.projectId,
      ]);

      documentWithDocumentFile.documentFile = documentFiles.at(-1);

      return documentWithDocumentFile;
    }

    const updatedDocuments = await this.documentService.updateByIdWithFile({
      ...data,
      // FormData returns version as a string
      // Manually converting to number to avoid validation errors
      version: Number(data.version),
      workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
      properties,
      metadata,
      file,
      projectId: tokenScope.projectId,
    });

    const updatedDocument = updatedDocuments.find(
      updatedDocument => updatedDocument.id === data.documentId,
    );

    if (!updatedDocument) {
      throw new BadRequestException(`Document with an id of "${data.documentId}" was not found`);
    }

    const documentFiles = await this.documentService.getDocumentFiles(updatedDocument.id, [
      tokenScope.projectId,
    ]);

    const updatedDocumentWithDocumentFile: Document & { documentFile?: DocumentFile } =
      updatedDocument;

    updatedDocumentWithDocumentFile.documentFile = documentFiles.at(-1);

    return updatedDocumentWithDocumentFile;
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Documents deleted successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  async deleteDocumentsByIds(
    @TokenScope() tokenScope: ITokenScope,
    @Body() { ids }: Static<typeof DeleteDocumentsSchema>,
  ) {
    return await this.documentService.deleteByIds(ids, [tokenScope.projectId]);
  }

  @Get('/:id')
  async getFileById(
    @TokenScope() tokenScope: ITokenScope,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.storageService.getFileById(
      {
        id,
      },
      [tokenScope.projectId],
    );

    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    return res.send(persistedFile);
  }

  @UseInterceptors(
    FileInterceptor('file', {
      storage: getDiskStorage(),
      limits: {
        files: 1,
      },
      fileFilter,
    }),
    RemoveTempFileInterceptor,
  )
  @Post('/old')
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder().addMaxSizeValidator({ maxSize: FILE_MAX_SIZE_IN_BYTE }).build({
        fileIsRequired: true,
        exceptionFactory: (error: string) => {
          if (error.includes('expected size')) {
            throw new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG);
          }

          throw new UnprocessableEntityException(error);
        },
      }),
    )
    file: Express.Multer.File,
    @TokenScope() tokenScope: ITokenScope,
  ) {
    return this.collectionFlowService.uploadNewFile(
      tokenScope.projectId,
      tokenScope.workflowRuntimeDataId,
      {
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
      },
    );
  }
}
