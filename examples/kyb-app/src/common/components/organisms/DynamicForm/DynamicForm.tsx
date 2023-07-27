import { RJSFSchema, UiSchema } from '@rjsf/utils';
import Form, { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from '@app/common/components/organisms/DynamicForm/fields';
import { templates } from '@app/common/components/organisms/DynamicForm/templates';
import { useCallback, useMemo } from 'react';
import { Provider, WarningsContext } from './warnings.context';

type InputName = string;
export type InputWarning = string | string[];

export interface InputsWarnings {
  [k: InputName]: InputWarning | InputsWarnings;
}

interface Props<TFormData> {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  className?: string;
  formData?: object;
  warnings?: InputsWarnings;
  onChange?: (formData: TFormData) => void;
  onSubmit: (formData: TFormData) => void;
}

export function DynamicForm<TFormData extends object>({
  schema,
  uiSchema,
  className,
  formData,
  warnings,
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

  const warningsContext = useMemo(() => {
    const ctx: WarningsContext = {
      warnings,
    };

    return ctx;
  }, [warnings]);

  return (
    <Provider value={warningsContext}>
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
    </Provider>
  );
}
