export interface IUISchema {
  elements: {
    number: string;
    stateName: string;
  }[];
}

export interface IUIDefinition {
  id: string;
  workflowDefinitionId: string;
  uiContext: string;
  definition: object;
  uiSchema: IUISchema;
  locales?: object;
  createdAt: string;
}

export interface UpdateUIDefinitionDto {
  workflowDefinitionId: string;
  uiDefinitionId: string;
  uiDefinition: IUIDefinition;
}

export interface GetUIDefinitionByIdDto {
  uiDefinitionId: string;
}
