import { UIElement } from '@/components/providers/Validator/hooks/useValidate/ui-element';
import { useEventEmmitter } from '@/pages/CollectionFlowV2/hocs/withConnectedField';
import { useCallback } from 'react';

export const useOnClickHandler = (uiElement: UIElement) => {
  const emitEvent = useEventEmmitter(uiElement);

  const handleClick = useCallback(() => emitEvent('onClick'), [emitEvent]);

  return handleClick;
};
