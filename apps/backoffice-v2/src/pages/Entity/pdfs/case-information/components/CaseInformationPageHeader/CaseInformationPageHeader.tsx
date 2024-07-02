import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { Image, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface ICaseInformationPageHeaderProps {
  companyLogo: string;
  companyName: string;
}

export const CaseInformationPageHeader: FunctionComponent<ICaseInformationPageHeaderProps> = ({
  companyLogo,
  companyName,
}) => (
  <View style={tw('flex flex-col gap-3')}>
    <Image style={tw('w-[57px]')} src={companyLogo} />
    <Typography styles={[tw('text-[12px]')]} weight="bold">
      {companyName}
    </Typography>
  </View>
);
