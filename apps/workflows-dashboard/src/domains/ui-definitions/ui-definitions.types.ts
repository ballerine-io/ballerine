import { IWorkflowDefinition } from '@/domains/workflow-definitions';

export interface IUIDefinition {
  id: string;
  workflowDefinitionId: string;
  uiContext: string;
  definition: object;
  uiSchema: object;
  locales?: object;
  createdAt: string;
  workflowDefinition: IWorkflowDefinition;
}
