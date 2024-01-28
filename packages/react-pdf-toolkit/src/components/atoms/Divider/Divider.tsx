import { DividerProps } from '@/components/atoms/Divider/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Divider: FunctionComponent<DividerProps> = ({ styles = [] }) => (
  <View style={mergeStyles([tw('w-full h-[1px] bg-[#E5E7EB]'), ...styles])} />
);
