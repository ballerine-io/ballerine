import { IFormElement } from '../../../types';
import { useEvents } from '../useEvents';
import { useMount } from '../useMount';

export const useMountEvent = (element: IFormElement) => {
  const { sendEvent } = useEvents(element);

  useMount(() => sendEvent('onMount'));
};
