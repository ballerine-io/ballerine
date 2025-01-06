import { IFormEventElement, TElementEvent } from '../../hooks/internal/useEvents/types';

export interface IEventsListener {
  id: string;
  eventName: TElementEvent;
  callback: (eventName: TElementEvent, element: IFormEventElement<string, any>) => void;
}

export interface IEventsProviderContext {
  subscribe: (listener: IEventsListener) => void;
  unsubscribe: (listener: IEventsListener) => void;
  run: (eventName: TElementEvent, element: IFormEventElement<string, any>) => void;
  event: (eventName: TElementEvent, element: IFormEventElement<string, any>) => void;
  listeners: IEventsListener[];
}
