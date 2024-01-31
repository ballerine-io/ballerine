import { BaseComponentProps } from '@/types/base-component-props';
import { AnyChildren } from '@ballerine/ui';

export interface ListProps extends BaseComponentProps {
  children: AnyChildren;
}

export interface ListItemProps extends BaseComponentProps {
  children: AnyChildren;
  prependIcon?: AnyChildren;
}
