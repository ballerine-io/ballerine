import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { formatValueDestination } from '@/components/organisms/Form/Validator/utils/format-value-destination';
import { useMemo } from 'react';
import { IFormElement } from '../../../types';

export const useValueDestination = (element: IFormElement, stack: TDeepthLevelStack = []) => {
  const valueDestination = useMemo(
    () => formatValueDestination(element.valueDestination, stack),
    [element.valueDestination, stack],
  );

  return valueDestination;
};
