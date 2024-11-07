import { useCallback } from 'react';
import { TCollectionFlowEvents } from './enums';

const DEFAULT_PREFIX = 'ballerine.collection-flow';

interface IUseFlowTracking {
  prefix?: string;
}

const formatEventName = (prefix: string, event: string) => `${prefix}.${event}`;

export const useFlowTracking = (
  { prefix = DEFAULT_PREFIX }: IUseFlowTracking = { prefix: DEFAULT_PREFIX },
) => {
  const trackEvent = useCallback(
    (event: TCollectionFlowEvents) => {
      const formattedEvent = formatEventName(prefix, event);

      console.log(`Sending event: ${formattedEvent}`);
      window.parent.postMessage(formattedEvent, '*');
    },
    [prefix],
  );

  return {
    trackEvent,
  };
};
