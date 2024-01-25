import { TWorkflowById } from '@/domains/workflows/fetchers';
import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';

export interface IProcessTrackerProps {
  tags: TWorkflowById['tags'];
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  context: TWorkflowById['context'];
  childWorkflows: TWorkflowById['childWorkflows'];
}
