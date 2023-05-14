import { z } from 'zod';

const ImageSideSchema = z.union([z.literal('Back'), z.literal('Font')]);
const UFileProviders = z.union([
  z.literal('HttpFileService'),
  z.literal('AwsS3FileService'),
  z.literal('LocalFileService'),
]);
const RemoteUriSchema = z.string();

const S3BucketConfigSchema = z.object({
  bucketName: z.string(),
  fileNameInBucket: z.string(),
  private: z.boolean().default(true),
  uri: z.string().optional(),
});

const FileProviderSchema = z.object({
  provider: UFileProviders,
  accessConfig: z.union([RemoteUriSchema, S3BucketConfigSchema]),
});

const FileProviderInformation = z.object({
  originProviderInfo: FileProviderSchema,
  fileProviderInfo: FileProviderSchema,
});

export const TMetadataSchema = z.object({
  size: z.number().optional(),
  dimensions: z.string().optional(),
  fileProviderInformation: FileProviderInformation.optional(),
  pageNumber: z.number().optional(),
  side: ImageSideSchema.optional(),
});
