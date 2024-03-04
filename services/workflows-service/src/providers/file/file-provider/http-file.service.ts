import { HttpService } from '@nestjs/axios';
import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import { promises as fsPromises } from 'fs';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { IStreamableFileProvider } from '../types/interfaces';
import { removeSensitiveHeaders } from '@/common/utils/request-response/request';
import { LoggerService } from '@nestjs/common';

export class HttpFileService implements IStreamableFileProvider {
  protected logger: LoggerService;
  protected client: AxiosInstance;
  constructor({ client, logger }: { client: HttpService; logger: LoggerService }) {
    this.logger = logger;
    this.client = client.axiosRef;

    this.client.interceptors.request.use(config => {
      this.logger.debug?.('Axios outgoing request interceptor', {
        headers: removeSensitiveHeaders(config.headers),
        url: config.url,
        method: config.method?.toUpperCase(),
      });

      return config;
    });

    this.client.interceptors.response.use(response => {
      if (
        Buffer.isBuffer(response.data) ||
        response.headers['Content-Type'] !== 'application/json'
      ) {
        return response;
      }

      this.logger.debug?.('Axios outgoing response interceptor', {
        data: response.data,
        url: response.config.url,
        method: response.config.method?.toUpperCase(),
        // TODO: should we add also response's headers?
      });

      return response;
    });
  }

  // private _shouldRetry(error: AxiosError) {
  //   const { response } = error;
  //   const isTooManyRequests =
  //     response?.status === HttpStatusCode.TooManyRequests;
  //   const isNetworkIssue = error.code === 'ENETUNREACH';

  //   return isTooManyRequests || isNetworkIssue;
  // }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    const response = await this.client.get(remoteFileConfig as TRemoteUri, {
      responseType: 'arraybuffer',
    });

    if (response.status < 200 || response.status >= 300) {
      throw new Error(`Error downloading file: ${response.statusText}`);
    }

    const fileBuffer = response.data;
    await fsPromises.writeFile(localFilePath, Buffer.from(fileBuffer));

    return localFilePath;
  }

  async isRemoteExists(remoteFileConfig: TRemoteUri): Promise<boolean> {
    const response = await this.client.head(remoteFileConfig);

    return response.status >= 200 && response.status < 300;
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
