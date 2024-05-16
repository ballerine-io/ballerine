import { useCallback } from 'react';

export const useFlowTracking = () => {
  const trackExit = useCallback(() => {
    const event = 'ballerine.collection-flow.back-button-pressed';
    console.log(`Sending event: ${event}`);
    window.parent.postMessage(event, '*');
  }, []);

  const trackFinish = useCallback(() => {
    const event = 'ballerine.collection-flow.finish-button-pressed';
    console.log(`Sending event: ${event}`);

    window.parent.postMessage('ballerine.collection-flow.finish-button-pressed', '*');
  }, []);

  return {
    trackExit,
    trackFinish,
  };
};
