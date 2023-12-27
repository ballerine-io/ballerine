import { tw } from '@/lib/pdf-toolkit/theme';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface DescriptionProps extends BaseComponentProps {
  text: string;
}

export const Description = ({ text, styles = [] }: DescriptionProps) => {
  return <Text style={mergeStyles([tw('font-inter text-sm leading-6'), ...styles])}>{text}</Text>;
};
