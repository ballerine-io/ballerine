import { DataContext } from '@app/common/providers/ViewStateProvider/hooks/useDataContext/types';
import { AnyObject } from '@ballerine/ui';
import { useCallback, useState } from 'react';

export function useDataContext<T extends DataContext>(initial = {} as T) {
  const [data, setData] = useState<T>(initial);

  const update = useCallback((key: string | number, data: T[any], shared?: AnyObject) => {
    setData(prev => ({
      ...prev,
      [key]: { ...(prev[key] as AnyObject), ...data },
      shared: shared ? { ...prev.shared, ...shared } : prev.shared,
    }));
  }, []);

  return {
    data,
    update,
  };
}
