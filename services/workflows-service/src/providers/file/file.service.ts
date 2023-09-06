import { TLocalFilePath, TRemoteFileConfig, TS3BucketConfig } from './types/files-types';
import * as tmp from 'tmp';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IStreamableFileProvider } from './types/interfaces';
import { TFileServiceProvider } from './types';
import { getDocumentId, isErrorWithMessage } from '@ballerine/common';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { TProjectId } from '@/types';
import crypto from 'crypto';
import { isType } from '@/common/is-type/is-type';
import { z } from 'zod';
import { StorageService } from '@/storage/storage.service';
import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
import { fromBuffer, fromFile } from 'file-type';
import { streamToBuffer } from '@/common/stream-to-buffer/stream-to-buffer';
import { Readable } from 'stream';
import { TDocumentWithoutPageType } from '@/common/types';

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async copyFromSourceToDestination(
    sourceServiceProvider: TFileServiceProvider,
    sourceRemoteFileConfig: TRemoteFileConfig,
    targetServiceProvider: TFileServiceProvider,
    targetFileConfig: TRemoteFileConfig,
  ) {
    try {
      const bothServicesSupportStream = this.isBothServicesSupportStream(
        sourceServiceProvider,
        targetServiceProvider,
      );

      if (bothServicesSupportStream) {
        const { remoteFileConfig, mimeType } = await this.copyThroughStream(
          sourceServiceProvider as IStreamableFileProvider,
          sourceRemoteFileConfig,
          targetServiceProvider as IStreamableFileProvider,
          targetFileConfig,
        );

        return {
          remoteFilePath: remoteFileConfig,
          fileNameInBucket:
            typeof remoteFileConfig !== 'string' ? remoteFileConfig?.fileNameInBucket : undefined,
          mimeType,
        };
      }

      const filePaths = await this.copyThroughFileSystem(
        sourceServiceProvider,
        sourceRemoteFileConfig,
        targetServiceProvider,
        targetFileConfig,
      );

      return filePaths;
    } catch (err) {
      const remoteFileName =
        typeof sourceRemoteFileConfig !== 'string'
          ? sourceRemoteFileConfig.fileNameInBucket
          : sourceRemoteFileConfig;

      console.warn(
        `Unable to download file - ${remoteFileName} - ` +
          (isErrorWithMessage(err) ? err.message : ''),
      );

      throw new BadRequestException(
        `Unable to download file -  ${remoteFileName}, Please check the validity of the file path and access`,
      );
    }
  }

  async copyThroughStream(
    sourceServiceProvider: IStreamableFileProvider,
    sourceRemoteFileConfig: TRemoteFileConfig,
    targetServiceProvider: IStreamableFileProvider,
    targetFileConfig: TRemoteFileConfig,
  ) {
    const streamableDownstream = await sourceServiceProvider.fetchRemoteDownStream(
      sourceRemoteFileConfig,
    );
    const buffer = await streamToBuffer(streamableDownstream);
    const stream = Readable.from(buffer);
    const remoteFileConfig = await targetServiceProvider.uploadStream(stream, targetFileConfig);
    const fileType = await fromBuffer(buffer);

    return {
      remoteFileConfig,
      mimeType: fileType?.mime,
    };
  }

  async copyThroughFileSystem(
    sourceServiceProvider: TFileServiceProvider,
    sourceRemoteFileConfig: TRemoteFileConfig,
    targetServiceProvider: TFileServiceProvider,
    targetFileConfig: TRemoteFileConfig,
  ) {
    const tmpFile = tmp.fileSync();
    const localFilePath = await sourceServiceProvider.download(
      sourceRemoteFileConfig,
      tmpFile.name,
    );
    const remoteFilePath = await targetServiceProvider.upload(localFilePath, targetFileConfig);
    const fileType = await fromFile(localFilePath);

    return {
      remoteFilePath,
      localFilePath,
      mimeType: fileType?.mime,
    };
  }

  async download(
    sourceServiceProvider: TFileServiceProvider,
    sourceRemoteFileConfig: TRemoteFileConfig,
    targetLocaleFilePath: TLocalFilePath,
  ) {
    return await sourceServiceProvider.download(sourceRemoteFileConfig, targetLocaleFilePath);
  }

  private isBothServicesSupportStream(
    sourceServiceProvider: TFileServiceProvider,
    targetServiceProvider: TFileServiceProvider,
  ) {
    return (
      'fetchRemoteFileDownStream' in sourceServiceProvider &&
      'uploadFileStream' in targetServiceProvider
    );
  }

  private __fetchAwsConfigForFileNameInBucket(fileNameInBucket: string): TS3BucketConfig {
    const bucketName = this.__fetchBucketName(process.env, true) as string;

    return {
      bucketName,
      fileNameInBucket,
      private: true,
    };
  }

  private __fetchBucketName(processEnv: NodeJS.ProcessEnv, isThrowOnMissing = true) {
    const bucketName = AwsS3FileConfig.getBucketName(processEnv);

    if (isThrowOnMissing && !bucketName) {
      throw new Error(`S3 Bucket name is not set`);
    }

    return bucketName;
  }

  /**
   * Returns an object with `sourceServiceProvider` and `fromRemoteFileConfig` based on the `documentPage.provider` and `documentPage.uri`
   * @param documentPage
   * @private
   */
  private __fetchSourceServiceProviders(documentPage: TDocumentWithoutPageType['pages'][number]): {
    sourceServiceProvider: TFileServiceProvider;
    sourceRemoteFileConfig: TRemoteFileConfig;
  } {
    if (documentPage.provider == 'http' && z.string().parse(documentPage.uri)) {
      return {
        sourceServiceProvider: new HttpFileService(),
        sourceRemoteFileConfig: documentPage.uri,
      };
    }

    if (documentPage.provider == 'aws_s3' && z.string().parse(documentPage.uri)) {
      const prefixConfigName = `REMOTE`;
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env, prefixConfigName);
      const s3BucketConfig = this.__fetchAwsConfigForFileNameInBucket(documentPage.uri);

      return {
        sourceServiceProvider: new AwsS3FileService(s3ClientConfig),
        sourceRemoteFileConfig: s3BucketConfig,
      };
    }

    return {
      sourceServiceProvider: new LocalFileService(),
      sourceRemoteFileConfig: documentPage.uri,
    };
  }

  /**
   * Returns an object with `targetServiceProvider` and `targetRemoteFileConfig` based on the `document.provider` and `document.uri`
   * @private
   * @param entityId
   * @param fileName
   */
  private __fetchTargetServiceProviders(
    entityId: string,
    customerName: string,
    fileName: string,
  ): {
    targetServiceProvider: TFileServiceProvider;
    targetRemoteFileConfig: TRemoteFileConfig;
    remoteFileNameInDirectory: string;
  } {
    if (this.__fetchBucketName(process.env, false)) {
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env);
      const awsFileService = new AwsS3FileService(s3ClientConfig);
      const remoteFileNameInDocument = awsFileService.generateRemotePath({
        customerName,
        fileName,
        directory: entityId,
      });
      const awsConfigForClient = this.__fetchAwsConfigForFileNameInBucket(remoteFileNameInDocument);

      return {
        targetServiceProvider: awsFileService,
        targetRemoteFileConfig: awsConfigForClient,
        remoteFileNameInDirectory: awsConfigForClient.fileNameInBucket,
      };
    }

    const localFileService = new LocalFileService();
    const toFileStoragePath = localFileService.generateRemotePath({ customerName, fileName });

    return {
      targetServiceProvider: localFileService,
      targetRemoteFileConfig: toFileStoragePath,
      remoteFileNameInDirectory: toFileStoragePath,
    };
  }

  async copyToDestinationAndCreate(
    document: TDocumentWithoutPageType,
    entityId: string,
    documentPage: TDocumentWithoutPageType['pages'][number],
    projectId: TProjectId,
    customerName: string,
  ) {
    const remoteFileName = `${
      document.id! || getDocumentId(document, false)
    }_${crypto.randomUUID()}`;
    const { sourceServiceProvider, sourceRemoteFileConfig } =
      this.__fetchSourceServiceProviders(documentPage);
    const { targetServiceProvider, targetRemoteFileConfig, remoteFileNameInDirectory } =
      this.__fetchTargetServiceProviders(entityId, customerName, remoteFileName);
    const fileInfo = await this.copyFromSourceToDestination(
      sourceServiceProvider,
      sourceRemoteFileConfig,
      targetServiceProvider,
      targetRemoteFileConfig,
    );
    const isFileInfoWithFileNameInBucket = isType(
      z.object({
        remoteFilePath: z.object({
          fileNameInBucket: z.string(),
        }),
      }),
    )(fileInfo);
    const { id: ballerineFileId, mimeType } = await this.storageService.createFileLink({
      uri: remoteFileNameInDirectory,
      fileNameOnDisk: remoteFileNameInDirectory,
      userId: entityId,
      fileNameInBucket: isFileInfoWithFileNameInBucket
        ? fileInfo?.remoteFilePath?.fileNameInBucket
        : undefined,
      projectId,
      mimeType: fileInfo?.mimeType,
    });

    return {
      ballerineFileId,
      mimeType,
    };
  }
}
