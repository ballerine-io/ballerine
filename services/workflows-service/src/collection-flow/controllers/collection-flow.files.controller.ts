import { CollectionFlowService } from '@/collection-flow/collection-flow.service';
import { Public } from '@/common/decorators/public.decorator';
import { ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { generateRandomId } from '@/common/utils/random';
import { CustomerService } from '@/customer/customer.service';
import { FileService } from '@/providers/file/file.service';
import { fileFilter } from '@/storage/file-filter';
import { getDiskStorage } from '@/storage/get-file-storage-manager';
import { StorageService } from '@/storage/storage.service';
import { WorkflowService } from '@/workflow/workflow.service';
import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseFilePipeBuilder,
  Post,
  Res,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as errors from '../../errors';
import { FILE_MAX_SIZE_IN_BYTE } from './../../storage/file-filter';
import { RemoveTempFileInterceptor } from '@/common/interceptors/remove-temp-file.interceptor';

@Public()
@UseTokenAuthGuard()
@Controller('collection-flow/files')
export class CollectionFlowFilesController {
  constructor(
    protected readonly storageService: StorageService,
    protected readonly collectionFlowService: CollectionFlowService,
  ) {}

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
      file,
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
