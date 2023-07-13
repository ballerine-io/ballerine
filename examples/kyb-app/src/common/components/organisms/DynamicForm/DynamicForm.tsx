import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from '@app/common/components/organisms/DynamicForm/fields';
import { templates } from '@app/common/components/organisms/DynamicForm/templates';

interface Props {
  schema: RJSFSchema;
  uischema?: UiSchema;
}

export const DynamicForm = (props: Props) => {
  return (
    <Form
      schema={props.schema}
      uiSchema={props.uischema}
      validator={validator}
      fields={fields}
      templates={templates}
    />
  );
};
