import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { formatId } from '@/components/organisms/Form/Validator/utils/format-id';
import { useMemo } from 'react';
import { IFormElement } from '../../../types';

export const useElementId = (element: IFormElement<any, any>, stack: TDeepthLevelStack = []) => {
  const formattedId = useMemo(() => formatId(element.id, stack), [element.id, stack]);

  return formattedId;
};
