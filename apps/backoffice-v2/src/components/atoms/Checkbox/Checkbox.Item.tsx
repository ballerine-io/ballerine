import { Checkbox } from './Checkbox';
import { FunctionComponent } from 'react';
import { useCheckboxGroupContext } from './hooks/useCheckboxGroupContext/useCheckboxGroupContext';
import { ICheckboxProps } from '@/components/atoms/Checkbox/interfaces';

export const Item: FunctionComponent<
  Omit<ICheckboxProps, 'isChecked' | 'onChange'> & {
    value: unknown;
  }
> = ({ children, value, ...props }) => {
  const { values, onChange } = useCheckboxGroupContext();

  return (
    <Checkbox
      checked={values?.some(item => item === value)}
      onChange={onChange}
      value={value}
      {...props}
    >
      {children}
    </Checkbox>
  );
};
