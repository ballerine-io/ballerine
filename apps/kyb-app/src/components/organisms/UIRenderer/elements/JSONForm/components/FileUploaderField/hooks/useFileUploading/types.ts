import { HTTPError } from 'ky';

export interface UploadFileResult {
  fileId: string;
}
export type UploadFileFn = (file: File) => Promise<UploadFileResult>;

export interface UseFileUploadingResult {
  isUploading: boolean;
  error: HTTPError | Error | null;
  fileId: string | null;
  uploadFile: UploadFileFn;
}

export type UseFileUploadOnUploadCallback = (fileId: string) => void;

export type RegisterFileFn = (file: File, fileId: string) => File;

export type RemoveFileFn = (fileId: string) => void;

export interface UseFileRepositoryResult {
  file: File | null;
  registerFile: RegisterFileFn;
  removeFile: RemoveFileFn;
}
