import { UploadFileFn } from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { FileRepository } from '@app/utils/file-repository';

export type UploadedFileResult = { fileId: string };
export type UploadFileCallback = (file: File) => Promise<UploadedFileResult>;

export interface DocumentUploadFieldProps {
  onChange: (fileId: string) => void;
  uploadFile: UploadFileFn;
  onBlur?: () => void;
  fileRepository: FileRepository;
  fileId?: string | null;
  isLoading?: boolean;
  disabled?: boolean;
  acceptFileFormats?: string;
  placeholder?: string;
}
