import { S3ClientConfig } from '@aws-sdk/client-s3';
import { z } from 'zod';

export class AwsS3FileConfig {
  static isConfigured(processEnv: NodeJS.ProcessEnv) {
    return !!this.getBucketName(processEnv) && !!processEnv[`AWS_REGION`];
  }

  static getBucketName(processEnv: NodeJS.ProcessEnv) {
    return processEnv[`AWS_S3_BUCKET_NAME`];
  }

  static fetchClientConfig = (processEnv: NodeJS.ProcessEnv, prefix = ''): S3ClientConfig => {
    const data = z
      .object({
        region: z.string(),
        credentials: z.object({
          accessKeyId: z.string(),
          secretAccessKey: z.string(),
        }),
      })
      .parse({
        region: processEnv[`${prefix}AWS_REGION`],
        credentials: {
          accessKeyId: processEnv[`${prefix}AWS_S3_BUCKET_KEY`],
          secretAccessKey: processEnv[`${prefix}AWS_S3_BUCKET_SECRET`],
        },
      });

    return data;
  };
}
