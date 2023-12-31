import { Image, View, Text } from '@react-pdf/renderer';
import alertIcon from '../../../../../../assets/pdf-alert-icon.png';
import { tw } from '@/theme';

export interface IndicatorProps {
  text: string;
}

export const Indicator = ({ text }: IndicatorProps) => {
  return (
    <View style={tw('flex flex-row gap-3')}>
      <Image src={alertIcon} style={{ width: '16px', height: '16px' }} />
      <Text style={tw('text-sm leading-none font-light')}>{text}</Text>
    </View>
  );
};
