import { Controller, ControllerProps, FieldPath, FieldValues } from 'react-hook-form';
import { FormFieldContext } from './Form.FieldContext';
import * as React from 'react';

export const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};
