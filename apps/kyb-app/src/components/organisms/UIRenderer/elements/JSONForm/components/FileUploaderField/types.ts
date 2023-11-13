import { FileRepository } from '@app/utils/file-repository';

export type UploadedFileResult = { fileId: string };
export type UploadFileCallback = (file: File) => Promise<UploadedFileResult>;

export interface DocumentUploadFieldProps {
  uploadFile: UploadFileCallback;
  onChange: (fileId: string) => void;
  fileStorage: FileRepository;
  fileId?: string | null;
  isLoading?: boolean;
  disabled?: boolean;
  acceptFileFormats?: string;
  placeholder?: string;
}
