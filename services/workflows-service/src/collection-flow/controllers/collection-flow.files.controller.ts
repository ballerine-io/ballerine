import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { DocumentFileJsonSchema } from '@/document-file/dtos/document-file.dto';
import { DocumentService } from '@/document/document.service';
import { DeleteDocumentsSchema } from '@/document/dtos/document.dto';
import { FileService } from '@/providers/file/file.service';
import { FILE_MAX_SIZE_IN_BYTE, FILE_SIZE_EXCEEDED_MSG, fileFilter } from '@/storage/file-filter';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { StorageService } from '@/storage/storage.service';
import { WorkflowService } from '@/workflow/workflow.service';
import {
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
import { Type, type Static } from '@sinclair/typebox';
import type { Response } from 'express';
import * as z from 'zod';
import * as errors from '../../errors';
import { CollectionFlowDocumentSchema } from '../dto/create-collection-flow-document.schema';
import { GetDocumentsByIdsDto } from '../dto/get-documents-by-ids.dto';
import { UpdateCollectionFlowDocumentSchema } from '../dto/update-collection-flow-document.schema';
import { DocumentDecision, DocumentStatus } from '@prisma/client';
import { isObject } from '@ballerine/common';

@UseTokenAuthGuard()
@ApiExcludeController()
@Controller('collection-flow/files')
export class CollectionFlowFilesController {
  constructor(
    protected readonly storageService: StorageService,
    protected readonly fileService: FileService,
    protected readonly workflowService: WorkflowService,
    protected readonly documentService: DocumentService,
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

    const documentsCreationResults = await this.documentService.create({
      ...data,
      workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
      properties,
      metadata,
      file,
      projectId: tokenScope.projectId,
    });

    return documentsCreationResults.at(-1);
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

    const document = await this.documentService.getDocumentById(data.id, tokenScope.projectId);

    if (document?.decision === DocumentDecision.revisions) {
      const newDocument = await this.documentService.create({
        type: document.type,
        category: document.category,
        issuingVersion: document.issuingVersion,
        issuingCountry: document.issuingCountry,
        version: document.version + 1,
        status: DocumentStatus.provided,
        properties: isObject(document.properties) ? document.properties : {},
        metadata,
        comment: document.comment ?? undefined,
        file,
        projectId: tokenScope.projectId,
        workflowRuntimeDataId: tokenScope.workflowRuntimeDataId,
        ...(document.businessId && { businessId: document.businessId }),
        ...(document.endUserId && { endUserId: document.endUserId }),
      });

      return newDocument;
    }

    const documentsUpdateResults = await this.documentService.updateByIdWithFile({
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

    return documentsUpdateResults.at(-1);
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
}
