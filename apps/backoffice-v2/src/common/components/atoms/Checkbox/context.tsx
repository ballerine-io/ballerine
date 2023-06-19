import { createContext, useCallback, useEffect, useState } from 'react';
import { TCheckboxGroupState } from './types';
import { FunctionComponentWithChildren } from '../../../types';

export interface IProviderProps {
  values: Array<unknown>;
  onChange: (value: unknown) => void;
}

/**
 * When context is undefined we know that we are outside the provider.
 */
export const Context = createContext<TCheckboxGroupState>(undefined);

/**
 * @description Shares state and actions between ImageViewer's children.
 *
 * @param values
 * @param onChange
 * @param children
 * @constructor
 */
export const Provider: FunctionComponentWithChildren<IProviderProps> = ({
  values,
  onChange,
  children,
}) => {
  const [checked, setChecked] = useState(values ?? []);
  const handleChange = useCallback(
    (value: unknown) => {
      const isChecked = checked.some(item => item === value);
      const nextState = isChecked ? checked.filter(item => item !== value) : [...checked, value];

      setChecked(nextState);
      onChange(nextState);
    },
    [checked, onChange],
  );
  const value: TCheckboxGroupState = {
    values: checked,
    onChange: handleChange,
  };

  useEffect(() => {
    if (!values) return;

    setChecked(values);
  }, [values]);

  return <Context.Provider value={value}>{children}</Context.Provider>;
};
