import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { DocumentService } from './document.service';
import {
  CreateDocumentSchema,
  DeleteDocumentsSchema,
  UpdateDocumentSchema,
} from './dtos/document.dto';
import { Validate } from 'ballerine-nestjs-typebox';
import { type Static, Type } from '@sinclair/typebox';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { FILE_MAX_SIZE_IN_BYTE, FILE_SIZE_EXCEEDED_MSG, fileFilter } from '@/storage/file-filter';
import { DocumentFileJsonSchema } from '@/document-file/dtos/document-file.dto';
import z from 'zod';
import type { TProjectId } from '@/types';

@ApiBearerAuth()
@ApiTags('Documents')
@Controller('external/documents')
export class DocumentControllerExternal {
  constructor(protected readonly documentService: DocumentService) {}

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
  @Validate({
    request: [
      {
        type: 'body',
        schema: Type.Composite([
          Type.Omit(CreateDocumentSchema, ['properties']),
          Type.Object({
            metadata: Type.String(),
            properties: Type.String(),
          }),
        ]),
      },
    ],
    response: Type.Any(),
  })
  async createDocument(
    @Body()
    data: Omit<Static<typeof CreateDocumentSchema>, 'properties'> & {
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
    @CurrentProject() projectId: string,
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

    return await this.documentService.create({
      ...data,
      properties,
      metadata,
      file,
      projectId,
    });
  }

  @Get('tracker/:workflowId')
  @ApiForbiddenResponse()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    schema: Type.Object({
      business: Type.Array(Type.Record(Type.String(), Type.Any())),
      individuals: Type.Object({
        ubos: Type.Array(Type.Record(Type.String(), Type.Any())),
        directors: Type.Array(Type.Record(Type.String(), Type.Any())),
      }),
    }),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'workflowId',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async getDocumentsByWorkflowId(
    @Param('workflowId') workflowId: string,
    @CurrentProject() projectId: TProjectId,
  ) {
    return await this.documentService.getDocumentTrackerByWorkflowId(projectId, workflowId);
  }

  @Post('request')
  @ApiForbiddenResponse()
  @HttpCode(200)
  @ApiResponse({
    status: 200,
    description: 'Documents requested successfully',
  })
  @Validate({
    request: [
      {
        type: 'body',
        schema: Type.Object({ documentIds: Type.Array(Type.String()) }),
      },
    ],
    response: Type.Any(),
  })
  async requestDocuments(
    @Body() { documentIds }: { documentIds: string[] },
    @CurrentProject() projectId: TProjectId,
  ) {
    return await this.documentService.requestDocumentsByIds(projectId, documentIds);
  }

  @Get('/:entityId/:workflowRuntimeDataId')
  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'entityId',
        schema: Type.String(),
      },
      {
        type: 'param',
        name: 'workflowRuntimeDataId',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async getDocumentsByEntityIdAndWorkflowId(
    @Param('entityId') entityId: string,
    @Param('workflowRuntimeDataId') workflowRuntimeDataId: string,
    @CurrentProject() projectId: string,
  ) {
    return await this.documentService.getByEntityIdAndWorkflowId(entityId, workflowRuntimeDataId, [
      projectId,
    ]);
  }

  @Patch('/:documentId')
  @ApiResponse({
    status: 200,
    description: 'Document updated successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'documentId',
        schema: Type.String(),
      },
      {
        type: 'body',
        schema: UpdateDocumentSchema,
      },
    ],
    response: Type.Any(),
  })
  async updateDocumentById(
    @Param('documentId') documentId: string,
    @Body() data: Static<typeof UpdateDocumentSchema>,
    @CurrentProject() projectId: string,
  ) {
    return await this.documentService.updateById(documentId, [projectId], data);
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
  @Post('/:workflowRuntimeDataId/:fileId')
  @ApiResponse({
    status: 200,
    description: 'Document reuploaded successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  @Validate({
    request: [
      {
        type: 'param',
        name: 'workflowRuntimeDataId',
        schema: Type.String(),
      },
      {
        type: 'param',
        name: 'fileId',
        schema: Type.String(),
      },
    ],
    response: Type.Any(),
  })
  async reuploadDocumentFileById(
    @Param('workflowRuntimeDataId') workflowRuntimeDataId: string,
    @Param('fileId') fileId: string,
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
    @CurrentProject() projectId: string,
  ) {
    return await this.documentService.reuploadDocumentFileById(
      fileId,
      workflowRuntimeDataId,
      [projectId],
      file,
    );
  }

  @Delete()
  @ApiResponse({
    status: 200,
    description: 'Documents deleted successfully',
    schema: Type.Array(Type.Record(Type.String(), Type.Any())),
  })
  @Validate({
    request: [
      {
        type: 'body',
        schema: DeleteDocumentsSchema,
      },
    ],
    response: Type.Any(),
  })
  async deleteDocumentsByIds(
    @Body() { ids }: Static<typeof DeleteDocumentsSchema>,
    @CurrentProject() projectId: string,
  ) {
    return await this.documentService.deleteByIds(ids, [projectId]);
  }
}
