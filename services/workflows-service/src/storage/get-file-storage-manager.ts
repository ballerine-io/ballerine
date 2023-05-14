import { diskStorage } from 'multer';
import { getFileName } from '@/storage/get-file-name';
import { z } from 'zod';
import multerS3 from 'multer-s3';
import { S3Client, S3ClientConfig, GetObjectCommand } from '@aws-sdk/client-s3';
import * as tmp from 'tmp';
import * as fs from 'fs';

import { Readable } from 'stream';
type TLocalFile = string;

export const S3StorageEnvSchema = z.object({
  AWS_REGION: z.string(),
  AWS_S3_BUCKET_SECRET: z.string(),
  AWS_S3_BUCKET_KEY: z.string(),
});

const __generateAwsConfig = (processEnv: NodeJS.ProcessEnv): S3ClientConfig => {
  const { AWS_REGION, AWS_S3_BUCKET_KEY, AWS_S3_BUCKET_SECRET } = S3StorageEnvSchema.parse(
    processEnv
  );

  return {
    region: AWS_REGION,
    credentials: {
      accessKeyId: AWS_S3_BUCKET_KEY,
      secretAccessKey: AWS_S3_BUCKET_SECRET,
    },
  };
};

const __isS3BucketConfigured = (processEnv: NodeJS.ProcessEnv) => {
  return !!z.string().optional().parse(processEnv.AWS_S3_BUCKET_KEY);
};

export const fetchDefaultBucketName = (processEnv: NodeJS.ProcessEnv) => {
  return z.string().parse(processEnv.AWS_S3_BUCKET_NAME);
};

export const manageFileByProvider = (processEnv: NodeJS.ProcessEnv) => {
  if (__isS3BucketConfigured(processEnv)) {
    return multerS3({
      s3: new S3Client(__generateAwsConfig(processEnv)),
      acl: 'private',
      bucket: fetchDefaultBucketName(processEnv),
    });
  } else {
    return diskStorage({
      destination: './upload',
      filename: getFileName,
    });
  }
};

export const downloadFileFromS3 = async (
  bucketName: string,
  fileNameInBucket: string,
): Promise<TLocalFile> => {
  try {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileNameInBucket });
    let s3Client = new S3Client(__generateAwsConfig(process.env));
    const response = await s3Client.send(getObjectCommand);
    const readableStream = response.Body as Readable;
    const tmpFile = tmp.fileSync();
    const writableStream = fs.createWriteStream(tmpFile.name);

    return new Promise((resolve, reject) => {
      readableStream
        .pipe(writableStream)
        .on('finish', () => {
          resolve(tmpFile.name);
        })
        .on('error', error => {
          console.error('Error Upload file to S3:', error);
          reject(new Error("Failed to upload S3 file"));
        });
    });
  } catch (error) {
    console.error('Error Stream file to S3:', error);
    throw new Error("Failed to Stream S3 file");
  }
};
