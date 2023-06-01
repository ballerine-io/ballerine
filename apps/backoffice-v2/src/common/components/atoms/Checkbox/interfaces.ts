import { ComponentProps } from 'react';
import { Item } from './Checkbox.Item';
import { Group } from './Checkbox.Group';
import { CheckboxProps } from '@radix-ui/react-checkbox';

export interface ICheckboxChildren {
  Group: typeof Group;
  Item: typeof Item;
}

export interface IGroupProps {
  vertical?: boolean;
  label: string;
  onChange: (values: Array<unknown>) => void;
  values?: Array<unknown>;
  titleProps?: ComponentProps<'h4'>;
  innerContainerProps?: ComponentProps<'div'>;
}

export interface ICheckboxProps
  extends Pick<CheckboxProps, 'checked' | 'value'>,
    Omit<ComponentProps<'label'>, 'onChange'> {
  onChange: (value: unknown) => void;
  checkboxProps?: Omit<CheckboxProps, 'onChange' | 'checked'>;
}
