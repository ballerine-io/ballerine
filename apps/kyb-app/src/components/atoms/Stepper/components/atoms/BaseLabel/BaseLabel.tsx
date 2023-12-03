import { ctw } from '@ballerine/ui';
import { BaseLabelProps } from './types';
import { cva, VariantProps } from 'class-variance-authority';

type BaseLabelVariantProps = VariantProps<typeof baseLabelVariants>;

const baseLabelVariants = cva('text-base font-inter color-[#001B39]', {
  variants: {
    variant: {
      idle: 'font-normal',
      warning: 'font-normal',
      current: 'font-bold',
      completed: 'font-normal opacity-50',
    },
  },
});

type Props = BaseLabelProps & BaseLabelVariantProps;

export const BaseLabel = ({ text, variant, className }: Props) => {
  return (
    <span className={ctw(baseLabelVariants({ variant }), 'text-sm leading-4', className)}>
      {text}
    </span>
  );
};
