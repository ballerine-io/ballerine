import { Blocks } from '@/templates/report/components/Section/components/Blocks';
import { Indicators } from '@/templates/report/components/Section/components/Indicators';
import { SummaryBlock } from '@/templates/report/components/Section/components/SummaryBlock';
import { tw } from '@/theme';
import { AnyChildren } from '@ballerine/ui';
import { Text, View } from '@react-pdf/renderer';

interface SectionProps {
  children: AnyChildren;
  title: string | React.ReactNode;
}

export const Section = ({ children, title }: SectionProps) => {
  return (
    <View style={tw('flex flex-col p-8 border border-slate-100 rounded-[6px] shadow-lg w-full')}>
      <Text style={tw('text-2xl font-semibold leading-none mb-8')}>{title}</Text>
      <View style={tw('gap-8')}>{children}</View>
    </View>
  );
};

Section.Blocks = Blocks;
Section.SummaryBlock = SummaryBlock;
Section.Indicators = Indicators;
