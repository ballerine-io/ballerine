import { BallerineLogoProps } from '@/components/atoms/BallerineLogo/types';
import { Image } from '@react-pdf/renderer';
import { cva } from 'class-variance-authority';
import { FunctionComponent } from 'react';
import ballerineLogo from '../../../assets/ballerine-logo-report.png';
import { mergeStyles } from '@/utils/merge-styles';
import { tw } from '@/theme';

export const ballerineLogoCva = cva('logo', {
  variants: {
    size: {
      normal: 'w-[140px] h-[31px]',
      small: 'w-[87px] h-[19px]',
    },
  },
  defaultVariants: {
    size: 'normal',
  },
});

export const BallerineLogo: FunctionComponent<BallerineLogoProps> = ({ size, styles = [] }) => (
  <Image src={ballerineLogo} style={mergeStyles([tw(ballerineLogoCva({ size })), ...styles])} />
);
