import { FunctionComponentWithChildren } from '@/common/types';
import React from 'react';

export const SwitchDefault: FunctionComponentWithChildren = ({ children }) => {
  return <>{children}</>;
};

SwitchDefault.displayName = 'Switch.Default';
