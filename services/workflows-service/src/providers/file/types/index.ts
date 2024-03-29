import { Base64FileService } from '@/providers/file/file-provider/base64-file.service';
import { AwsS3FileService } from '../file-provider/aws-s3-file.service';
import { HttpFileService } from '../file-provider/http-file.service';
import { LocalFileService } from '../file-provider/local-file.service';

export type TFileServiceProvider =
  | HttpFileService
  | AwsS3FileService
  | LocalFileService
  | Base64FileService;
