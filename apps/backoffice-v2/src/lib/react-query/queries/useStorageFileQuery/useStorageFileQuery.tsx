import { useQuery } from '@tanstack/react-query';
import { isString } from '../../../../utils/is-string/is-string';
import { storage } from '../../../../lib/react-query/storage';

export const useStorageFileQuery = (fileId: string) =>
  useQuery({
    ...storage.fileById(fileId),
    enabled: isString(fileId) && !!fileId.length,
  });
