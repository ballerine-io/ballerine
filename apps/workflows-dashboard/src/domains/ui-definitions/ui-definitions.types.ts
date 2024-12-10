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
  name: string;
  theme?: object;
}

export interface UpdateUIDefinitionDto {
  workflowDefinitionId: string;
  uiDefinitionId: string;
  uiDefinition: IUIDefinition;
}

export interface CopyUIDefinitionDto {
  uiDefinitionId: string;
  name: string;
}
export interface GetUIDefinitionByIdDto {
  uiDefinitionId: string;
}
