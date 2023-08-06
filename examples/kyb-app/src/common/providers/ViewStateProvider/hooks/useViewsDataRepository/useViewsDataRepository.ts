import { ViewsData } from '@app/common/providers/ViewStateProvider/hooks/useViewsDataRepository/types';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useState } from 'react';
import merge from 'lodash/merge';

export function useViewsDataRepository<T extends ViewsData>(initial = {} as T) {
  const [data, setData] = useState<T>(initial);

  const update = useCallback(
    (
      key: string | number,
      data: T[any],
      shared: AnyObject = {},
      completed = false,
    ): Promise<AnyObject> => {
      return new Promise(resolve => {
        setData(prev => {
          const nextData: T = {
            ...prev,
            flowData: {
              ...prev.flowData,
              [key]: merge(prev.flowData[key] as AnyObject, data),
            },
            shared: shared ? { ...prev.shared, ...shared } : prev.shared,
            completionMap: {
              ...prev.completionMap,
              [key]: completed,
            },
          };

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
