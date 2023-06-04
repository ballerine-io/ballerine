import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../../common/utils/is-string/is-string';

import { storageQueryKeys } from '../../../query-keys';

export const useStorageFileQuery = (fileId: string) =>
  useQuery({
    ...storageQueryKeys.fileById(fileId),
    enabled: isString(fileId) && !!fileId.length,
  });
