import Form, { IChangeEvent } from '@rjsf/core';
import {
  RegistryFieldsType,
  RJSFSchema,
  RJSFValidationError,
  TemplatesType,
  UiSchema,
} from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { forwardRef, useCallback, useMemo } from 'react';
import { fields as baseFields, fields } from './fields';
import { layouts as baseLayouts } from './layouts';
import { Provider, WarningsContext } from './warnings.context';

type InputName = string;
export type InputWarning = string | string[];

export interface InputsWarnings {
  [k: InputName]: InputWarning | InputsWarnings;
}

export interface DynamicFormProps<TFormData> {
  schema: RJSFSchema;
  uiSchema?: UiSchema;
  className?: string;
  formData?: object;
  warnings?: InputsWarnings;
  disabled?: boolean;
  fields?: typeof fields;
  layouts?: Partial<TemplatesType>;
  liveValidate?: boolean;
  testId?: string;
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
      testId,
      transformErrors,
      onChange,
      onSubmit,
    }: DynamicFormProps<TFormData>,
    ref: any,
  ) => {
    const handleChange = useCallback(
      (form: IChangeEvent<TFormData>) => {
        // @ts-ignore
        onChange && onChange(form.formData);
      },
      [onChange],
    );

    const handleSubmit = useCallback(
      (form: IChangeEvent<TFormData>) => {
        // @ts-ignore
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
          // @ts-ignore
          transformErrors={transformErrors}
          //@ts-ignore
          ref={innerRef => {
            if (testId) {
              innerRef?.formElement?.current?.setAttribute('data-testid', testId);
            }

            if (ref) {
              ref.current = innerRef;
            }
          }}
        />
      </Provider>
    );
  },
);

DynamicForm.displayName = 'DynamicForm';
