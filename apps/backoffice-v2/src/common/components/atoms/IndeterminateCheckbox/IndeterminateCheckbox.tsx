import { ComponentProps, FunctionComponent } from 'react';
import { Checkbox_ } from '@/common/components/atoms/Checkbox_/Checkbox_';
import { ctw } from '@/common/utils/ctw/ctw';

export interface IIndeterminateCheckboxProps extends ComponentProps<typeof Checkbox_> {
  indeterminate?: boolean;
}

export const IndeterminateCheckbox: FunctionComponent<IIndeterminateCheckboxProps> = ({
  checked,
  indeterminate,
  className,
  onCheckedChange,
  ...rest
}) => {
  return (
    <Checkbox_
      className={ctw(className)}
      checked={!checked && indeterminate ? 'indeterminate' : checked}
      onCheckedChange={onCheckedChange}
      {...rest}
    />
  );
};
