import { useCallback } from 'react';

export const useFlowTracking = () => {
  const trackExit = useCallback(() => {
    window.parent.postMessage(
      'ballerine.collection-flow.back-button-pressed',
      import.meta.env.VITE_HOST_URL,
    );
  }, []);

  const trackFinish = useCallback(() => {
    window.parent.postMessage(
      'ballerine.collection-flow.finish-button-pressed',
      import.meta.env.VITE_HOST_URL,
    );
  }, []);

  return {
    trackExit,
    trackFinish,
  };
};
