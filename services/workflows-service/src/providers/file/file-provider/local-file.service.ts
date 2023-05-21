import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import fs from 'fs';
import { IFileProvider } from '../types/interfaces';
import * as os from 'os';

export class LocalFileService implements IFileProvider {
  protected client;
  constructor(...args: any) {
    this.client = fs;
  }

  async downloadFile(
    remoteFileConfig: TRemoteFileConfig,
    localFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    return await this.copyFile(remoteFileConfig as TRemoteUri, localFilePath);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async isRemoteFileExists(remoteFileConfig: TLocalFilePath): Promise<boolean> {
    const localFilePath = remoteFileConfig;

    return this.client.existsSync(localFilePath);
  }

  async copyFile(
    fromFilePath: TLocalFilePath,
    toFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this.client.copyFileSync(fromFilePath, toFilePath);

    return toFilePath;
  }

  async uploadFile(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig> {
    const toLocalFilePAth = remoteFileConfig as TLocalFilePath;
    this.client
      .createReadStream(localFilePath)
      .pipe(this.client.createWriteStream(toLocalFilePAth));

    return Promise.resolve(toLocalFilePAth);
  }

  generateRemoteFilePath(fileName: string, directory?: string): string {
    return `${os.tmpdir()}/${fileName}`;
  }
}
