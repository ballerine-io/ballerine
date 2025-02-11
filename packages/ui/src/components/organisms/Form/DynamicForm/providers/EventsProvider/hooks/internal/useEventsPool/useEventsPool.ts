import {
  IFormEventElement,
  TElementEvent,
} from '@/components/organisms/Form/DynamicForm/hooks/internal/useEvents/types';
import { useCallback, useState } from 'react';
import { IEventsProviderProps } from '../../../EventsProvider';
import { IEventsListener } from '../../../types';

export const useEventsPool = (onEvent: IEventsProviderProps['onEvent']) => {
  const [listeners, setListeners] = useState<IEventsListener[]>([]);

  const subscribe = useCallback((listener: IEventsListener) => {
    setListeners(prev => {
      const isListenerExists = prev.find(
        l => l.id === listener.id && l.eventName === listener.eventName,
      );

      if (isListenerExists) {
        return prev.map(prevListener =>
          prevListener.id === listener.id && prevListener.eventName === listener.eventName
            ? listener
            : prevListener,
        );
      }

      return [...prev, listener];
    });
  }, []);

  const unsubscribe = useCallback((listener: IEventsListener) => {
    setListeners(prev =>
      prev.filter(l => l.id !== listener.id && l.eventName !== listener.eventName),
    );
  }, []);

  const run = useCallback(
    (eventName: TElementEvent, element: IFormEventElement<string, any>) => {
      listeners.forEach(listener => {
        if (listener.eventName === eventName && listener.id === element.id) {
          listener.callback(eventName, element);
        }
      });
    },
    [listeners],
  );

  const event = useCallback(
    (eventName: TElementEvent, element: IFormEventElement<string, any>) => {
      run(eventName, element);
      onEvent?.(eventName, element);
    },
    [run, onEvent],
  );

  return {
    listeners,
    subscribe,
    unsubscribe,
    run,
    event,
  };
};
