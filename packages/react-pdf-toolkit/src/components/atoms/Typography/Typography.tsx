import { TypographyProps } from '@/components/atoms/Typography/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { Text } from '@react-pdf/renderer';
import { cva } from 'class-variance-authority';
import { FunctionComponent } from 'react';

export const typographyCva = cva(['font-inter', 'leading-0'], {
  variants: {
    size: {
      small: 'text-[6px]',
      regular: 'text-[8px]',
      medium: 'text-[11px]',
      large: 'text-[14px]',
      heading: 'text-[14px]',
      title: 'text-[24px]',
    },
    weight: {
      bold: 'font-bold',
      normal: 'font-normal',
    },
    color: {
      regular: 'text-[#000000]',
      primary: 'text-[#007AFF]',
      error: 'text-[#DF2222]',
      warning: 'text-[#FF971E]',
      success: 'text-[#34A853]',
      moderate: 'text-[#FFC931]',
      silent: 'text-[#808080]',
    },
    decoration: {
      underline: 'underline',
    },
  },
  defaultVariants: {
    size: 'regular',
    weight: 'normal',
    color: 'regular',
  },
});

export const Typography: FunctionComponent<TypographyProps> = ({
  children,
  size,
  weight,
  color,
  decoration,
  styles = [],
}) => {
  return (
    <Text style={mergeStyles([tw(typographyCva({ size, weight, color, decoration })), ...styles])}>
      {children}
    </Text>
  );
};
