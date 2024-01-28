import { Typography } from '@/components/atoms/Typography';
import { HeaderProps } from '@/components/layouts/Header/types';
import { tw } from '@/theme';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Header: FunctionComponent<HeaderProps> = ({
  logoElement,
  titleElement,
  createdAtTimestamp,
}) => {
  return (
    <View style={tw('flex flex-row pb-4 justify-between')}>
      <View style={tw('flex flex-col gap-4')}>
        <View>{logoElement}</View>
        <View>{titleElement}</View>
      </View>
      {createdAtTimestamp && (
        <View style={tw('flex flex-col gap-2')}>
          <Typography weight="bold">Check Created at</Typography>
          <Typography>{new Date(createdAtTimestamp).toDateString()}</Typography>
        </View>
      )}
    </View>
  );
};
