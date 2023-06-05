import * as RadixCheckbox from '@radix-ui/react-checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { FunctionComponent, useCallback } from 'react';
import { Group } from './Checkbox.Group';
import { Item } from './Checkbox.Item';
import { ICheckboxChildren, ICheckboxProps } from './interfaces';
import { CheckSvg } from '../icons';
import { ctw } from '../../../utils/ctw/ctw';

export const Checkbox: FunctionComponent<ICheckboxProps> & ICheckboxChildren = ({
  children,
  checked,
  value,
  onChange,
  className,
  checkboxProps = {},
  ...props
}) => {
  const { className: checkboxClassName, ...checkboxRest } = checkboxProps;
  const onCheckedChange = useCallback(
    (checked: CheckedState) => {
      onChange(value);
    },
    [onChange, value],
  );

  return (
    <label className={ctw(`flex items-center gap-x-2 text-base-content`, className)} {...props}>
      <RadixCheckbox.Root
        className={ctw(
          `grid place-content-center rounded-md border border-neutral/10 bg-base-100 p-2 theme-dark:border-neutral/60`,
          checkboxClassName,
        )}
        checked={checked}
        onCheckedChange={onCheckedChange}
        {...checkboxRest}
      >
        <RadixCheckbox.Indicator>
          <CheckSvg className={`d-4`} />
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {children}
    </label>
  );
};

Checkbox.Group = Group;
Checkbox.Item = Item;
