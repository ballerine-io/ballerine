export interface UploadFileDto {
  file: File;
}

export interface IFile {
  id: string;
  projectId: string;
  fileNameInBucket: string | null;
  fileNameOnDisk: string | null;
}
