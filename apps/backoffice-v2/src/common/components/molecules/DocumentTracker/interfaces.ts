import { TWorkflowDefinitionById } from '@/domains/workflow-definitions/fetchers';
import { TWorkflowById } from '@/domains/workflows/fetchers';

export interface IDocumentTrackerProps {
  workflow: TWorkflowById;
  plugins: Array<
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['apiPlugins']>[number]
    | NonNullable<
        NonNullable<TWorkflowDefinitionById['extensions']>['childWorkflowPlugins']
      >[number]
    | NonNullable<NonNullable<TWorkflowDefinitionById['extensions']>['commonPlugins']>[number]
  >;
  documentTypes: string[];
}
