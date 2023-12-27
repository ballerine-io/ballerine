import { tw } from '@/lib/pdf-toolkit/theme';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface LabelProps extends BaseComponentProps {
  text: string;
}

export const Label = ({ text, styles = [] }: LabelProps) => {
  return (
    <Text style={mergeStyles([tw('text-sm font-inter font-semibold'), ...styles])}>{text}</Text>
  );
};
