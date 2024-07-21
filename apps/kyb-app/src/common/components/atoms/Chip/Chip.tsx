import { ctw } from '@ballerine/ui';
import { cva, VariantProps } from 'class-variance-authority';

export type BaseChipVariantProps = VariantProps<typeof baseChipVariants>;

const baseChipVariants = cva('flex transition-all gap-2 px-4 py-2 rounded-2xl items-center', {
  variants: {
    variant: {
      default: 'bg-slate-200',
      primary: 'bg-[#007AFF33] text-[#007AFF]',
      success: 'bg-[#5FD44C33] text-[#00BD59]',
    },
  },
});

interface ComponentProps {
  className?: string;
  icon?: React.ReactNode;
  text: string;
}

type Props = BaseChipVariantProps & ComponentProps;

export const Chip = ({ variant = 'default', icon, text, className }: Props) => {
  return (
    <div className={ctw(baseChipVariants({ variant }), className)}>
      <div>{icon}</div>
      <span className="text-xs font-bold">{text}</span>
    </div>
  );
};
