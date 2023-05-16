import { HttpFileService } from '@/providers/file/file-provider/http-file.service';
import { AwsS3FileService } from '@/providers/file/file-provider/aws-s3-file.service';
import { LocalFileService } from '@/providers/file/file-provider/local-file.service';
import { Readable } from 'stream';

export type TRemoteUri = string;
export type TLocalFilePath = string;
export type TS3BucketConfig = {
  bucketName: string;
  fileNameInBucket: string; // id in bucket
  private: boolean | true;
  uri?: TRemoteUri;
};

export type TRemoteFileConfig = TS3BucketConfig | TRemoteUri;
export type TStringInt = string | number;
export type TFileServiceProvider = HttpFileService | AwsS3FileService | LocalFileService;

export interface IFileProvider {
  isRemoteFileExists(remoteFileConfig: TRemoteFileConfig): Promise<boolean>;
  downloadFile(
    remoteFileConfig: TRemoteFileConfig,
    localeFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath>;
  uploadFile(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig | TLocalFilePath | void>;
}

export interface IStreamableFileProvider extends IFileProvider {
  fetchRemoteFileDownStream(remoteFileConfig: TRemoteFileConfig): Promise<Readable>;
  uploadFileStream(
    fileStream: Readable,
    remoteFileConfig: TRemoteFileConfig,
  ): Promise<TRemoteFileConfig>;
}
