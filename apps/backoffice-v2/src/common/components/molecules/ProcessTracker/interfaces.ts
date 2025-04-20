import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TTrackerComponentProps } from './components/Tracker/interfaces';

export interface IProcessTrackerProps {
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

export interface IProcessTracker {
  name: string;
  Component: React.ComponentType<TTrackerComponentProps>;
}
