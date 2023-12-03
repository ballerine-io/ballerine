import { useQueries } from '@tanstack/react-query';
import { isString } from '../../../../../common/utils/is-string/is-string';
import { storageQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useStorageFilesQuery = (fileIds: Array<string>) => {
  const isAuthenticated = useIsAuthenticated();

  return useQueries({
    queries:
      fileIds?.map(fileId => ({
        ...storageQueryKeys.fileById({
          fileId,
        }),
        enabled: isString(fileId) && !!fileId?.length && isAuthenticated,
        staleTime: Infinity,
        refetchInterval: false,
      })) ?? [],
  });
};
