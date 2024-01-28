import { ballerineLogoCva } from '@/components/atoms/BallerineLogo/BallerineLogo';
import { BaseComponentProps } from '@/types/base-component-props';
import { VariantProps } from 'class-variance-authority';

export interface BallerineLogoProps
  extends BaseComponentProps,
    VariantProps<typeof ballerineLogoCva> {}
