import { Readable } from 'stream';
import { TLocalFilePath, TRemoteFileConfig } from './files-types';

export interface IFileProvider {
  isRemoteExists(remoteFileConfig: TRemoteFileConfig): Promise<boolean>;
  download(
    remoteFileConfig: TRemoteFileConfig,
    localeFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath>;
  upload(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig | TLocalFilePath | void>;
  generateRemotePath({
    fileName,
    customerName,
    directory,
  }: {
    fileName: string;
    customerName: string;
    directory?: string;
  }): string;
}

export interface IStreamableFileProvider extends IFileProvider {
  fetchRemoteDownStream(remoteFileConfig: TRemoteFileConfig): Promise<Readable>;
  uploadStream(
    fileStream: Readable,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig>;
}
