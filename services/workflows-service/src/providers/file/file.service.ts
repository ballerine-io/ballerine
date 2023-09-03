import { TLocalFilePath, TRemoteFileConfig, TS3BucketConfig } from './types/files-types';
import * as tmp from 'tmp';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IStreamableFileProvider } from './types/interfaces';
import { TFileServiceProvider } from './types';
import { getDocumentId, isErrorWithMessage } from '@ballerine/common';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { TDocumentWithoutPageType, TProjectIds } from '@/types';
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

@Injectable()
export class FileService {
  constructor(private readonly storageService: StorageService) {}

  async copyFileFromSourceToDestination(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: TFileServiceProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    try {
      const bothServicesSupportStream = this.isBothServicesSupportStream(
        fromServiceProvider,
        toServiceProvider,
      );

      if (bothServicesSupportStream) {
        const { remoteFileConfig, mimeType } = await this.copyFileThroughStream(
          fromServiceProvider as IStreamableFileProvider,
          fromRemoteFileConfig,
          toServiceProvider as IStreamableFileProvider,
          toFileConfig,
        );

        return {
          remoteFilePath: remoteFileConfig,
          fileNameInBucket:
            typeof remoteFileConfig !== 'string' ? remoteFileConfig?.fileNameInBucket : undefined,
          mimeType,
        };
      }

      const filePaths = await this.copyFileThroughFileSystem(
        fromServiceProvider,
        fromRemoteFileConfig,
        toServiceProvider,
        toFileConfig,
      );

      return filePaths;
    } catch (err) {
      const remoteFileName =
        typeof fromRemoteFileConfig !== 'string'
          ? fromRemoteFileConfig.fileNameInBucket
          : fromRemoteFileConfig;

      console.warn(
        `Unable to download file - ${remoteFileName} - ` +
          (isErrorWithMessage(err) ? err.message : ''),
      );

      throw new BadRequestException(
        `Unable to download file -  ${remoteFileName}, Please check the validity of the file path and access`,
      );
    }
  }

  async copyFileThroughStream(
    fromServiceProvider: IStreamableFileProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: IStreamableFileProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    const streamableDownstream = await fromServiceProvider.fetchRemoteFileDownStream(
      fromRemoteFileConfig,
    );
    const buffer = await streamToBuffer(streamableDownstream);
    const stream = Readable.from(buffer);
    const remoteFileConfig = await toServiceProvider.uploadFileStream(stream, toFileConfig);
    const fileType = await fromBuffer(buffer);

    return {
      remoteFileConfig,
      mimeType: fileType?.mime,
    };
  }

  async copyFileThroughFileSystem(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: TFileServiceProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    const tmpFile = tmp.fileSync();
    const localFilePath = await fromServiceProvider.downloadFile(
      fromRemoteFileConfig,
      tmpFile.name,
    );
    const remoteFilePath = await toServiceProvider.uploadFile(localFilePath, toFileConfig);
    const fileType = await fromFile(localFilePath);

    return {
      remoteFilePath,
      localFilePath,
      mimeType: fileType?.mime,
    };
  }

  async downloadFile(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toLocaleFilePath: TLocalFilePath,
  ) {
    return await fromServiceProvider.downloadFile(fromRemoteFileConfig, toLocaleFilePath);
  }

  private isBothServicesSupportStream(
    fromServiceProvider: TFileServiceProvider,
    toServiceProvider: TFileServiceProvider,
  ) {
    return (
      'fetchRemoteFileDownStream' in fromServiceProvider && 'uploadFileStream' in toServiceProvider
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
   * Returns an object with `fromServiceProvider` and `fromRemoteFileConfig` based on the `documentPage.provider` and `documentPage.uri`
   * @param documentPage
   * @private
   */
  private __fetchFromServiceProviders(documentPage: TDocumentWithoutPageType['pages'][number]): {
    fromServiceProvider: TFileServiceProvider;
    fromRemoteFileConfig: TRemoteFileConfig;
  } {
    if (documentPage.provider == 'http' && z.string().parse(documentPage.uri)) {
      return { fromServiceProvider: new HttpFileService(), fromRemoteFileConfig: documentPage.uri };
    }

    if (documentPage.provider == 'aws_s3' && z.string().parse(documentPage.uri)) {
      const prefixConfigName = `REMOTE`;
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env, prefixConfigName);
      const s3BucketConfig = this.__fetchAwsConfigForFileNameInBucket(documentPage.uri);

      return {
        fromServiceProvider: new AwsS3FileService(s3ClientConfig),
        fromRemoteFileConfig: s3BucketConfig,
      };
    }

    return { fromServiceProvider: new LocalFileService(), fromRemoteFileConfig: documentPage.uri };
  }

  /**
   * Returns an object with `toServiceProvider` and `toRemoteFileConfig` based on the `document.provider` and `document.uri`
   * @private
   * @param entityId
   * @param fileName
   */
  private __fetchToServiceProviders(
    entityId: string,
    fileName: string,
  ): {
    toServiceProvider: TFileServiceProvider;
    toRemoteFileConfig: TRemoteFileConfig;
    remoteFileNameInDirectory: string;
  } {
    if (this.__fetchBucketName(process.env, false)) {
      const s3ClientConfig = AwsS3FileConfig.fetchClientConfig(process.env);
      const awsFileService = new AwsS3FileService(s3ClientConfig);
      const remoteFileNameInDocument = awsFileService.generateRemoteFilePath(fileName, entityId);
      const awsConfigForClient = this.__fetchAwsConfigForFileNameInBucket(remoteFileNameInDocument);

      return {
        toServiceProvider: awsFileService,
        toRemoteFileConfig: awsConfigForClient,
        remoteFileNameInDirectory: awsConfigForClient.fileNameInBucket,
      };
    }

    const localFileService = new LocalFileService();
    const toFileStoragePath = localFileService.generateRemoteFilePath(fileName);

    return {
      toServiceProvider: localFileService,
      toRemoteFileConfig: toFileStoragePath,
      remoteFileNameInDirectory: toFileStoragePath,
    };
  }

  async copyFileToDestinationAndCreateFile(
    document: TDocumentWithoutPageType,
    entityId: string,
    documentPage: TDocumentWithoutPageType['pages'][number],
    projectIds: TProjectIds,
  ) {
    const remoteFileName = `${
      document.id! || getDocumentId(document, false)
    }_${crypto.randomUUID()}`;
    const { fromServiceProvider, fromRemoteFileConfig } =
      this.__fetchFromServiceProviders(documentPage);
    const { toServiceProvider, toRemoteFileConfig, remoteFileNameInDirectory } =
      this.__fetchToServiceProviders(entityId, remoteFileName);
    const fileInfo = await this.copyFileFromSourceToDestination(
      fromServiceProvider,
      fromRemoteFileConfig,
      toServiceProvider,
      toRemoteFileConfig,
    );
    const isFileInfoWithFileNameInBucket = isType(
      z.object({
        fileNameInBucket: z.string(),
      }),
    )(fileInfo);
    const { id: ballerineFileId, mimeType } = await this.storageService.createFileLink({
      uri: remoteFileNameInDirectory,
      fileNameOnDisk: remoteFileNameInDirectory,
      userId: entityId,
      fileNameInBucket: isFileInfoWithFileNameInBucket ? fileInfo?.fileNameInBucket : undefined,
      projectIds,
      mimeType: fileInfo?.mimeType,
    });

    return {
      ballerineFileId,
      mimeType,
    };
  }
}
