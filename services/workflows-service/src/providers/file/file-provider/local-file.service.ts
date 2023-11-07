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
    return new Promise((resolve, reject) => {
      const distFilePath = this.__removeFilePrefix(remoteFileConfig as TRemoteUri);

      const destDirectory = path.dirname(distFilePath);
      if (!fs.existsSync(destDirectory)) {
        fs.mkdirSync(destDirectory, { recursive: true });
      }

      // Create a readable stream from the source file
      const readStream = this.client.createReadStream(this.__removeFilePrefix(localFilePath));

      // Create a writable stream to the destination file
      const writeStream = this.client.createWriteStream(this.__removeFilePrefix(distFilePath));

      // Pipe the read stream to the write stream
      readStream.pipe(writeStream);

      // Log success or error
      writeStream.on('finish', () => {
        resolve(distFilePath);
      });

      writeStream.on('error', err => {
        reject(err);
      });
    });
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
    const desiredPath = [customerName, directory, this.__removeFilePrefix(fileName)]
      .filter(pathPart => !!pathPart)
      .join('/');
    return path.join(os.homedir(), '.ballerine', desiredPath);
  }

  private __removeFilePrefix(fileName: string): string {
    return fileName?.replace('file://', '');
  }
}
