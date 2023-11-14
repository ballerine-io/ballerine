import {
  RegistryFieldsType,
  RJSFSchema,
  RJSFValidationError,
  TemplatesType,
  UiSchema,
} from '@rjsf/utils';
import Form, { IChangeEvent } from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { fields as baseFields } from './fields';
import { layouts as baseLayouts } from './layouts';
import { forwardRef, useCallback, useMemo } from 'react';
import { Provider, WarningsContext } from './warnings.context';
import { RJSFInputAdapter } from '@/components/organisms/DynamicForm/components/RSJVInputAdaters';

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
  fields?: Record<keyof RegistryFieldsType, RJSFInputAdapter<any>>;
  layouts?: Partial<TemplatesType>;
  liveValidate?: boolean;
  transformErrors?: (errors: RJSFValidationError[], uiSchema: UiSchema) => RJSFValidationError[];
  onChange?: (formData: TFormData) => void;
  onSubmit: (formData: TFormData) => void;
}

export const DynamicForm = forwardRef(
  <TFormData extends Record<string, any>>(
    {
      schema,
      uiSchema,
      className,
      formData,
      warnings,
      disabled,
      fields = baseFields,
      liveValidate = false,
      layouts,
      transformErrors,
      onChange,
      onSubmit,
    }: Props<TFormData>,
    ref: any,
  ) => {
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

    const fieldsWithBaseFields = useMemo(() => ({ ...baseFields, ...fields }), [fields]);

    const layoutsWithBaseLayouts = useMemo(() => ({ ...baseLayouts, ...layouts }), []);

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
          fields={fieldsWithBaseFields as unknown as RegistryFieldsType}
          autoComplete="on"
          templates={layoutsWithBaseLayouts}
          showErrorList={false}
          disabled={disabled}
          liveValidate={liveValidate}
          transformErrors={transformErrors}
          //@ts-nocheck
          ref={ref}
        />
      </Provider>
    );
  },
);
