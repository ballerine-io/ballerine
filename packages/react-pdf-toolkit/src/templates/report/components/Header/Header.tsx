import { Badge } from '@/components/atoms/Badge';
import { tw } from '@/theme';
import { Image, Text, View } from '@react-pdf/renderer';
import BallerineLogo from '../../../../assets/ballerine-logo-report.png';

interface HeaderProps {
  title: string;
  status: 'published';
  version?: number;
}

export const Header = ({ title, version }: HeaderProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} src={BallerineLogo} />
        {version && <Text style={styles.versionText}>{`Version ${version}`}</Text>}
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>Status</Text>
          <Badge text="Published" rounded="secondary" />
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: tw('flex flex-col'),
  logoContainer: tw('flex flex-row justify-between items-center mb-8'),
  logo: { width: '140px', height: '31px' },
  versionText: tw('text-xs'),
  titleContainer: tw('flex flex-col gap-10'),
  title: tw('text-3xl leading-none font-semibold'),
  statusContainer: tw('flex flex-row items-center gap-4'),
  statusText: tw('text-base leading-5'),
};
