import { tw } from '@/lib/pdf-toolkit/theme';
import { BaseComponentProps } from '@/lib/pdf-toolkit/types/base-component-props';
import { mergeStyles } from '@/lib/pdf-toolkit/utils/merge-styles';
import { Link as LinkPDF } from '@react-pdf/renderer';

export interface LinkProps extends BaseComponentProps {
  href: string;
}

export const Link = ({ href, styles = [] }: LinkProps) => {
  return (
    <LinkPDF
      style={mergeStyles([tw('text-xs text-[#14203D] flex flex-row items-center'), ...styles])}
      src={href}
    >
      {href}
    </LinkPDF>
  );
};
