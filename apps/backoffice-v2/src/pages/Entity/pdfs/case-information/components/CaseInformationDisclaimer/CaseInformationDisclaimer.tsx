import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';

export const CaseInformationDisclaimer = () => (
  <View style={tw('flex flex-col bg-[#F6F6F6] rounded-[11px] p-3 gap-3 ')}>
    <Typography weight="bold" styles={[tw('text-[8px] text-[#5E5E5E]')]}>
      Ballerine Inc. Report Disclaimer
    </Typography>
    <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
      This report is provided “as is” by Ballerine Inc. for informational purposes. It is derived
      from data submitted by our Payfac customers and third parties. Ballerine Inc. does not
      guarantee the accuracy, completeness, or usefulness of any information in the report and is
      not responsible for any errors or omissions, or for results obtained from the use of this
      information.
    </Typography>
    <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
      By using this report, you agree that Ballerine Inc. shall not be liable for any direct,
      indirect, incidental, or consequential damages arising from your use of or reliance on any
      information contained herein. This report is not intended to provide legal, financial, or
      professional advice.
    </Typography>
    <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
      Use of this report is at your sole risk. Ballerine Inc. disclaims all liability for any loss
      or damage arising out of your use of or reliance on the report.
    </Typography>
  </View>
);
