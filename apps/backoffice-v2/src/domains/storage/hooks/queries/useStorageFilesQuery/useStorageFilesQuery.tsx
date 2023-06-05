import { useQueries } from '@tanstack/react-query';
import { isString } from '../../../../../common/utils/is-string/is-string';
import { storageQueryKeys } from '../../../query-keys';

export const useStorageFilesQuery = (fileIds: Array<string>) => {
  return useQueries({
    queries:
      fileIds?.map(fileId => ({
        ...storageQueryKeys.fileById(fileId),
        enabled: isString(fileId) && !!fileId?.length,
      })) ?? [],
  });
};
