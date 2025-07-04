import { useEvents } from '../useEvents';
import { useUnmount } from '../useUnmount';
import { TUIElement } from '@ballerine/common';

export const useUnmountEvent = (element: TUIElement) => {
  const { sendEvent } = useEvents(element);

  useUnmount(() => sendEvent('onUnmount'));
};
