import { diskStorage } from 'multer';
import { getFileName } from '@/storage/get-file-name';
import { z } from 'zod';
import multerS3 from 'multer-s3';
import { S3Client, S3ClientConfig, GetObjectCommand } from '@aws-sdk/client-s3';
import * as tmp from 'tmp';
import * as fs from 'fs';

import { Readable } from 'stream';
export type TLocalFile = string;

export const S3StorageEnvSchema = z.object({
  AWS_REGION: z.string(),
  AWS_S3_BUCKET_SECRET: z.string(),
  AWS_S3_BUCKET_KEY: z.string(),
});

const generateAwsConfig = (processEnv: NodeJS.ProcessEnv): S3ClientConfig => {
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

const isS3BucketConfigured = (processEnv: NodeJS.ProcessEnv) => {
  return !!z.string().optional().parse(processEnv.AWS_S3_BUCKET_KEY);
};

export const fetchDefaultBucketName = (processEnv: NodeJS.ProcessEnv) => {
  return z.string().parse(processEnv.AWS_S3_BUCKET_NAME);
};

export const manageFileByProvider = (processEnv: NodeJS.ProcessEnv) => {
  console.log(processEnv)
  if (isS3BucketConfigured(processEnv)) {
    return multerS3({
      s3: new S3Client(generateAwsConfig(processEnv)),
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
    let s3Client = new S3Client(generateAwsConfig(process.env));
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
          reject(error);
        });
    });
  } catch (error) {
    console.error('Error downloading file from S3:', error);
    throw error;
  }
};
