import { useContext } from 'react';
import { EventsProvierContext } from '../../../context';

export const useEventsProvider = () => useContext(EventsProvierContext);
