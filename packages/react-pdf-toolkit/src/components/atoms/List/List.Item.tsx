import { ListItemProps } from '@/components/atoms/List/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  prependIcon,
  styles = [],
}) => (
  <View style={mergeStyles([tw('flex flex-row items-center gap-2'), ...styles])}>
    {prependIcon && <View>{prependIcon}</View>}
    <View>{children}</View>
  </View>
);
