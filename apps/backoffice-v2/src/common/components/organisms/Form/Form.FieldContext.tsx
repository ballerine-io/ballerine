import * as React from 'react';
import { FormFieldContextValue } from './types';

export const FormFieldContext = React.createContext<FormFieldContextValue>(
  {} as FormFieldContextValue,
);
