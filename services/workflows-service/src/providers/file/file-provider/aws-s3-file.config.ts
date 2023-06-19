import { S3ClientConfig } from '@aws-sdk/client-s3';
import { z } from 'zod';

export class AwsS3FileConfig {
  static isConfigured(processEnv: NodeJS.ProcessEnv, prefix = '') {
    return !!this.fetchBucketName(processEnv, prefix) && !!processEnv[`${prefix}AWS_REGION`];
  }

  static fetchBucketName(processEnv: NodeJS.ProcessEnv, prefix = '') {
    return processEnv[`${prefix}AWS_S3_BUCKET_NAME`];
  }

  static fetchClientConfig = (processEnv: NodeJS.ProcessEnv, prefix = ''): S3ClientConfig => {
    return {
      region: z.string().parse(processEnv[`${prefix}AWS_REGION`]),
      credentials: {
        accessKeyId: z.string().parse(processEnv[`${prefix}AWS_S3_BUCKET_KEY`]),
        secretAccessKey: z.string().parse(processEnv[`${prefix}AWS_S3_BUCKET_SECRET`]),
      },
    };
  };
}
