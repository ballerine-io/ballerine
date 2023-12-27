import { Blocks } from '@/lib/pdf-toolkit/templates/report/components/Section/components/Blocks';
import { Indicators } from '@/lib/pdf-toolkit/templates/report/components/Section/components/Indicators';
import { SummaryBlock } from '@/lib/pdf-toolkit/templates/report/components/Section/components/SummaryBlock';
import { tw } from '@/lib/pdf-toolkit/theme';
import { AnyChildren } from '@ballerine/ui';
import { Text, View } from '@react-pdf/renderer';

interface SectionProps {
  children: AnyChildren;
}

export const Section = ({ children }: SectionProps) => {
  return (
    <View style={tw('flex flex-col p-8 border border-slate-100 rounded-[6px] shadow-lg w-full')}>
      <Text style={tw('text-2xl font-semibold leading-none mb-8')}>Summary</Text>
      <View style={tw('gap-8')}>{children}</View>
    </View>
  );
};

Section.Blocks = Blocks;
Section.SummaryBlock = SummaryBlock;
Section.Indicators = Indicators;
