import { badgeCva } from '@/lib/pdf-toolkit/components/Badge/Badge';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { VariantProps } from 'class-variance-authority';

export interface BadgeProps extends BaseComponentProps, VariantProps<typeof badgeCva> {
  text: string;
}
