export type TRemoteUri = string;
export type TLocalFilePath = string;
export type TS3BucketConfig = {
  bucketName: string,
  key: string // id in bucket
  private: boolean | 'true'
  uri?: TRemoteUri
}

export type TRemoteFileConfig = TS3BucketConfig | TRemoteUri

export interface IFileProvider {
  isRemoteFileExists(remoteFileConfig: TRemoteFileConfig): Promise<boolean>;
  downloadFile(remoteFileConfig: TRemoteFileConfig, localeFilePath: TLocalFilePath): Promise<TLocalFilePath>;
  uploadFile(localFilePath: TLocalFilePath, remoteFileConfig: TRemoteFileConfig): Promise<TRemoteFileConfig | TLocalFilePath | void>;
}
