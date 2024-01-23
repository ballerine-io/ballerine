import { Block } from '@/templates/report/components/Section/components/Blocks/Blocks.Block';
import { tw } from '@/theme';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';
import { AnyChildren } from '@ballerine/ui';
import { View } from '@react-pdf/renderer';

export interface BlocksList extends BaseComponentProps {
  children: AnyChildren;
}

export const Blocks = ({ children, styles = [] }: BlocksList) => {
  return <View style={mergeStyles([tw('flex flex-row gap-12'), ...styles])}>{children}</View>;
};

Blocks.Block = Block;
