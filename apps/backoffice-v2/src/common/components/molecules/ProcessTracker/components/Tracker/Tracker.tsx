import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { Item } from './Tracker.Item';
import { Title } from './Tracker.Title';
import { TrackerContext } from './TrackerContext';
import { useMemo } from 'react';

export interface ITrackerProps {
  children: React.ReactNode;
  workflow: TWorkflowById;
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  processes: string[];
}

export const Tracker = ({ children, workflow, plugins, processes }: ITrackerProps) => {
  const context = useMemo(() => ({ workflow, plugins, processes }), [workflow, plugins, processes]);

  return <TrackerContext.Provider value={context}>{children}</TrackerContext.Provider>;
};

Tracker.Title = Title;
Tracker.Item = Item;
