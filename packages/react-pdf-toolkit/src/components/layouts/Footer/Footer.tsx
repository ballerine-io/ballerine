import { BallerineLogo } from '@/components/atoms/BallerineLogo';
import { Typography } from '@/components/atoms/Typography';
import { FooterProps } from '@/components/layouts/Footer/types';
import { tw } from '@/theme';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export const Footer: FunctionComponent<FooterProps> = ({ domain, contactEmail, companyName }) => {
  return (
    <View style={tw('flex flex-col gap-4')}>
      <View style={tw('flex flex-row justify-between')}>
        <View>
          <BallerineLogo size="small" styles={[tw('opacity-50')]} />
        </View>
        <View style={tw('flex flex-col gap-2')}>
          <Typography size="small" color="silent">
            Report powered by {companyName}.
          </Typography>
          <Typography size="small" color="silent">
            All rights reserved.
          </Typography>
        </View>
        <View style={tw('flex flex-col gap-2')}>
          <Typography size="small" color="silent">
            For support and inquiries:{' '}
          </Typography>
          \
          <Typography size="small" color="silent">
            {contactEmail}
          </Typography>
        </View>
        <View style={tw('flex flex-col gap-2')}>
          <Typography size="small" color="silent">
            {domain}
          </Typography>
        </View>
      </View>
    </View>
  );
};
