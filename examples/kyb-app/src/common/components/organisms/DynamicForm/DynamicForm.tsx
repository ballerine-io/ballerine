import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form, { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from '@app/common/components/organisms/DynamicForm/fields';
import { templates } from '@app/common/components/organisms/DynamicForm/templates';
import { useCallback } from 'react';

interface Props<TFormData> {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  className?: string;
  formData?: object;
  onChange?: (formData: TFormData) => void;
  onSubmit: (formData: TFormData) => void;
}

export function DynamicForm<TFormData extends object>({
  schema,
  uiSchema,
  className,
  formData,
  onChange,
  onSubmit,
}: Props<TFormData>) {
  const handleChange = useCallback(
    (form: IChangeEvent<TFormData>) => {
      onChange && onChange(form.formData);
    },
    [onChange],
  );

  const handleSubmit = useCallback(
    (form: IChangeEvent<TFormData>) => {
      onSubmit && onSubmit(form.formData);
    },
    [onSubmit],
  );

  return (
    <Form
      className={className}
      schema={schema}
      formData={formData}
      uiSchema={uiSchema}
      onSubmit={handleSubmit}
      onChange={handleChange}
      validator={validator}
      fields={fields}
      autoComplete="on"
      templates={templates}
      showErrorList={false}
    />
  );
}
