import { FunctionComponentWithChildren } from '@/common/types';
import React from 'react';

export const SwitchCase: FunctionComponentWithChildren<{
  when: unknown;
}> = ({ children }) => {
  return <>{children}</>;
};

SwitchCase.displayName = 'Switch.Case';
