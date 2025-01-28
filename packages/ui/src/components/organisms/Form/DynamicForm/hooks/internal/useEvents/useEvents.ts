import { formatId } from '@/components/organisms/Form/Validator/utils/format-id';
import { formatValueDestination } from '@/components/organisms/Form/Validator/utils/format-value-destination';
import debounce from 'lodash/debounce';
import { useCallback } from 'react';
import { useStack } from '../../../fields/FieldList/providers/StackProvider';
import { useEventsDispatcher } from '../../../providers/EventsProvider';
import { IFormElement } from '../../../types';
import { IFormEventElement, TElementEvent } from './types';

export interface IUseEventParams {
  asyncEventDelay?: number;
}

export const useEvents = (
  element: IFormElement<any, any>,
  params: IUseEventParams = { asyncEventDelay: 500 },
) => {
  const onEvent = useEventsDispatcher();
  const { stack } = useStack();
  const { asyncEventDelay } = params;

  const sendEvent = useCallback(
    (eventName: TElementEvent) => {
      const eventElement: IFormEventElement<any, any> = {
        ...element,
        formattedValueDestination: formatValueDestination(element.valueDestination, stack || []),
        formattedId: formatId(element.id, stack || []),
      };

      console.debug(`Event ${eventName} triggered by ${eventElement.formattedId}`);
      onEvent?.(eventName, eventElement);
    },
    [onEvent, element, stack],
  );

  const sendEventAsync = useCallback(
    debounce((eventName: TElementEvent) => sendEvent(eventName), asyncEventDelay),
    [sendEvent, asyncEventDelay],
  );

  return {
    sendEvent,
    sendEventAsync,
  };
};
