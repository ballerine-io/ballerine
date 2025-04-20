import { createContext } from 'react';
import { ITrackerContext } from './interfaces';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export const TrackerContext = createContext<ITrackerContext>({
  workflow: {} as TWorkflowById,
  plugins: [],
  processes: [],
});
