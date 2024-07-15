export interface IWorkflowDefinition {
  id: string;
  name: string;
  displayName: string | null;
  projectId: string;
  variant: string;
  definitionType: string;
  config: object;
  contextSchema: object;
  definition: object;
  extensions: object;
  createdAt: string;
}

export interface GetWorkflowDefinitionsListDto {
  page: number;
  limit: number;
}
