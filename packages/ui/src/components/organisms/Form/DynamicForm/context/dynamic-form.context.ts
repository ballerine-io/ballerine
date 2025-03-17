import { createContext } from 'react';
import { IDynamicFormContext } from './types';

export const DynamicFormContext = createContext<IDynamicFormContext<any>>(
  {} as IDynamicFormContext<any>,
);
