import * as common from '@nestjs/common';
import { Param, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import * as swagger from '@nestjs/swagger';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { Response } from 'express';
// import * as nestAccessControl from 'nest-access-control';
import { StorageService } from './storage.service';
import * as errors from '../errors';
import { fileFilter } from './file-filter';
import {
  createPresignedUrlWithClient,
  downloadFileFromS3,
  manageFileByProvider,
} from '@/storage/get-file-storage-manager';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import path from 'path';
import os from 'os';
import { File } from '@prisma/client';
import { z } from 'zod';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { ProjectIds } from '@/common/decorators/project-ids.decorator';
import type { TProjectId, TProjectIds } from '@/types';
import { CurrentProject } from '@/common/decorators/current-project.decorator';
import { isBase64 } from '@/common/utils/is-base64/is-base64';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { HttpService } from '@nestjs/axios';
import mime from 'mime';
import { getFileMetadata } from '@/common/get-file-metadata/get-file-metadata';

// Temporarily identical to StorageControllerExternal
@swagger.ApiTags('Storage')
@common.Controller('internal/storage')
export class StorageControllerInternal {
  constructor(
    protected readonly service: StorageService,
    // @nestAccessControl.InjectRolesBuilder()
    // protected readonly rolesBuilder: nestAccessControl.RolesBuilder,
    protected readonly logger: AppLoggerService,
    protected readonly httpService: HttpService,
  ) {}

  // curl -v -F "file=@a.jpg" http://localhost:3000/api/v1/internal/storage
  // TODO: - update file to be multi-tenant to the specific s3 bucket
  /**
   * @deprecated
   */
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: manageFileByProvider(process.env),
      fileFilter,
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile() file: Partial<Express.MulterS3.File>,
    @CurrentProject() currentProjectId: TProjectId,
  ) {
    return await this.service.createFileLink({
      uri: file.location || String(file.path),
      fileNameOnDisk: String(file.path),
      fileNameInBucket: file.key,
      fileName: file.originalname,
      // Probably wrong. Would require adding a relationship (Prisma) and using connect.
      userId: '',
      projectId: currentProjectId,
      mimeType:
        file.mimetype ||
        (
          await getFileMetadata({
            file: file.originalname || '',
            fileName: file.originalname || '',
          })
        )?.mimeType,
    });
  }

  // curl -v http://localhost:3000/api/v1/internal/storage/1679322938093
  @common.Get('/:id')
  async getFileById(@ProjectIds() projectIds: TProjectIds, @Param('id') id: string) {
    try {
      // currently ignoring user id due to no user info
      const persistedFile = await this.service.getFileById({ id }, projectIds, {});

      if (!persistedFile) {
        throw new errors.NotFoundException('file not found');
      }

      return persistedFile;
    } catch (error) {
      this.logger.error('Coudlnt get file from remote', { error });
      throw new errors.NotFoundException('file not found');
    }
  }

  // curl -v http://localhost:3000/api/v1/storage/content/1679322938093
  @common.Get('/content/:id')
  async fetchFileContent(
    @ProjectIds() projectIds: TProjectIds,
    @Param('id') id: string,
    @Res() res: Response,
    @Query('format') format: string,
  ) {
    // currently ignoring user id due to no user info
    const persistedFile = await this.service.getFileById({ id }, projectIds, {});

    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    const mimeType =
      persistedFile.mimeType ||
      mime.getType(persistedFile.fileName || persistedFile.uri || '') ||
      undefined;

    if (persistedFile.fileNameInBucket && format === 'signed-url') {
      const signedUrl = await createPresignedUrlWithClient({
        bucketName: AwsS3FileConfig.getBucketName(process.env) as string,
        fileNameInBucket: persistedFile.fileNameInBucket,
        mimeType,
      });

      return res.json({ signedUrl, mimeType });
    }

    res.set('Content-Type', mimeType || 'application/octet-stream');

    if (persistedFile.fileNameInBucket) {
      const localFilePath = await downloadFileFromS3(
        AwsS3FileConfig.getBucketName(process.env) as string,
        persistedFile.fileNameInBucket,
      );

      return res.sendFile(localFilePath, { root: '/' });
    }

    if (!isBase64(persistedFile.uri) && this._isUri(persistedFile)) {
      const downloadFilePath = await this.__downloadFileFromRemote(persistedFile);

      return res.sendFile(this.__getAbsoluteFilePAth(downloadFilePath));
    }

    return res.sendFile(this.__getAbsoluteFilePAth(persistedFile.fileNameOnDisk));
  }

  private __getAbsoluteFilePAth(filePath: string) {
    if (!path.isAbsolute(filePath)) return filePath;

    const rootDir = path.parse(os.homedir()).root;

    return path.join(rootDir, filePath);
  }

  private async __downloadFileFromRemote(persistedFile: File) {
    const localeFilePath = `${os.tmpdir()}/${persistedFile.id}`;
    const downloadedFilePath = await new HttpFileService({
      client: this.httpService,
      logger: this.logger,
    }).download(persistedFile.uri, localeFilePath);

    return downloadedFilePath;
  }

  _isUri(persistedFile: File) {
    return z.string().url().safeParse(persistedFile.uri).success;
  }
}
