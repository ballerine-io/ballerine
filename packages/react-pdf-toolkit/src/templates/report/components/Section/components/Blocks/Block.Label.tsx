import { tw } from '@/theme';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface LabelProps extends BaseComponentProps {
  text: string;
}

export const Label = ({ text, styles = [] }: LabelProps) => {
  return (
    <Text style={mergeStyles([tw('text-sm font-inter font-semibold'), ...styles])}>{text}</Text>
  );
};
