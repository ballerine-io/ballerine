import { tw } from '@/theme';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface DescriptionProps extends BaseComponentProps {
  text: string;
}

export const Description = ({ text, styles = [] }: DescriptionProps) => {
  return <Text style={mergeStyles([tw('font-inter text-xs leading-6'), ...styles])}>{text}</Text>;
};
