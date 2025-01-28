import { useEventsProvider } from '../../internal/useEventsProvider';

export const useEventsDispatcher = () => {
  const { event } = useEventsProvider();

  return event;
};
