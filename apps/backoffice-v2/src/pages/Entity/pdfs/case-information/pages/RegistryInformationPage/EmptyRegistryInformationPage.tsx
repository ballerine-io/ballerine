import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { TEmptyRegistryInformationPageData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/empty-registry-information-page.schema';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface IEmptyRegistryInformationPageProps {
  data: TEmptyRegistryInformationPageData;
}

export const EmptyRegistryInformationPage: FunctionComponent<
  IEmptyRegistryInformationPageProps
> = ({ data }) => {
  const { logoUrl, companyName } = data;

  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Registry Information section --- start */}
            <CaseInformationPageSectionHeader
              title="Registry Information"
              subtitle={`Check conducted at: ${new Date().toISOString()}`}
            />
            <View style={tw('flex flex-row gap-4')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="normal">
                Registry Information not available
              </Typography>
            </View>
            {/* Registry Information section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
