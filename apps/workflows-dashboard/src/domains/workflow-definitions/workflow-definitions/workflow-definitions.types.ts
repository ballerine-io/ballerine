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
}

export interface GetWorkflowDefinitionsListDto {
  page: number;
  limit: number;
}

export interface GetWorkflowDefinitionDto {
  workflowDefinitionId: string;
}
