import { IEventsListener } from '@ballerine/ui';
import {
  IFormEventElement,
  TElementEvent,
} from '@ballerine/ui/dist/components/organisms/Form/DynamicForm/hooks/internal/useEvents/types';
import { useId, useMemo } from 'react';

export const useListener = (
  callback: (eventName: TElementEvent, eventElement: IFormEventElement<any, any>) => void,
): IEventsListener => {
  const id = useId();

  const listener: IEventsListener = useMemo(() => {
    return {
      id,
      eventName: 'onChange',
      callback,
    };
  }, [id, callback]);

  return listener;
};
