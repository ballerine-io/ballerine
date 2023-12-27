import { View, Text } from '@react-pdf/renderer';
import { BadgeProps } from './types';
import { cva } from 'class-variance-authority';
import { tw } from '@/lib/pdf-toolkit/theme';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';

export const badgeCva = cva('badge', {
  variants: {
    variant: {
      primary: 'bg-[#007AFF33] text-[#007AFF]',
      error: 'bg-[#DF222233] text-[#DF2222]',
      warning: 'bg-[#FFB35A33] text-[#FFB35A]',
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
