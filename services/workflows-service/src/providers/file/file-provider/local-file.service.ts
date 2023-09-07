import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import fs from 'fs';
import { IFileProvider } from '../types/interfaces';
import * as os from 'os';

export class LocalFileService implements IFileProvider {
  protected client;
  constructor(...args: any) {
    this.client = fs;
  }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    return await this.copy(remoteFileConfig as TRemoteUri, localFilePath);
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async isRemoteExists(remoteFileConfig: TLocalFilePath): Promise<boolean> {
    const localFilePath = remoteFileConfig;

    return this.client.existsSync(localFilePath);
  }

  async copy(fromFilePath: TLocalFilePath, toFilePath: TLocalFilePath): Promise<TLocalFilePath> {
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await this.client.copyFileSync(fromFilePath, toFilePath);

    return toFilePath;
  }

  async upload(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig> {
    const toLocalFilePath = remoteFileConfig as TLocalFilePath;
    this.client
      .createReadStream(localFilePath)
      .pipe(this.client.createWriteStream(toLocalFilePath));

    return Promise.resolve(toLocalFilePath);
  }

  generateRemotePath({
    fileName,
    customerName,
    directory,
  }: {
    fileName: string;
    customerName: string;
    directory?: string;
  }): string {
    return `${os.tmpdir()}/${fileName}`;
  }
}
