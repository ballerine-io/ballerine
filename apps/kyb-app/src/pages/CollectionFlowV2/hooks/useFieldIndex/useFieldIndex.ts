import { parseInputIndex } from '@/pages/CollectionFlowV2/hooks/useFieldIndex/helpers';
import { useMemo } from 'react';

export const useFieldIndex = (inputId: string) => {
  const index = useMemo(() => {
    if (typeof inputId !== 'string') return null;

    const index = parseInputIndex(inputId || '');

    return isNaN(index as number) ? null : index;
  }, [inputId]);

  return index;
};
