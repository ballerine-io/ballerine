import { badgeCva } from '@/components/Badge/Badge';
import { BaseComponentProps } from '@/types/base-component-props';
import { VariantProps } from 'class-variance-authority';

export interface BadgeProps extends BaseComponentProps, VariantProps<typeof badgeCva> {
  text: string;
}
