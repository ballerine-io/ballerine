import { Block } from '@/lib/pdf-toolkit/templates/report/components/Section/components/Blocks/Blocks.Block';
import { tw } from '@/lib/pdf-toolkit/theme';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';
import { AnyChildren } from '@ballerine/ui';
import { View } from '@react-pdf/renderer';

export interface BlocksList extends BaseComponentProps {
  children: AnyChildren;
}

export const Blocks = ({ children, styles = [] }: BlocksList) => {
  return (
    <View style={mergeStyles([tw('flex flex-row justify-between'), ...styles])}>{children}</View>
  );
};

Blocks.Block = Block;
