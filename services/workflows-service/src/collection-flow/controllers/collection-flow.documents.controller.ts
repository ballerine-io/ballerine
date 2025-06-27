import { UseWorkflowAuthGuard } from '@/common/guards/workflow-guard/workflow-auth.decorator';
import {
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UnprocessableEntityException,
  ParseFilePipeBuilder,
  UseInterceptors,
  Body,
  BadRequestException,
  InternalServerErrorException,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TokenScope, type ITokenScope } from '@/common/decorators/token-scope.decorator';
import { CollectionFlowDocumentsService } from '../services/collection-flow-documents.service';
import { FILE_MAX_SIZE_IN_BYTE, FILE_SIZE_EXCEEDED_MSG, fileFilter } from '@/storage/file-filter';
import { FileInterceptor } from '@nestjs/platform-express';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { CreateDocumentDto, CreateDocumentSchema } from '../dto/create-document.dto';
import { FormDataValidationPipe } from '@/common/form-data-validation.pipe';
import { CollectionFlowDocumentModel } from '../models/collection-flow-document.model';
import { ReuploadDocumentDtoSchema } from '../dto/re-upload-document.dto';
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { ReuploadDocumentDto } from '../dto/reupload-document.dto';

const fileParsePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: FILE_MAX_SIZE_IN_BYTE })
  .build({
    fileIsRequired: true,
    exceptionFactory: (error: string) => {
      if (error.includes('expected size')) {
        throw new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG);
      }

      // Provide more detailed error message for file not found
      if (error.includes('File is required') || error.includes('no file uploaded')) {
        throw new BadRequestException(
          'No file provided. Please ensure you are sending a file with the field name "file" in your multipart/form-data request.',
        );
      }

      throw new InternalServerErrorException(`File validation error: ${error}`);
    },
  });

const fileUploadInterceptor = FileInterceptor('file', {
  storage: getDiskStorage(),
  limits: {
    files: 1,
  },
  fileFilter: fileFilter,
});

@UseWorkflowAuthGuard()
@ApiTags('Collection Flow Documents')
@Controller('collection-flow/documents')
export class CollectionFlowDocumentsController {
  constructor(protected readonly collectionFlowDocumentsService: CollectionFlowDocumentsService) {}

  @ApiResponse({
    status: 200,
    description: 'Documents retrieved successfully',
    type: CollectionFlowDocumentModel,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Get()
  async getDocuments(@TokenScope() tokenScope: ITokenScope) {
    return this.collectionFlowDocumentsService.getDocuments(tokenScope.workflowRuntimeDataId, [
      tokenScope.projectId,
    ]);
  }

  @ApiResponse({
    status: 200,
    description: 'Document retrieved successfully',
    type: CollectionFlowDocumentModel,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @Get(':documentId')
  async getDocumentById(
    @TokenScope() tokenScope: ITokenScope,
    @Param('documentId') documentId: string,
  ) {
    return this.collectionFlowDocumentsService.getDocumentById(documentId, [tokenScope.projectId]);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: CreateDocumentSchema as SchemaObject,
  })
  @ApiResponse({
    status: 201,
    description: 'Document created successfully',
    type: CollectionFlowDocumentModel,
  })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  @ApiResponse({
    status: 409,
    description: 'Attempted to create a document that already exists.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(fileUploadInterceptor, RemoveTempFileInterceptor)
  @Post()
  async createDocument(
    @TokenScope() tokenScope: ITokenScope,
    @Body(new FormDataValidationPipe()) data: CreateDocumentDto,
    @UploadedFile(fileParsePipe)
    file: Express.Multer.File,
  ): Promise<CollectionFlowDocumentModel> {
    const { endUserId, businessId } = data;

    if ([endUserId, businessId].every(id => id === undefined)) {
      throw new BadRequestException('Either end user or business ID must be provided.');
    }

    if (endUserId && businessId) {
      throw new BadRequestException(
        'End user and business ID cannot be provided at the same time.',
      );
    }

    return this.collectionFlowDocumentsService.createDocument({
      data: data,
      file,
      workflowId: tokenScope.workflowRuntimeDataId,
      projectId: tokenScope.projectId,
    });
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: ReuploadDocumentDtoSchema as SchemaObject,
  })
  @ApiResponse({
    status: 201,
    description: 'Document re-uploaded successfully',
    type: CollectionFlowDocumentModel,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({
    status: 409,
    description:
      'Re-uploading document with id is not allowed. Expected new version is not the latest version.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @UseInterceptors(fileUploadInterceptor, RemoveTempFileInterceptor)
  @Put(':documentId')
  async reuploadDocument(
    @TokenScope() tokenScope: ITokenScope,
    @Param('documentId') documentId: string,
    @Body(new FormDataValidationPipe()) data: ReuploadDocumentDto,
    @UploadedFile(fileParsePipe)
    file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException(
        'No file provided. Please ensure you are sending a file with the field name "file" in your multipart/form-data request.',
      );
    }

    return this.collectionFlowDocumentsService.reuploadDocument({
      documentId,
      file,
      metadata: {
        type: data.documentType,
        variant: data.documentVariant,
        page: data.page,
      },
      workflowId: tokenScope.workflowRuntimeDataId,
      projectId: tokenScope.projectId,
    });
  }

  @ApiResponse({
    status: 200,
    description: 'Document deleted successfully',
    type: CollectionFlowDocumentModel,
  })
  @ApiResponse({ status: 404, description: 'Document not found' })
  @ApiResponse({
    status: 409,
    description:
      'Deleting document with id is not allowed. Document version is not the latest version.',
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @Delete(':documentId')
  async deleteDocument(
    @TokenScope() tokenScope: ITokenScope,
    @Param('documentId') documentId: string,
  ) {
    return this.collectionFlowDocumentsService.deleteDocument(documentId, tokenScope.projectId);
  }

  @Delete(':documentId/files')
  async deleteDocumentFiles(
    @TokenScope() tokenScope: ITokenScope,
    @Param('documentId') documentId: string,
  ) {
    return this.collectionFlowDocumentsService.deleteDocumentFiles(
      documentId,
      tokenScope.projectId,
    );
  }
}
