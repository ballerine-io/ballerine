import { TLocalFilePath, TRemoteFileConfig } from './types/files-types';
import * as tmp from 'tmp';
import { BadRequestException, Injectable } from '@nestjs/common';
import { IStreamableFileProvider } from './types/interfaces';
import { TFileServiceProvider } from './types';
import console from 'console';
import { isErrorWithMessage } from '@ballerine/common';

@Injectable()
export class FileService {
  async copyFileFromSourceToDestination(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: TFileServiceProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    try {
      const remoteFilePath = this.isBothServicesSupportStream(
        fromServiceProvider,
        toServiceProvider,
      )
        ? await this.copyThruStream(
            fromServiceProvider as IStreamableFileProvider,
            fromRemoteFileConfig,
            toServiceProvider as IStreamableFileProvider,
            toFileConfig,
          )
        : await this.copyThruLocalFile(
            fromServiceProvider,
            fromRemoteFileConfig,
            toServiceProvider,
            toFileConfig,
          );

      const fileNameInBucket =
        typeof remoteFilePath !== 'string' ? remoteFilePath.fileNameInBucket : undefined;
      return { remoteFilePath, fileNameInBucket };
    } catch (ex) {
      const remoteFileName =
        typeof fromRemoteFileConfig !== 'string'
          ? fromRemoteFileConfig.fileNameInBucket
          : fromRemoteFileConfig;
      console.warn(
        `Unable to download file - ${remoteFileName} - ` +
          (isErrorWithMessage(ex) ? ex.message : ''),
      );
      throw new BadRequestException(
        `Unable to download file -  ${remoteFileName}, Please check the validity of the file path and access`,
      );
    }
  }

  async copyThruStream(
    fromServiceProvider: IStreamableFileProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: IStreamableFileProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    const streamableDownstream = await fromServiceProvider.fetchRemoteFileDownStream(
      fromRemoteFileConfig,
    );

    return await toServiceProvider.uploadFileStream(streamableDownstream, toFileConfig);
  }

  async copyThruLocalFile(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: TFileServiceProvider,
    toFileConfig: TRemoteFileConfig,
  ) {
    const tmpFile = tmp.fileSync();

    const localeFilePath = await fromServiceProvider.downloadFile(
      fromRemoteFileConfig,
      tmpFile.name,
    );
    const remoteFilePath = await toServiceProvider.uploadFile(localeFilePath, toFileConfig);

    return remoteFilePath;
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
}
