import { tw } from '@/theme';
import { BaseComponentProps } from '@/types/base-component-props';
import { mergeStyles } from '@/utils/merge-styles';
import { Link as LinkPDF } from '@react-pdf/renderer';

export interface LinkProps extends BaseComponentProps {
  href: string;
  url?: string;
}

export const Link = ({ href, url, styles = [] }: LinkProps) => {
  return (
    <LinkPDF
      style={mergeStyles([tw('text-[8px] text-[#14203D] flex flex-row items-center'), ...styles])}
      src={href}
    >
      {url ?? href}
    </LinkPDF>
  );
};
