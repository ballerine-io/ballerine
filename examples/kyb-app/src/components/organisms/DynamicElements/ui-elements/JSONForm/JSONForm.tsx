import { UIElementComponent } from '@app/components/organisms/DynamicElements/types';
import { createFormSchemaFromUIElements } from '@app/components/organisms/DynamicElements/ui-elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMemo } from 'react';

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
}

export interface JSONFormElementParams {
  required?: string[];
}

export const JSONForm: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );

  return <DynamicForm schema={formSchema} uiSchema={uiSchema} onSubmit={() => {}} />;
};
