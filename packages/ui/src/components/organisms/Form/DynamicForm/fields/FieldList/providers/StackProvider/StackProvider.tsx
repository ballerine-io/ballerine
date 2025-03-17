import { FunctionComponent, useMemo } from 'react';
import { StackProviderContext } from './context/stack-provider-context';

export interface IStackProviderProps {
  stack?: number[];
  children: React.ReactNode | React.ReactNode[];
}

export const StackProvider: FunctionComponent<IStackProviderProps> = ({ stack, children }) => {
  const context = useMemo(() => ({ stack }), [stack]);

  return <StackProviderContext.Provider value={context}>{children}</StackProviderContext.Provider>;
};
