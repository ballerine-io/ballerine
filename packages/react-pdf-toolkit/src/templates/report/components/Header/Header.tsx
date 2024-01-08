import { Image, Text, View } from '@react-pdf/renderer';
import ballerinelogo from '../../../../assets/ballerine-logo-report.png';
import { tw } from '@/theme';
import { Badge } from '@/components/Badge';

export interface HeaderProps {
  title: string;
  status: 'published';
}

export const Header = ({ title }: HeaderProps) => {
  return (
    <View style={tw('flex flex-col')}>
      <View style={tw('flex items-start mb-8')}>
        <Image
          style={{
            width: '140px',
            height: '31px',
          }}
          src={ballerinelogo}
        />
      </View>
      <View style={tw('flex flex-col gap-10')}>
        <Text style={tw('text-3xl leading-none font-semibold')}>{title}</Text>
        <View style={tw('flex flex-row items-center gap-4')}>
          <Text style={tw('text-base leading-5')}>Status</Text>
          <Badge text="Published" rounded={'secondary'} />
        </View>
      </View>
    </View>
  );
};
