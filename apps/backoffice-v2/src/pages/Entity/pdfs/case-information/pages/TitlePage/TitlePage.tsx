import { TTitlePageData } from '@/pages/Entity/pdfs/case-information/pages/TitlePage/title-page.schema';
import { Image, List, ListItem, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { Page, View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

export interface ITitlePageProps {
  data: TTitlePageData;
}

export const TitlePage: FunctionComponent<ITitlePageProps> = ({ data }) => {
  const { companyName, creationDate } = data;

  return (
    <Page wrap={false}>
      <View style={tw('flex flex-col p-5')}>
        {/* Powered by section --- start */}
        <View style={tw('flex flex-col gap-1 pb-12')}>
          <Typography styles={[tw('text-[12px]')]}>Powered by</Typography>
          <Image width={100} height={23} src={poweredByLogo} />
        </View>
        {/* Powered by section --- end */}
        {/* Company Info section --- start */}
        <View style={tw('flex flex-col items-center justify-center gap-12 pb-12')}>
          <Image width={100} height={23} src={poweredByLogo} />
          <Typography styles={[tw('text-[18px] text-center leading-5')]} weight="bold">
            {companyName}
          </Typography>
        </View>
        {/* Company Info section --- end */}
        {/* Document information section --- start*/}
        <View style={tw('flex flex-col gap-2 items-center pb-12')}>
          <Typography weight="bold" styles={[tw('text-[10px]')]}>
            {new Date(creationDate).toISOString()}
          </Typography>
          <Typography styles={[tw('text-[10px]')]}>{new Date().toISOString()}</Typography>
        </View>
        {/* Document information section --- end*/}
        {/* Table of contents section --- start */}
        <View style={tw('flex flex-col gap-4 items-center pb-[240px]')}>
          <Typography styles={[tw('text-[10px]')]} weight="bold">
            Table of Contents
          </Typography>
          <List>
            <ListItem>
              <Typography>1. Registry Information</Typography>
            </ListItem>
            <ListItem>
              <Typography>2. Company Ownership</Typography>
            </ListItem>
            <ListItem>
              <Typography>3. Company Sanctions</Typography>
            </ListItem>
            <ListItem>
              <Typography>4. Individual Identity verifications</Typography>
            </ListItem>
            <ListItem>
              <Typography>5. Individual PEP/Sanctions</Typography>
            </ListItem>
          </List>
        </View>
        {/* Table of contents section --- end */}
        {/* Disclaimer section --- start */}
        <View style={tw('flex flex-col bg-[#F6F6F6] rounded-[11px] p-3 gap-3 ')}>
          <Typography weight="bold" styles={[tw('text-[8px] text-[#5E5E5E]')]}>
            Ballerine Inc. Report Disclaimer
          </Typography>
          <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
            This report is provided “as is” by Ballerine Inc. for informational purposes. It is
            derived from data submitted by our Payfac customers and third parties. Ballerine Inc.
            does not guarantee the accuracy, completeness, or usefulness of any information in the
            report and is not responsible for any errors or omissions, or for results obtained from
            the use of this information.
          </Typography>
          <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
            By using this report, you agree that Ballerine Inc. shall not be liable for any direct,
            indirect, incidental, or consequential damages arising from your use of or reliance on
            any information contained herein. This report is not intended to provide legal,
            financial, or professional advice.
          </Typography>
          <Typography styles={[tw('text-[6px] text-[#5E5E5E] text-justify')]}>
            Use of this report is at your sole risk. Ballerine Inc. disclaims all liability for any
            loss or damage arising out of your use of or reliance on the report.
          </Typography>
        </View>
        {/* Disclaimer section --- end */}
      </View>
    </Page>
  );
};
