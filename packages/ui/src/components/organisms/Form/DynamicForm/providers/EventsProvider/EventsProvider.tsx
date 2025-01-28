import { FunctionComponent } from 'react';
import { IFormEventElement, TElementEvent } from '../../hooks/internal/useEvents/types';
import { EventsProvierContext } from './context';
import { useEventsPool } from './hooks/internal/useEventsPool';

export interface IEventsProviderProps {
  children: React.ReactNode;
  onEvent?: (eventName: TElementEvent, element: IFormEventElement<string, any>) => void;
}

export const EventsProvider: FunctionComponent<IEventsProviderProps> = ({ children, onEvent }) => {
  const context = useEventsPool(onEvent);

  return <EventsProvierContext.Provider value={context}>{children}</EventsProvierContext.Provider>;
};
