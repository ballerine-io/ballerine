import { ctw } from '@utils/ctw';
import { VariantProps, cva } from 'class-variance-authority';

const labelVariants = cva('', {
  variants: {
    variant: {
      primary: 'text-primary',
      secondary: 'text-secondary',
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export type LabelVariantProps = VariantProps<typeof labelVariants>;

export interface LabelProps extends LabelVariantProps {
  text: string;
  className?: string;
}

export const Label = ({ text, className, variant }: LabelProps) => {
  return <span className={ctw(labelVariants({ variant }), className)}>{text}</span>;
};
