import {
  RegisterFileFn,
  UseFileRepositoryResult,
} from '@app/components/organisms/UIRenderer/elements/JSONForm/components/FileUploaderField/hooks/useFileUploading/types';
import { useRefValue } from '@app/hooks/useRefValue';
import { FileRepository, FileRepositoryListener } from '@app/utils/file-repository';
import { useCallback, useEffect, useState } from 'react';

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

  const repositoryListener: FileRepositoryListener = useCallback(
    (updatedFileId, action) => {
      if (fileId === updatedFileId && action === 'add') {
        setFile(fileRepository.getFileById(updatedFileId));
      }
    },
    [setFile, fileId],
  );

  const listenerRef = useRefValue(repositoryListener);

  useEffect(() => {
    fileRepository.subscribe(listenerRef.current);

    return () => {
      fileRepository.unsubscribe(listenerRef.current);
    };
  }, [listenerRef, fileRepository]);

  return {
    file,
    registerFile,
  };
};
