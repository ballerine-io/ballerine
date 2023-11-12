import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import os from 'os';
import { getFileName } from '@/storage/get-file-name';

export const multerFactory = (configService: ConfigService): MulterModuleOptions => {
  const processEnv = process.env;

  const options: MulterModuleOptions = {
    limits: {
      fileSize: 1024 * 1024 * 10, // 10MB
      files: 10,
    },
  };

  // TODO: init storage by env var: if S3 env var exists
  if (AwsS3FileConfig.isConfigured(processEnv)) {
    options.storage = multerS3({
      s3: new S3Client(AwsS3FileConfig.fetchClientConfig(processEnv)),
      acl: 'private',
      bucket: AwsS3FileConfig.getBucketName(processEnv) as string,
    });
  } else {
    options.storage = diskStorage({
      destination: os.tmpdir,
      filename: getFileName,
    });
  }

  return options;
};
