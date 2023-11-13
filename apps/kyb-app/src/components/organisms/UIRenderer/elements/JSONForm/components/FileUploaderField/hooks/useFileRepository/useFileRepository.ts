import {
  RegisterFileFn,
  UseFileRepositoryResult,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { FileRepository } from '@app/utils/file-repository';
import { useCallback, useState } from 'react';

export const useFileRepository = (
  fileRepository: FileRepository,
  fileId?: string,
): UseFileRepositoryResult => {
  const [file, setFile] = useState<File | null>(() =>
    fileId ? fileRepository.getFileById(fileId) : null,
  );

  const registerFile: RegisterFileFn = useCallback(
    (file, fileId) => {
      fileRepository.registerFile(fileId, file);

      const registeredFile = fileRepository.getFileById(fileId);
      setFile(registeredFile);

      return registeredFile;
    },
    [fileRepository],
  );

  return {
    file,
    registerFile,
  };
};
