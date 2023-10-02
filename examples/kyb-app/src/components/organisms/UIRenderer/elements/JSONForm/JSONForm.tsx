import { createFormSchemaFromUIElements } from '@app/components/organisms/UIRenderer/elements/JSONForm/helpers/createFormSchemaFromUIElements';
import { UIElementComponent } from '@app/components/organisms/UIRenderer/types';
import { DynamicForm } from '@ballerine/ui';
import { RJSFSchema, UiSchema } from '@rjsf/utils';
import { useMemo } from 'react';

export interface JSONFormElementBaseParams {
  jsonFormDefinition: RJSFSchema;
  uiSchema?: UiSchema;
  label?: string;
  hint?: string;
}

export interface JSONFormElementParams {
  jsonFormDefinition?: { required?: string[] };
}

export const JSONForm: UIElementComponent<JSONFormElementParams> = ({ definition, actions }) => {
  const { formSchema, uiSchema } = useMemo(
    () => createFormSchemaFromUIElements(definition),
    [definition],
  );

  return <DynamicForm schema={formSchema} uiSchema={uiSchema} onSubmit={() => {}} />;
};
