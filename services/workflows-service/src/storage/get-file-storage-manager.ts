import { diskStorage } from 'multer';
import { getFileName } from '@/storage/get-file-name';
import { z } from 'zod';
import multerS3 from 'multer-s3';
import { S3Client, S3ClientConfig, GetObjectCommand } from '@aws-sdk/client-s3';
import * as tmp from 'tmp';
import * as fs from 'fs';

import { Readable } from 'stream';
export type TLocalFile = string;

const isS3BucketConfigured = () => {
  return process.env.AWS_S3_BUCKET_KEY;
};

const generateAwsConfig = (): S3ClientConfig => {
  return {
    region: z.string().parse(process.env.AWS_REGION),
    credentials: {
      accessKeyId: z.string().parse(process.env.AWS_S3_BUCKET_KEY),
      secretAccessKey: z.string().parse(process.env.AWS_S3_BUCKET_SECRET),
    },
  };
};

export const fetchDefaultBucketName = () => {
  return z.string().parse(process.env.AWS_S3_BUCKET_NAME);
};

export const manageFileByProvider = () => {
  if (isS3BucketConfigured()) {
    return multerS3({
      s3: new S3Client(generateAwsConfig()),
      acl: 'private',
      bucket: fetchDefaultBucketName(),
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
  bucketKey: string,
): Promise<TLocalFile> => {
  try {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: bucketKey });
    let s3Client = new S3Client(generateAwsConfig());
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
