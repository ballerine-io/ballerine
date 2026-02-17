import { Storage } from '@google-cloud/storage';
import { AppLoggerService } from '@/common/app-logger/app-logger.service';
import { IFileProvider } from '../types/interfaces';
import { MimeType } from 'file-type';
import type {
  TGcsBucketConfig,
  TLocalFilePath,
  TRemoteFileConfig,
} from '@/providers/file/types/files-types';

/**
 * Minimal GCS-backed file provider.
 *
 * Cloud Run uses the runtime service account via ADC (no JSON key files).
 * Bucket/object IAM is managed by Terraform (roles/storage.objectCreator + objectViewer).
 */
export class GcpGcsFileService implements IFileProvider {
  protected readonly client: Storage;

  constructor(private readonly logger: AppLoggerService, storage?: Storage) {
    this.client = storage ?? new Storage();
  }

  async isRemoteExists(remoteFileConfig: TRemoteFileConfig): Promise<boolean> {
    const cfg = remoteFileConfig as TGcsBucketConfig;
    const [exists] = await this.client.bucket(cfg.bucketName).file(cfg.fileNameInBucket).exists();

    return exists;
  }

  async download(
    remoteFileConfig: TRemoteFileConfig,
    localeFilePath: TLocalFilePath,
  ): Promise<TLocalFilePath> {
    const cfg = remoteFileConfig as TGcsBucketConfig;

    try {
      await this.client
        .bucket(cfg.bucketName)
        .file(cfg.fileNameInBucket)
        .download({ destination: localeFilePath });

      return localeFilePath;
    } catch (error) {
      this.logger.error('Error downloading file from GCS', {
        error,
        bucketName: cfg.bucketName,
        objectName: cfg.fileNameInBucket,
        localeFilePath,
      });
      throw error;
    }
  }

  async upload(
    localFilePath: TLocalFilePath,
    remoteFileConfig: TRemoteFileConfig,
    mimeType: MimeType | string | undefined,
  ): Promise<TGcsBucketConfig> {
    const cfg = remoteFileConfig as TGcsBucketConfig;

    // `file-type` exports `MimeType` as a string union, so treat as string.
    const contentType = mimeType ? String(mimeType) : undefined;

    try {
      await this.client.bucket(cfg.bucketName).upload(localFilePath, {
        destination: cfg.fileNameInBucket,
        // Preserve MIME type so downstream services (unified-api image-fetch) see image/*.
        ...(contentType ? { metadata: { contentType } } : {}),
      });

      return cfg;
    } catch (error) {
      this.logger.error('Error uploading file to GCS', {
        error,
        bucketName: cfg.bucketName,
        objectName: cfg.fileNameInBucket,
      });
      throw error;
    }
  }

  generateRemotePath({
    customerName,
    fileName,
    directory,
  }: {
    fileName: string;
    customerName: string;
    directory?: string;
  }): string {
    return [customerName, directory, fileName].filter(Boolean).join('/');
  }
}
