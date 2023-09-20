import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import { promises as fsPromises } from 'fs';
import axios, { AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { IStreamableFileProvider } from '../types/interfaces';

export class HttpFileService implements IStreamableFileProvider {
  protected client;
  constructor(..._args: any) {
    this.client = axios;
  }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    try {
      const response = await this.client.get(remoteFileConfig as TRemoteUri, {
        responseType: 'arraybuffer',
      });

      if (response.status < 200 || response.status >= 300) {
        throw new Error(`Error downloading file: ${response.statusText}`);
      }

      const fileBuffer = response.data;
      await fsPromises.writeFile(localFilePath, Buffer.from(fileBuffer));
      return localFilePath;
    } catch (error) {
      console.error('Error downloading the file:', error);
      throw error;
    }
  }

  async isRemoteExists(remoteFileConfig: TRemoteUri): Promise<boolean> {
    try {
      const response = await this.client.head(remoteFileConfig);
      return response.status >= 200 && response.status < 300;
    } catch (error) {
      console.error('Error checking if remote file exists: ', error);
      throw error;
    }
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async upload(...any: any): Promise<TRemoteFileConfig> {
    throw new Error('Unable to use upload to uri client');
  }

  async fetchRemoteDownStream(remoteFileConfig: TRemoteFileConfig): Promise<Readable> {
    const remoteUri = remoteFileConfig as TRemoteUri;

    const response: AxiosResponse<Readable> = await axios.get(remoteUri, {
      responseType: 'stream',
    });
    return response.data;
  }

  // eslint-disable-next-line @typescript-eslint/require-await
  async uploadStream(
    fileStream: Readable,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig> {
    throw new Error('Unable to use upload to uri client');
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
    throw new Error('Unable to use upload to uri client');
  }
}
