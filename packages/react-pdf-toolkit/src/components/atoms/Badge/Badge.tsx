import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { Text, View } from '@react-pdf/renderer';
import { cva } from 'class-variance-authority';
import { BadgeProps } from './types';

export const badgeCva = cva('badge', {
  variants: {
    variant: {
      primary: 'bg-[#007AFF33] text-[#007AFF]',
      error: 'bg-[#DF222233] text-[#DF2222]',
      warning: 'bg-[#FF971E33] text-[#FF971E]',
      success: 'bg-[#34A85333] text-[#34A853]',
      moderate: 'bg-[#FFC93133] text-[#FFC931]',
    },
    rounded: {
      primary: 'rounded-[6px]',
      secondary: 'rounded-[18px] px-3 py-1',
    },
  },
  defaultVariants: {
    variant: 'primary',
    rounded: 'primary',
  },
});

export const Badge = ({ text, variant, rounded, styles = [] }: BadgeProps) => {
  return (
    <View
      style={mergeStyles([
        tw('flex self-start p-2 border-box'),
        tw(badgeCva({ variant, rounded })),
        ...styles,
      ])}
    >
      <Text style={tw('font-bold text-xs leading-5')}>{text}</Text>
    </View>
  );
};
