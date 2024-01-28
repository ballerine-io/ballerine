import { GridProps } from '@/components/layouts/Grid/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Grid: FunctionComponent<GridProps> = ({ children, styles = [] }) => (
  <View style={mergeStyles([tw('flex flex-col gap-4'), ...styles])}>{children}</View>
);
