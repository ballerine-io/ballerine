import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import fs from 'fs';
import { IFileProvider } from '../types/interfaces';
import * as os from 'os';
import * as path from 'path';

export class LocalFileService implements IFileProvider {
  protected client;
  constructor(...args: any) {
    this.client = fs;
  }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    return await this.copy(remoteFileConfig as TRemoteUri, this.__removeFilePrefix(localFilePath));
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async isRemoteExists(remoteFileConfig: TLocalFilePath): Promise<boolean> {
    const localFilePath = remoteFileConfig;

    return this.client.existsSync(this.__removeFilePrefix(localFilePath));
  }

  async copy(fromFilePath: TLocalFilePath, toFilePath: TLocalFilePath): Promise<TLocalFilePath> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this.client.copyFileSync(
      this.__removeFilePrefix(fromFilePath),
      this.__removeFilePrefix(toFilePath),
    );

    return toFilePath;
  }

  async upload(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig> {
    const toLocalFilePath = remoteFileConfig as TLocalFilePath;
    this.client
      .createReadStream(this.__removeFilePrefix(localFilePath))
      .pipe(this.client.createWriteStream(this.__removeFilePrefix(toLocalFilePath)));

    return Promise.resolve(toLocalFilePath);
  }

  generateRemotePath({ fileName }: { fileName: string }): string {
    return path.join(os.tmpdir(), this.__removeFilePrefix(fileName));
  }

  private __removeFilePrefix(fileName: string): string {
    return fileName?.replace('file://', '');
  }
}
