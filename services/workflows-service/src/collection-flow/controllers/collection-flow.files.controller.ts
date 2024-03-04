import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { Public } from '@/common/decorators/public.decorator';
import { type ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { FILE_MAX_SIZE_IN_BYTE, FILE_SIZE_EXCEEDED_MSG, fileFilter } from '@/storage/file-filter';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { StorageService } from '@/storage/storage.service';
import {
  Controller,
  Get,
  Logger,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as errors from '../../errors';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';

export const COLLECTION_FLOW_FILES_API_PATH = 'collection-flow/files';

@Public()
@UseTokenAuthGuard()
@Controller(COLLECTION_FLOW_FILES_API_PATH)
export class CollectionFlowFilesController {
  private readonly logger = new Logger(CollectionFlowFilesController.name);

  constructor(
    protected readonly storageService: StorageService,
    protected readonly collectionFlowService: CollectionFlowService,
  ) {}

  // curl -v -F "file=@/<path>/a.jpg" http://localhost:3000/api/v1/collection-flow/files
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
  @Post('')
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
