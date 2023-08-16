import { AnyObject } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';

export interface GetCollectionFlowSchemaDto {
  workflowDefinitionId: string;
}

export interface CollectionFlowSchema {
  title: string;
  description: string;
  formSchema: RJSFSchema;
  uiSchema: UiSchema;
  defaultData: AnyObject;
  key: string;
}
