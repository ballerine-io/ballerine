import { Typography } from '@/build';
import { tw } from '@/theme';
import { View } from '@react-pdf/renderer';

export const Disclaimer = () => {
  return (
    <View style={tw('flex flex-col gap-1')}>
      <Typography color="silent" weight="bold" size="small">
        Disclaimer:
      </Typography>
      <Typography color="silent" size="small" styles={[tw('leading-6 text-justify')]}>
        This report (“
        <Typography size="small" color="silent" weight="bold">
          Report
        </Typography>
        ”) is provided by Ballerine, Inc. its affiliates, and its third-party licensors
        (collectively, “Ballerine” or “We”) solely to the client to whom it is addressed (“You”).
        The information contained in this Report is for general information purposes only. You
        expressly agree and acknowledge that this Report is provided on an “as is” basis, and that
        your use of this Report is at your own risk. Whilst we endeavor to keep the information up
        to date and correct, Ballerine makes no representations or warranties of any kind, express
        or implied about the completeness, accuracy, reliability, suitability or availability with
        respect to this Report or related information for any purpose. Ballerine will not be liable
        for any false, inaccurate, inappropriate or incomplete information presented in this Report.
        To the extent not prohibited by law, in no event whatsoever shall Ballerine be liable for
        any direct, indirect, incidental, special, punitive or consequential or similar damages even
        if advised of the possibility of such damages nor shall Ballerine be liable for any claims
        against you by third parties.
      </Typography>
    </View>
  );
};
