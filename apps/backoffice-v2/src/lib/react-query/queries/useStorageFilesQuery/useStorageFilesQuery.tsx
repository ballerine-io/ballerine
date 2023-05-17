import { useQueries } from '@tanstack/react-query';
import { storage } from '../../storage';
import { isString } from '../../../../utils/is-string/is-string';

export const useStorageFilesQuery = (fileIds: Array<string>) => {
  return useQueries({
    queries:
      fileIds?.map(fileId => ({
        ...storage.fileById(fileId),
        enabled: isString(fileId) && fileId?.length > 0,
      })) ?? [],
  });
};
