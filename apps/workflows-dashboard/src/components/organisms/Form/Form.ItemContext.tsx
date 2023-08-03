import * as React from 'react';
import { FormItemContextValue } from './types';

export const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);
