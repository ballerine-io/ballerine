import { useState } from 'react';
import { useCallback } from 'react';

export interface IFilesState {
  [key: string]: File;
}

const formatId = ({
  type,
  category,
  entityId,
}: {
  type: string;
  category: string;
  entityId: string;
}) => `${type}-${category}-${entityId}`;

export const useFiles = () => {
  const [state, setState] = useState<IFilesState>({});

  const setFile = useCallback(
    (
      { type, category, entityId }: { type: string; category: string; entityId: string },
      file: File,
    ) => {
      setState(prev => ({
        ...prev,
        [formatId({ type, category, entityId })]: file,
      }));
    },
    [],
  );

  const removeFile = useCallback(
    ({ type, category, entityId }: { type: string; category: string; entityId: string }) => {
      setState(prev => {
        const { [formatId({ type, category, entityId })]: _, ...rest } = prev;

        return rest;
      });
    },
    [],
  );

  const composeFileId = useCallback(
    ({ type, category, entityId }: { type: string; category: string; entityId: string }) => {
      return formatId({ type, category, entityId });
    },
    [],
  );

  return {
    files: state,
    setFile,
    removeFile,
    composeFileId,
  };
};
