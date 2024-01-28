import { SectionProps } from '@/components/layouts/Section/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Section: FunctionComponent<SectionProps> = ({ children, styles = [] }) => (
  <View style={mergeStyles([tw('bg-white border border-[#E5E7EB] rounded-[6px] p-6'), ...styles])}>
    {children}
  </View>
);
