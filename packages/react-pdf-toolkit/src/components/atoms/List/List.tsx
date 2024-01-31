import { ListProps } from '@/components/atoms/List/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const List: FunctionComponent<ListProps> = ({ children, styles = [] }) => (
  <View style={mergeStyles([tw('flex flex-col gap-1'), ...styles])}>{children}</View>
);
