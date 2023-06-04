import { useEffect } from 'react';
import { AnyArray } from '../../types';

export const useConsole = <TValues extends AnyArray>(...values: TValues) => {
  useEffect(() => {
    console.log(...values);
  }, [values]);
};
