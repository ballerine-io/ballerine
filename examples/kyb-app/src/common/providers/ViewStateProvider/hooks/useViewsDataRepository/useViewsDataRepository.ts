import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useState } from 'react';

export function useViewsDataRepository<T extends ViewsData>(initial = {} as T) {
  const [data, setData] = useState<T>(initial);

  const update = useCallback(
    (key: string | number, data: T[any], shared?: AnyObject): Promise<AnyObject> => {
      return new Promise(resolve => {
        setData(prev => {
          const nextData = {
            ...prev,
            [key]: { ...(prev[key] as AnyObject), ...data },
            shared: shared ? { ...prev.shared, ...shared } : prev.shared,
          };

          console.log('update next data', nextData);

          resolve(nextData);

          return nextData;
        });
      });
    },
    [],
  );

  return {
    data,
    update,
  };
}
