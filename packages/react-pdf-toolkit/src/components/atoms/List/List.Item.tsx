import { ListItemProps } from '@/components/atoms/List/types';
import { tw } from '@/theme';
import { mergeStyles } from '@/utils/merge-styles';
import { View } from '@react-pdf/renderer';
import { cva } from 'class-variance-authority';
import { FunctionComponent } from 'react';

export const listItemCva = cva('flex flex-row gap-[10px]', {
  variants: {
    iconPosition: {
      top: 'items-start',
      middle: 'items-center',
      bottom: 'items-end',
    },
  },
  defaultVariants: {
    iconPosition: 'top',
  },
});

export const ListItem: FunctionComponent<ListItemProps> = ({
  children,
  prependIcon,
  styles = [],
  iconPosition,
}) => (
  <View style={mergeStyles([tw(listItemCva({ iconPosition })), ...styles])}>
    {prependIcon && <View>{prependIcon}</View>}
    <View>{children}</View>
  </View>
);
