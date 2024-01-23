import { Indicator } from '@/templates/report/components/Section/components/Indicators/Indicators.Indicator';
import { Title } from '@/templates/report/components/Section/components/Indicators/Indicators.Title';
import { tw } from '@/theme';
import { AnyChildren } from '@ballerine/ui';
import { View } from '@react-pdf/renderer';

export interface IndicatorsProps {
  children: AnyChildren;
}

export const Indicators = ({ children }: IndicatorsProps) => {
  return <View style={tw('flex flex-col gap-4')}>{children}</View>;
};

Indicators.Indicator = Indicator;
Indicators.Title = Title;
