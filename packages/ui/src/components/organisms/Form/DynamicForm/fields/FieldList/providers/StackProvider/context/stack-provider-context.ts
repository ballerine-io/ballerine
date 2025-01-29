import { createContext } from 'react';
import { IStackProviderContext } from '../types';

export const StackProviderContext = createContext<IStackProviderContext>({
  stack: [],
});
