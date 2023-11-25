import {
  TLocalFilePath,
  TRemoteFileConfig,
  TS3BucketConfig,
} from '@/providers/file/types/files-types';
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
  S3ClientConfig,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import fs, { createReadStream } from 'fs';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { isErrorWithName } from '@ballerine/common';
import { Upload } from '@aws-sdk/lib-storage';
import { IStreamableFileProvider } from '../types/interfaces';
import { MimeType } from 'file-type';

export class AwsS3FileService implements IStreamableFileProvider {
  protected client;
  protected logger;

  constructor(s3ClientConfig: S3ClientConfig, logger: AppLoggerService) {
    this.logger = logger;
    this.client = new S3Client(s3ClientConfig);
  }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localeFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    const getObjectParams = this.__fetchBucketPath(remoteFileConfig as TS3BucketConfig);

    try {
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const response = await this.client.send(getObjectCommand);
      // @daniel fix please
      // eslint-disable-next-line @typescript-eslint/await-thenable
      const readableStream = (await response.Body) as Readable;
      const writableStream = fs.createWriteStream(localeFilePath);

      return new Promise((resolve, reject) => {
        readableStream
          .pipe(writableStream)
          .on('finish', () => {
            resolve(localeFilePath);
          })
          .on('error', error => {
            reject(error);
          });
      });
    } catch (error) {
      this.logger.error('Error downloading file from S3:', { error, localeFilePath });
      throw error;
    }
  }

  async isRemoteExists(remoteFileConfig: TS3BucketConfig): Promise<boolean> {
    const getObjectParams = this.__fetchBucketPath(remoteFileConfig);

    try {
      const headObjectCommand = new HeadObjectCommand(getObjectParams);
      await this.client.send(headObjectCommand);
      return Promise.resolve(true);
    } catch (error) {
      if (
        isErrorWithName(error) &&
        (error.name.toLowerCase() === 'notfound' || error.name.toLowerCase() === 'not found')
      ) {
        return Promise.resolve(false);
      }
      console.error('Error checking remote file existence:', error);
      throw error;
    }
  }

  async upload(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
    mimeType: MimeType | undefined,
  ): Promise<TS3BucketConfig> {
    const ts3BucketConfig = remoteFileConfig as TS3BucketConfig;
    const { remoteFileName, isPrivate, putObjectCommand } = this._initiatePutObject(
      ts3BucketConfig,
      ts3BucketConfig.fileNameInBucket,
      createReadStream(localFilePath),
      mimeType,
    );

    return await this._uploadFileViaClient(putObjectCommand, isPrivate, remoteFileName);
  }

  async fetchRemoteDownStream(remoteFileConfig: TRemoteFileConfig): Promise<Readable> {
    const fetchBucketConfig = this.__fetchBucketPath(remoteFileConfig as TS3BucketConfig);
    const getObjectCommand = new GetObjectCommand(fetchBucketConfig);
    const response = await this.client.send(getObjectCommand);

    // eslint-disable-next-line @typescript-eslint/await-thenable
    return (await response.Body) as Readable;
  }

  async uploadStream(
    fileStream: Readable,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig> {
    const ts3BucketConfig = remoteFileConfig as TS3BucketConfig;

    const { remoteFileName, isPrivate, putObjectCommand } = this._initiatePutObject(
      ts3BucketConfig,
      ts3BucketConfig.fileNameInBucket,
      fileStream,
      /**
       * uploadStream is not currently in use.
       */
      undefined,
    );

    return this._uploadFileViaClient(putObjectCommand, isPrivate, remoteFileName);
  }

  private async _uploadFileViaClient(
    putObjectCommand: PutObjectCommand,
    isPrivate: boolean,
    remoteFileName: string,
  ) {
    const bucketName = putObjectCommand.input.Bucket as string;
    try {
      const upload = new Upload({
        client: this.client,
        params: putObjectCommand.input,
      });

      await upload.done();
      const fileUri = isPrivate
        ? this.__generateAwsBucketUri(bucketName, remoteFileName)
        : undefined;

      return {
        bucketName: bucketName,
        fileNameInBucket: remoteFileName,
        private: isPrivate,
        uri: fileUri,
      };
    } catch (error) {
      console.error('Error uploading the file:', error);
      throw error;
    }
  }

  private _initiatePutObject(
    remoteFileConfig: TS3BucketConfig,
    fileName: string,
    readableStream: Readable,
    mimeType: MimeType | undefined,
  ) {
    const s3FileConfig = remoteFileConfig;
    const getObjectCommandInput = this.__fetchBucketPath(s3FileConfig);
    const isPrivate = s3FileConfig.private;

    const putObjectParams = {
      ...getObjectCommandInput,
      Body: readableStream,
      Key: fileName,
      ContentType: mimeType,
    } satisfies PutObjectCommandInput;

    const putObjectCommand = new PutObjectCommand(putObjectParams);

    return { remoteFileName: fileName, isPrivate, putObjectCommand };
  }

  private __fetchBucketPath(remoteFileConfig: TS3BucketConfig) {
    return {
      Bucket: remoteFileConfig.bucketName,
      Key: remoteFileConfig.fileNameInBucket,
    };
  }

  private __generateAwsBucketUri(bucketName: string, fileName: string) {
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  }

  generateRemotePath({
    customerName,
    fileName,
    directory,
  }: {
    fileName: string;
    customerName: string;
    directory?: string;
  }): string {
    return [customerName, directory, fileName].filter(pathPart => !!pathPart).join('/');
  }
}
