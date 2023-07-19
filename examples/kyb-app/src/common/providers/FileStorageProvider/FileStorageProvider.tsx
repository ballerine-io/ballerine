import { AnyChildren, AnyObject } from '@ballerine/ui';
import { fileStorageContext } from './file-storage.context';
import { FileStorage } from '@app/common/utils/file-storage';
import { useMemo } from 'react';

const { Provider } = fileStorageContext;

interface Props {
  storage: FileStorage;
  children: AnyChildren;
}

export const FileStorageProvider = ({ children, storage }: Props) => {
  const context = useMemo(() => {
    return {
      storage,
    };
  }, [storage]);

  return <Provider value={context}>{children}</Provider>;
};
