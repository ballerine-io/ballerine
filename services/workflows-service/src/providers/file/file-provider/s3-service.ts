import {
  IFileProvider,
  TLocalFilePath,
  TRemoteFileConfig, TS3BucketConfig,
} from "@/providers/file/types";
import {
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  S3ClientConfig
} from "@aws-sdk/client-s3";
import {Readable} from "stream";
import fs, {createReadStream} from "fs";
import path from "path";
import {isErrorWithName} from "../../../../../../packages/common"; // TODO: NEED to push to package
// import { isErrorWithName } from '@ballerine/common';

class AwsS3Service implements IFileProvider {
  protected client;

  constructor(s3ClientConfig: S3ClientConfig) {
    this.client = new S3Client(s3ClientConfig)
  }

  async downloadFile(remoteFileConfig: TS3BucketConfig, localeFilePath: TLocalFilePath): Promise<TLocalFilePath>{
    const getObjectParams = this.fetchBucketPath(remoteFileConfig)

    try {
      const getObjectCommand = new GetObjectCommand(getObjectParams);
      const response = await this.client.send(getObjectCommand);
      const readableStream = response.Body as Readable;
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
      console.error('Error downloading file from S3:', error);
      throw error;
    }
  }

  async isRemoteFileExists(remoteFileConfig: TS3BucketConfig): Promise<boolean> {
    const getObjectParams = this.fetchBucketPath(remoteFileConfig)

    try {
      const headObjectCommand = new HeadObjectCommand(getObjectParams);
      await this.client.send(headObjectCommand);
      return Promise.resolve(true);
    } catch (error) {
      if (isErrorWithName(error) && (error.name.toLowerCase() === "notfound" || error.name.toLowerCase() === "not found") ) {
        return Promise.resolve(false);
      }
      console.error("Error checking remote file existence:", error);
      throw error;
    }
  }

  async uploadFile(localFilePath: TLocalFilePath, remoteFileConfig: TS3BucketConfig): Promise<TS3BucketConfig> {
    const getObjectCommandInput = this.fetchBucketPath(remoteFileConfig);
    const remoteFileName = path.parse(localFilePath).base;
    const isPrivate = remoteFileConfig.private;
    const putObjectParams = {...getObjectCommandInput, Body: createReadStream(localFilePath), Key: remoteFileName}

    try {
      await this.client.send(new PutObjectCommand(putObjectParams));
      const fileUri = isPrivate ? this.generateAwsBucketUri(getObjectCommandInput.Bucket, remoteFileName) : undefined;

      return {
        bucketName: getObjectCommandInput.Bucket,
        key: remoteFileName,
        private: isPrivate,
        uri: fileUri
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      throw error;
    }
  }

  private fetchBucketPath(remoteFileConfig: TS3BucketConfig) {
    return { Bucket: remoteFileConfig.bucketName, Key: remoteFileConfig.key };
  }

  private generateAwsBucketUri(bucketName: string, fileName: string) {
    return `https://${bucketName}.s3.amazonaws.com/${fileName}`;
  }
}
