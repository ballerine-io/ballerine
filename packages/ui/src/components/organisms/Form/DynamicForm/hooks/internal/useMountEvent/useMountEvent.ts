import { useEvents } from '../useEvents';
import { useMount } from '../useMount';
import { TUIElement } from '@ballerine/common';

export const useMountEvent = (element: TUIElement) => {
  const { sendEvent } = useEvents(element);

  useMount(() => sendEvent('onMount'));
};
