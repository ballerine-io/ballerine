import { useContext } from 'react';
import { TrackerContext } from '../../TrackerContext';

export const useTracker = () => {
  const context = useContext(TrackerContext);

  if (!context) {
    throw new Error('useTracker must be used within a Tracker');
  }

  return context;
};
