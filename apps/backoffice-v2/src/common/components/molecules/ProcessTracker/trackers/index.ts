import { CollectionFlowTracker } from './collection-flow';

export const TRACKERS = [CollectionFlowTracker] as const;

export type TTracker = (typeof TRACKERS)[number];
