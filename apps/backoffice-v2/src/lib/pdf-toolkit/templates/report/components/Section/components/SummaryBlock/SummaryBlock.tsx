import { Description } from '@/lib/pdf-toolkit/templates/report/components/Section/components/SummaryBlock/SummaryBlock.Description';
import { Title } from '@/lib/pdf-toolkit/templates/report/components/Section/components/SummaryBlock/SummaryBlock.Title';
import { tw } from '@/lib/pdf-toolkit/theme';
import { AnyChildren } from '@ballerine/ui';
import { View } from '@react-pdf/renderer';

export interface SummaryBlockProps {
  children: AnyChildren;
}

export const SummaryBlock = ({ children }: SummaryBlockProps) => {
  return <View style={tw('flex flex-col gap-5')}>{children}</View>;
};

SummaryBlock.Title = Title;
SummaryBlock.Description = Description;
