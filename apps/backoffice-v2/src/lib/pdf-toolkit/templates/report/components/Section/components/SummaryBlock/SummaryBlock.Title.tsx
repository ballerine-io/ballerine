import { tw } from '@/lib/pdf-toolkit/theme';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';
import { Text } from '@react-pdf/renderer';

export interface TitleProps extends BaseComponentProps {
  text: string;
}

export const Title = ({ text, styles = [] }: TitleProps) => {
  return (
    <Text style={mergeStyles([tw('font-inter font-bold text-sm leading-none'), ...styles])}>
      {text}
    </Text>
  );
};
