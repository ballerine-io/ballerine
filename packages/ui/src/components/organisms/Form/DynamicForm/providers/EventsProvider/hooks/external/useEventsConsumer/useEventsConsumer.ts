import { useEffect, useRef } from 'react';
import { IEventsListener } from '../../../types';
import { useEventsProvider } from '../../internal/useEventsProvider';

export const useEventsConsumer = (listener: IEventsListener) => {
  const { subscribe, unsubscribe } = useEventsProvider();

  const subscribeRef = useRef(subscribe);
  const unsubscribeRef = useRef(unsubscribe);

  useEffect(() => {
    subscribeRef.current = subscribe;
    unsubscribeRef.current = unsubscribe;
  }, [subscribe, unsubscribe]);

  useEffect(() => {
    subscribeRef.current(listener);

    return () => {
      unsubscribeRef.current(listener);
    };
  }, [subscribeRef, unsubscribeRef, listener]);
};
