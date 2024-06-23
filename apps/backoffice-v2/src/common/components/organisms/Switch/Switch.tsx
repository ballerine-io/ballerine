import { FunctionComponentWithChildren } from '@/common/types';
import React from 'react';
import { SwitchCase } from '@/common/components/organisms/Switch/Switch.Case';
import { SwitchDefault } from '@/common/components/organisms/Switch/Switch.Default';

export const Switch: FunctionComponentWithChildren<{
  condition: unknown;
}> & {
  Case: typeof SwitchCase;
  Default: typeof SwitchDefault;
} = ({ condition, children }) => {
  const childrenArray = React.Children.toArray(children);
  const cases = childrenArray.filter(
    child =>
      (
        child as {
          props: {
            when: unknown;
          };
        }
      ).props.when === condition,
  );
  const defaultCases = childrenArray.filter(
    child =>
      (
        child as unknown as {
          displayName: string;
        }
      ).displayName === 'Switch.Default',
  );
  const defaultCase = defaultCases[0];

  if (defaultCases.length > 1) {
    throw new Error('Only one Switch.Default is allowed');
  }

  if (!cases.length) {
    return <>{defaultCase}</>;
  }

  return <>{cases[0]}</>;
};

Switch.displayName = 'Switch';
