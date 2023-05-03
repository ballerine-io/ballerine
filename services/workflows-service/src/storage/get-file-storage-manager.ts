import { diskStorage } from 'multer';
import { getFileName } from '@/storage/get-file-name';
import { z } from 'zod';
import multerS3 from 'multer-s3';
import { S3Client, S3ClientConfig } from '@aws-sdk/client-s3';

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

export const manageFileByProvider = () => {
  if (isS3BucketConfigured()) {
    return multerS3({
      s3: new S3Client(generateAwsConfig()),
      acl: 'public-read',
      bucket: z.string().parse(process.env.AWS_S3_BUCKET_NAME),
    });
  } else {
    return diskStorage({
      destination: './upload',
      filename: getFileName,
    });
  }
};
