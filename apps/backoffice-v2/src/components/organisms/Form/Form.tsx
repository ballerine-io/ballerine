import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import React from 'react';
import { IFormProps } from 'components/organisms/Form/interfaces';

export const Form = <TFieldValues extends FieldValues = FieldValues, TContext = any>({
  options,
  onSubmit,
  children,
  ...rest
}: IFormProps<TFieldValues, TContext>) => {
  const methods = useForm(options);

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit, err => alert(err))} {...rest}>
        {children(methods)}
      </form>
    </FormProvider>
  );
};
