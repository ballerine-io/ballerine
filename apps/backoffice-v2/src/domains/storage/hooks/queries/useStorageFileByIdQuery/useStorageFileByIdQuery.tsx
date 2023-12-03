import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../../common/utils/is-string/is-string';
import { storageQueryKeys } from '../../../query-keys';
import { useIsAuthenticated } from '../../../../auth/context/AuthProvider/hooks/useIsAuthenticated/useIsAuthenticated';

export const useStorageFileByIdQuery = (
  fileId: string,
  {
    isEnabled = true,
    withSignedUrl = true,
  }: {
    isEnabled?: boolean;
    withSignedUrl?: boolean;
  } = {
    isEnabled: true,
    withSignedUrl: true,
  },
) => {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    ...storageQueryKeys.fileById({
      fileId,
      withSignedUrl,
    }),
    enabled: isEnabled && isString(fileId) && !!fileId?.length && isAuthenticated,
    staleTime: Infinity,
    refetchInterval: false,
  });
};
