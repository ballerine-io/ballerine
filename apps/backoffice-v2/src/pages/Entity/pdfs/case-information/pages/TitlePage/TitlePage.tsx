import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { Image, List, ListItem, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

export const TitlePage = () => {
  return (
    <CaseInformationPageContainer>
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
          Singapore Airlines Limited
          {'\n'} Onboarding Data Report
        </Typography>
      </View>
      {/* Company Info section --- end */}
      {/* Document information section --- start*/}
      <View style={tw('flex flex-col gap-2 items-center pb-12')}>
        <Typography weight="bold" styles={[tw('text-[10px]')]}>
          Created at
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
      <CaseInformationDisclaimer />
    </CaseInformationPageContainer>
  );
};
