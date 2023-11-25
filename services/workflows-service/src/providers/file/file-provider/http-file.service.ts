import { HttpService } from '@nestjs/axios';
import { TLocalFilePath, TRemoteFileConfig, TRemoteUri } from '@/providers/file/types/files-types';
import { promises as fsPromises } from 'fs';
import axios, { AxiosError, AxiosResponse, HttpStatusCode, isAxiosError } from 'axios';
import { Readable } from 'stream';
import { IStreamableFileProvider } from '../types/interfaces';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { HttpException } from '@nestjs/common';
import {
  RETRY_DELAY_IN_MS,
  getHttpStatusFromAxiosError,
} from '@/common/http-service/http-config.service';
import { removeSensitiveHeaders } from '@/common/utils/request-response/request';

export class HttpFileService implements IStreamableFileProvider {
  protected logger;
  protected client;
  constructor({ client, logger }: { client: HttpService; logger: AppLoggerService }) {
    this.logger = logger;
    this.client = client.axiosRef;

    this.client.interceptors.request.use(config => {
      this.logger.log('Axios outgoing request interceptor', {
        headers: removeSensitiveHeaders(config.headers),
        url: config.url,
        method: config.method?.toUpperCase(),
      });

      return config;
    });

    this.client.interceptors.response.use(
      response => {
        if (
          Buffer.isBuffer(response.data) ||
          response.headers['Content-Type'] === 'application/json'
        ) {
          return response;
        }

        this.logger.log('Axios outgoing response interceptor', {
          data: response.data,
          url: response.config.url,
          method: response.config.method?.toUpperCase(),
          // TODO: should we add also response's headers?
        });
        return response;
      },
      async (error: unknown) => {
        if (!isAxiosError(error)) {
          return Promise.reject(error);
        }

        const { config, response } = error;

        const lightweightError = {
          message: error.message,
          code: error.code,
          stack: error.stack,
          config: {
            method: config?.method,
            url: config?.url,
            timeout: config?.timeout,
          },
        };

        this.logger.error('Axios outgoing fault', {
          error: lightweightError,
        });

        // Check if the error is a 429 status code
        if (response && config && response.status === HttpStatusCode.TooManyRequests) {
          // You can implement your retry logic here
          // For example, you can wait for a specific amount of time and then retry the request

          this.logger.warn(`Retrying after ${RETRY_DELAY_IN_MS} milliseconds...`, {
            config,
          });

          return new Promise(resolve => {
            setTimeout(() => resolve(this.client(config)), RETRY_DELAY_IN_MS);
          });
        }

        return Promise.reject(
          new HttpException(
            lightweightError.message,
            getHttpStatusFromAxiosError(lightweightError.code),
          ),
        );
      },
    );
  }

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
