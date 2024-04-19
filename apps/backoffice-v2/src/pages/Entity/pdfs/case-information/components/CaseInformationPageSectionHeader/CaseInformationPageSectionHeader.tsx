import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface ICaseInformationPageSectionHeaderProps {
  title: string;
  subtitle: string;
}

export const CaseInformationPageSectionHeader: FunctionComponent<
  ICaseInformationPageSectionHeaderProps
> = ({ title, subtitle }) => (
  <View style={tw('flex flex-col')}>
    <Typography styles={[tw('text-[16px] leading-[1.75rem]')]} weight="bold">
      {title}
    </Typography>
    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]}>{subtitle}</Typography>
  </View>
);
