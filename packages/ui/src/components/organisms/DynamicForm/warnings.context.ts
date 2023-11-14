import { InputsWarnings } from '@/components/organisms/DynamicForm/DynamicForm';
import { createContext } from 'react';

export interface WarningsContext {
  warnings: InputsWarnings;
}

export const warningsContext = createContext({} as WarningsContext);

export const { Provider } = warningsContext;
