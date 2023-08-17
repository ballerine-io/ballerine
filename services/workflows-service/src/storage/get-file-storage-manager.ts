import { diskStorage } from 'multer';
import { getFileName } from '@/storage/get-file-name';
import multerS3 from 'multer-s3';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as tmp from 'tmp';
import * as fs from 'fs';

import { Readable } from 'stream';
import { AwsS3FileConfig } from '@/providers/file/file-provider/aws-s3-file.config';
import { TLocalFile } from '@/storage/types';
import path from 'path';
import os from 'os';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getSignedUrlCF } from 'aws-cloudfront-sign';
import { prefix } from 'concurrently/dist/src/defaults';

export const manageFileByProvider = (processEnv: NodeJS.ProcessEnv) => {
  if (AwsS3FileConfig.isConfigured(processEnv)) {
    return multerS3({
      s3: new S3Client(AwsS3FileConfig.fetchClientConfig(processEnv)),
      acl: 'private',
      bucket: AwsS3FileConfig.getBucketName(processEnv) as string,
    });
  } else {
    const root = path.parse(os.homedir()).root;

    return diskStorage({
      destination: `${root}/tmp`,
      filename: getFileName,
    });
  }
};

export const downloadFileFromS3 = async (
  bucketName: string,
  fileNameInBucket: string,
  customerName?: string,
): Promise<TLocalFile> => {
  try {
    const getObjectCommand = new GetObjectCommand({ Bucket: bucketName, Key: fileNameInBucket });
    const s3Client = new S3Client(
      AwsS3FileConfig.fetchClientConfig(
        process.env,
        `${customerName ? customerName.toUpperCase() : ''}`,
      ),
    );
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
          reject(new Error('Failed to upload S3 file'));
        });
    });
  } catch (error) {
    console.error('Error Stream file to S3:', error);
    throw new Error('Failed to Stream S3 file');
  }
};

export const createPresignedUrlWithClient = async ({
  bucketName,
  fileNameInBucket,
  fileTypeByEnding,
  service = 'cloudfront',
}: {
  bucketName: string;
  fileNameInBucket: string;
  fileTypeByEnding?: string;
  service?: 's3' | 'cloudfront';
}): Promise<TLocalFile> => {
  if (
    service === 'cloudfront' &&
    process.env.AWS_S3_CF_URL &&
    process.env.AWS_S3_CF_KEYPAIR_ID &&
    process.env.AWS_S3_CF_PRIVATE_KEY
  ) {
    return cloudfrontPresignedUrl({
      fileNameInBucket,
    });
  }

  return s3PresignedUrl({
    bucketName,
    fileNameInBucket,
    fileTypeByEnding,
  });
};

export const s3PresignedUrl = async ({
  bucketName,
  fileNameInBucket,
  fileTypeByEnding,
}: {
  bucketName: string;
  fileNameInBucket: string;
  fileTypeByEnding?: string;
}) => {
  const s3Client = new S3Client(AwsS3FileConfig.fetchClientConfig(process.env));
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: fileNameInBucket,
    ResponseContentType: fileTypeByEnding && `application/${fileTypeByEnding}`,
  });

  return getSignedUrl(s3Client, command, { expiresIn: 1800 });
};

export const cloudfrontPresignedUrl = ({ fileNameInBucket }: { fileNameInBucket: string }) => {
  return getSignedUrlCF(`${process.env.AWS_S3_CF_URL as string}/${fileNameInBucket}`, {
    keypairId: process.env.AWS_S3_CF_KEYPAIR_ID as string,
    expireTime: Date.now() + 1800 * 1000,
    privateKeyString: process.env.AWS_S3_CF_PRIVATE_KEY as string,
  });
};
