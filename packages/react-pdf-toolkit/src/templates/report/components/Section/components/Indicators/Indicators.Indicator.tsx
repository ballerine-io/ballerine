import { tw } from '@/theme';
import { Image, Text, View } from '@react-pdf/renderer';
import alertIcon from '../../../../../../assets/pdf-alert-icon.png';

export interface IndicatorProps {
  text: string;
  useIcon?: boolean;
}

export const Indicator = ({ text, useIcon = true }: IndicatorProps) => {
  return (
    <View style={tw('flex flex-row items-center gap-3')}>
      {useIcon && <Image src={alertIcon} style={{ width: '16px', height: '16px' }} />}
      <Text style={tw('text-xs leading-[16px] font-light')}>{text}</Text>
    </View>
  );
};
