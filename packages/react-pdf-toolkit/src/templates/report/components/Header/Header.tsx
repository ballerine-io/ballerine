import { Badge } from '@/components/Badge';
import { tw } from '@/theme';
import { Image, Text, View } from '@react-pdf/renderer';
import ballerinelogo from '../../../../assets/ballerine-logo-report.png';

export interface HeaderProps {
  title: string;
  status: 'published';
  version?: number;
}

export const Header = ({ title, version }: HeaderProps) => {
  return (
    <View style={tw('flex flex-col')}>
      <View style={tw('flex flex-row justify-between items-center mb-8')}>
        <Image
          style={{
            width: '140px',
            height: '31px',
          }}
          src={ballerinelogo}
        />
        {version && <Text style={tw('text-xs')}>{`Version ${version}`}</Text>}
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
