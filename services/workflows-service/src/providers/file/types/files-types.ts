export type TRemoteUri = string;
export type TLocalFilePath = string;
export type TS3BucketConfig = {
  bucketName: string;
  fileNameInBucket: string; // id in bucket
  private: boolean | true;
  uri?: TRemoteUri;
};

export type TGcsBucketConfig = {
  provider: 'gcs';
  bucketName: string;
  fileNameInBucket: string; // object name in bucket
  private: boolean | true;
  uri?: TRemoteUri;
};

export type TRemoteFileConfig = TS3BucketConfig | TGcsBucketConfig | TRemoteUri;
export type TStringInt = string | number;
