import { tw } from '@/theme';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface TitleProps extends BaseComponentProps {
  text: string;
}

export const Title = ({ text, styles = [] }: TitleProps) => {
  return <Text style={mergeStyles([tw('text-xs font-bold'), ...styles])}>{text}</Text>;
};
