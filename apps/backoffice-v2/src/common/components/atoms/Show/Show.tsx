import { FunctionComponentWithChildren } from '@/common/types';
import React from 'react';

export const Show: FunctionComponentWithChildren<{
  when: boolean;
}> = ({ when, children }) => {
  if (!when) {
    return;
  }

  return <>{children}</>;
};
