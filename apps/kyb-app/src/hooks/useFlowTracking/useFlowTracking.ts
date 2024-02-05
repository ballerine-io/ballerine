import { useCallback } from 'react';

export const useFlowTracking = () => {
  const trackExit = useCallback(() => {
    window.parent.postMessage('ballerine.collection-flow.back-button-pressed', '*');
  }, []);

  const trackFinish = useCallback(() => {
    window.parent.postMessage('ballerine.collection-flow.finish-button-pressed', '*');
  }, []);

  return {
    trackExit,
    trackFinish,
  };
};
