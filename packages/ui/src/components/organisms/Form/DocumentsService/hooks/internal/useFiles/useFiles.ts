import { formatDocumentId } from '@/components/organisms/Form/DynamicForm/utils/format-document-id';
import { useState } from 'react';
import { useCallback } from 'react';

export interface IFilesState {
  [key: string]: File;
}

export const useFiles = () => {
  const [state, setState] = useState<IFilesState>({});

  const setFile = useCallback(
    (
      {
        type,
        category,
        entityType,
        entityId,
      }: { type: string; category: string; entityType: string; entityId: string },
      file: File,
    ) => {
      setState(prev => ({
        ...prev,
        [formatDocumentId({ type, category, entityType, entityId })]: file,
      }));
    },
    [],
  );

  const removeFile = useCallback(
    ({
      type,
      category,
      entityType,
      entityId,
    }: {
      type: string;
      category: string;
      entityType: string;
      entityId: string;
    }) => {
      setState(prev => {
        const { [formatDocumentId({ type, category, entityType, entityId })]: _, ...rest } = prev;

        return rest;
      });
    },
    [],
  );

  const composeFileId = useCallback(
    ({
      type,
      category,
      entityType,
      entityId,
    }: {
      type: string;
      category: string;
      entityType: string;
      entityId: string;
    }) => formatDocumentId({ type, category, entityType, entityId }),
    [],
  );

  return {
    files: state,
    setFile,
    removeFile,
    composeFileId,
  };
};
