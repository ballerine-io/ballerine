import { typographyCva } from '@/components/atoms/Typography/Typography';
import { BaseComponentProps } from '@/types/base-component-props';
import { AnyChildren } from '@ballerine/ui';
import { VariantProps } from 'class-variance-authority';

export interface TypographyProps extends BaseComponentProps, VariantProps<typeof typographyCva> {
  children: AnyChildren;
}
