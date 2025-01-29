import { Injectable } from '@nestjs/common';
import { FileRepository } from './storage.repository';
import { IFileIds } from './types';
import { File, Prisma } from '@prisma/client';
import type { TProjectId, TProjectIds } from '@/types';
import * as errors from '@/errors';
import mime from 'mime';
import {
  createPresignedUrlWithClient,
  downloadFileFromS3,
} from '@/storage/get-file-storage-manager';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { isBase64 } from '@/common/utils/is-base64/is-base64';
import path from 'path';
import os from 'os';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { z } from 'zod';
import { HttpService } from '@nestjs/axios';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { readFileSync } from 'fs';

@Injectable()
export class StorageService {
  constructor(
    protected readonly fileRepository: FileRepository,
    protected readonly httpService: HttpService,
    protected readonly logger: AppLoggerService,
  ) {}

  async createFileLink({
    uri,
    fileNameOnDisk,
    fileName,
    userId,
    fileNameInBucket,
    projectId,
    mimeType,
  }: Pick<
    Prisma.FileCreateInput,
    'uri' | 'fileNameOnDisk' | 'userId' | 'fileNameInBucket' | 'mimeType' | 'fileName'
  > & {
    projectId: TProjectId;
  }) {
    const file = await this.fileRepository.create({
      data: {
        uri,
        fileNameOnDisk,
        fileName,
        userId,
        fileNameInBucket,
        mimeType,
        projectId,
      },
      select: {
        id: true,
        mimeType: true,
      },
    });

    return file;
  }

  async getFileById({ id }: IFileIds, projectIds: TProjectIds, args?: Prisma.FileFindFirstArgs) {
    return await this.fileRepository.findById({ id }, args || {}, projectIds);
  }

  async fetchFileContent({
    id,
    projectIds,
    format,
  }: {
    id: string;
    projectIds: TProjectIds;
    format?: string;
  }) {
    const persistedFile = await this.getFileById({ id }, projectIds, {});

    if (!persistedFile) {
      throw new errors.NotFoundException('file not found');
    }

    let mimeType =
      persistedFile.mimeType ||
      mime.getType(persistedFile.fileName || persistedFile.uri || '') ||
      'image/jpeg';

    if (persistedFile.fileNameInBucket && format === 'signed-url') {
      const signedUrl = await createPresignedUrlWithClient({
        bucketName: AwsS3FileConfig.getBucketName(process.env) as string,
        fileNameInBucket: persistedFile.fileNameInBucket,
        mimeType,
      });

      return { signedUrl, mimeType };
    }

    mimeType ||= 'application/octet-stream';

    if (persistedFile.fileNameInBucket) {
      const localFilePath = await downloadFileFromS3(
        AwsS3FileConfig.getBucketName(process.env) as string,
        persistedFile.fileNameInBucket,
      );

      return { filePath: path.resolve('/', localFilePath), mimeType };
    }

    if (!isBase64(persistedFile.uri) && this._isUri(persistedFile)) {
      const downloadFilePath = await this.__downloadFileFromRemote(persistedFile);

      const filePath = this.__getAbsoluteFilePAth(downloadFilePath);

      return { filePath: filePath, mimeType };
    }

    const filePath = this.__getAbsoluteFilePAth(persistedFile.fileNameOnDisk);

    return { filePath: filePath, mimeType };
  }

  private __getAbsoluteFilePAth(filePath: string) {
    if (!path.isAbsolute(filePath)) {
      return filePath;
    }

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

  fileToBase64(filepath: string): string {
    const fileBuffer = readFileSync(filepath);

    const base64String = fileBuffer.toString('base64');

    return base64String;
  }
}
