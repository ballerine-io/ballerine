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
      warning: 'bg-[#FFB35A33] text-[#FFB35A]',
      success: 'bg-[#00BD5933] text-[#00BD59]',
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
      <Text style={tw('font-semibold text-sm leading-5')}>{text}</Text>
    </View>
  );
};
