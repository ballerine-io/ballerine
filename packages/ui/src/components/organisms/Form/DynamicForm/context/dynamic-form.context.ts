import { createContext } from 'react';
import { IDynamicFormContext } from './types';

export const DynamicFormContext = createContext({} as IDynamicFormContext<object>);
