import { TDeepthLevelStack } from '@/components/organisms/Form/Validator';
import { formatId } from '@/components/organisms/Form/Validator/utils/format-id';
import { useMemo } from 'react';
import { TUIElement } from '@ballerine/common';

export const useElementId = (element: TUIElement, stack: TDeepthLevelStack = []) => {
  const formattedId = useMemo(() => formatId(element.id, stack), [element.id, stack]);

  return formattedId;
};
