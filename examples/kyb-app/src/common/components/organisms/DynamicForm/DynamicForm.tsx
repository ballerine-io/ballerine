import { RJSFSchema, UiSchema, WidgetProps } from '@rjsf/utils';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from '@app/common/components/organisms/DynamicForm/fields';
import { templates } from '@app/common/components/organisms/DynamicForm/templates';

const MyCustomWidget = (props: WidgetProps) => {
  return <div>hello world</div>;
};

interface Props {
  schema: RJSFSchema;
  uischema?: UiSchema;
}

export const DynamicForm = (props: Props) => {
  console.log('props', props);
  return (
    <Form
      schema={props.schema}
      uiSchema={props.uischema}
      onError={errors => console.log({ errors })}
      validator={validator}
      fields={fields}
      templates={templates}
      showErrorList={false}
    />
  );
};
