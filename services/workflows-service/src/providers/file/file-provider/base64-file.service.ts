import { TLocalFilePath, TRemoteFileConfig } from '@/providers/file/types/files-types';
import { IFileProvider } from '@/providers/file/types/interfaces';
import { streamToBase64 } from '@/providers/file/utils/stream-to-base64';
import { createReadStream, writeFileSync } from 'fs';
import tmp from 'tmp';

export class Base64FileService implements IFileProvider {
  generateRemotePath({
    fileName,
    customerName,
    directory,
  }: {
    fileName: string;
    customerName: string;
    directory?: string | undefined;
  }): string {
    throw new Error('Method not implemented.');
  }
  async download(remoteFileConfig: TRemoteFileConfig): Promise<TLocalFilePath> {
    const tmpFile = tmp.fileSync();

    writeFileSync(tmpFile.name, remoteFileConfig as string, { encoding: 'base64' });

    return tmpFile.name;
  }

  async isRemoteExists(): Promise<boolean> {
    return false;
  }

  async upload(localFilePath: TLocalFilePath): Promise<TRemoteFileConfig> {
    const stream = createReadStream(localFilePath);

    return streamToBase64(stream);
  }

  async copy() {
    throw new Error('Method not implemented');
  }
}
