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

const fileParsePipe = new ParseFilePipeBuilder()
  .addMaxSizeValidator({ maxSize: FILE_MAX_SIZE_IN_BYTE })
  .build({
    fileIsRequired: true,
    exceptionFactory: (error: string) => {
      if (error.includes('expected size')) {
        throw new UnprocessableEntityException(FILE_SIZE_EXCEEDED_MSG);
      }
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

  @Get()
  async getDocuments() {
    return {
      documents: [],
    };
  }

  @Get(':documentId')
  async getDocumentById(@Param('documentId') documentId: string) {
    return {
      documentId,
    };
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: CreateDocumentSchema as any,
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

  @Put(':documentId')
  async updateDocument(@Param('documentId') documentId: string) {
    return {
      documentId,
    };
  }
}
