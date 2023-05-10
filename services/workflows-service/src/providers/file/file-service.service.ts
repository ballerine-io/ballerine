import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {TLocalFilePath, TRemoteFileConfig, TFileServiceProvider} from './types';
import * as tmp from 'tmp';

@Injectable()
export class FileServiceService {
  async copyFileFromSourceToSource(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toServiceProvider: TFileServiceProvider,
    toFileConfig: TRemoteFileConfig
  ){

    // await fromServiceProvider.isRemoteFileExists()
    const tmpFile = tmp.fileSync();

    const localeFilePath = await fromServiceProvider.downloadFile(fromRemoteFileConfig, tmpFile.name);
    const remoteFilePath = await toServiceProvider.uploadFile(localeFilePath, toFileConfig);

    return remoteFilePath;
  }

  async downloadFile(
    fromServiceProvider: TFileServiceProvider,
    fromRemoteFileConfig: TRemoteFileConfig,
    toLocaleFilePath: TLocalFilePath
  ) {
    return await fromServiceProvider.downloadFile(fromRemoteFileConfig, toLocaleFilePath)
  }
}
