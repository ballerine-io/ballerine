import { RJSFSchema, RJSFValidationError, UiSchema } from '@rjsf/utils';
import Form, { FormProps, IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields } from './fields';
import { templates } from './templates';
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
  disabled?: boolean;
  transformErrors?: (errors: RJSFValidationError[], uiSchema: UiSchema) => RJSFValidationError[];
  onChange?: (formData: TFormData) => void;
  onSubmit: (formData: TFormData) => void;
  overrideFormProps?: (baseProps: FormProps) => FormProps;
}

export function DynamicForm<TFormData extends object>({
  schema,
  uiSchema,
  className,
  formData,
  warnings,
  disabled,
  overrideFormProps,
  transformErrors,
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

  const baseFormProps = useMemo(() => {
    const props = {
      className,
      schema,
      formData,
      uiSchema,
      onSubmit: handleSubmit,
      onChange: handleChange,
      validator,
      fields,
      templates,
      showErrorList: false,
      disabled,
      transformErrors,
    } as FormProps;

    return overrideFormProps ? overrideFormProps(props) : props;
  }, [
    className,
    schema,
    formData,
    uiSchema,
    disabled,
    transformErrors,
    overrideFormProps,
    handleSubmit,
    handleChange,
  ]);

  return (
    <Provider value={warningsContext}>
      <Form {...baseFormProps} />
    </Provider>
  );
}
