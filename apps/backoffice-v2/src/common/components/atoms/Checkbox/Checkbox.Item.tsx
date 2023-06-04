import { Checkbox } from './Checkbox';
import { FunctionComponent } from 'react';
import { useCheckboxGroupContext } from './hooks/useCheckboxGroupContext/useCheckboxGroupContext';
import { ICheckboxProps } from './interfaces';

export const Item: FunctionComponent<
  Omit<ICheckboxProps, 'isChecked' | 'onChange'> & {
    value: unknown;
  }
> = ({ children, value, ...props }) => {
  const { values, onChange } = useCheckboxGroupContext();
  const isChecked = values?.some(item => item === value);

  return (
    <Checkbox checked={isChecked} onChange={onChange} value={value} {...props}>
      {children}
    </Checkbox>
  );
};
