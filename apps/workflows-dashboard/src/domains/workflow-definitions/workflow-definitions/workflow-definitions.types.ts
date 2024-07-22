import { IUIDefinition } from '@/domains/ui-definitions';

export interface IWorkflowDefinition {
  id: string;
  name: string;
  displayName: string | null;
  projectId: string;
  variant: string;
  version: number;
  definitionType: string;
  config: object;
  contextSchema: object;
  definition: object;
  extensions: object;
  isPublic: boolean;
  createdAt: string;
  uiDefinitions: IUIDefinition[];
}

export interface GetWorkflowDefinitionsListDto {
  page: number;
  limit: number;
}

export interface GetWorkflowDefinitionDto {
  workflowDefinitionId: string;
}

export interface GetUIDefinitionQuery {
  workflowDefinitionId: string;
}

export interface UpdateWorkflowDefinitionByIdDto {
  workflowDefinitionId: string;
  definition: IWorkflowDefinition['definition'];
}

export interface UpdateWorkflowDefinitionExtensionsByIdDto {
  workflowDefinitionId: string;
  extensions: IWorkflowDefinition['extensions'];
}

export interface UpgradeWorkflowDefinitionVersionByIdDto {
  workflowDefinitionId: string;
}
