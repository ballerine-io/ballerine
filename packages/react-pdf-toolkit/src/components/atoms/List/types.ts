import { listItemCva } from '@/build';
import { BaseComponentProps } from '@/types/base-component-props';
import { AnyChildren } from '@ballerine/ui';
import { VariantProps } from 'class-variance-authority';

export interface ListProps extends BaseComponentProps {
  children: AnyChildren;
}

export interface ListItemProps extends BaseComponentProps, VariantProps<typeof listItemCva> {
  children: AnyChildren;
  prependIcon?: AnyChildren;
}
