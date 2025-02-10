import { IFormElement } from '../../../types';
import { useEvents } from '../useEvents';
import { useUnmount } from '../useUnmount';

export const useUnmountEvent = (element: IFormElement) => {
  const { sendEvent } = useEvents(element);

  useUnmount(() => sendEvent('onUnmount'));
};
