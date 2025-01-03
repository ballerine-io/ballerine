import { IEventsListener } from '@ballerine/ui';
import {
  IFormEventElement,
  TElementEvent,
} from '@ballerine/ui/dist/components/organisms/Form/DynamicForm/hooks/internal/useEvents/types';
import { useMemo } from 'react';

export const useListener = (
  element: IFormEventElement<any, any>,
  callback: (eventName: TElementEvent, eventElement: IFormEventElement<any, any>) => void,
): IEventsListener => {
  const listener: IEventsListener = useMemo(() => {
    return {
      id: element.id,
      eventName: 'onChange',
      callback,
    };
  }, [element.id, callback]);

  return listener;
};
