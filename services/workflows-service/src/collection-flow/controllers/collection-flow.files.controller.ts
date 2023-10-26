import { Public } from '@/common/decorators/public.decorator';
import { ITokenScope, TokenScope } from '@/common/decorators/token-scope.decorator';
import { UseTokenAuthGuard } from '@/common/guards/token-guard/use-token-auth.decorator';
import { StorageService } from '@/storage/storage.service';
import { Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Response } from 'express';
import * as errors from '../../errors';
import { FileInterceptor } from '@nestjs/platform-express';
import { manageFileByProvider } from '@/storage/get-file-storage-manager';
import { fileFilter } from '@/storage/file-filter';

@Public()
@UseTokenAuthGuard()
@Controller('collection-flow/files')
export class CollectionFlowFilesController {
  constructor(protected readonly storageService: StorageService) {}

  @UseInterceptors(
    FileInterceptor('file', {
      storage: manageFileByProvider(process.env),
      fileFilter,
    }),
  )
  @Post('')
  async uploadFile(
    @UploadedFile() file: Partial<Express.MulterS3.File>,
    @TokenScope() tokenScope: ITokenScope,
  ) {
    const uploadedFile = await this.storageService.createFileLink({
      uri: file.location || String(file.path),
      fileNameOnDisk: String(file.path),
      fileNameInBucket: file.key,
      userId: tokenScope.endUserId,
      projectId: tokenScope.projectId,
      mimeType: file.mimetype,
    });

    return uploadedFile;
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
