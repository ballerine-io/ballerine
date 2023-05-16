import { ComponentProps, ReactNode } from 'react';
import { FieldValues, SubmitHandler, useForm, UseFormReturn } from 'react-hook-form';

export interface IFormProps<TFieldValues extends FieldValues = FieldValues, TContext = any>
  extends Omit<ComponentProps<'form'>, 'onSubmit' | 'children'> {
  options?: Parameters<typeof useForm<TFieldValues, TContext>>[0];
  onSubmit: SubmitHandler<TFieldValues>;
  children(methods: UseFormReturn<TFieldValues, TContext>): ReactNode;
}
