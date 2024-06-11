import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { tw, Typography } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';
import { TBaseCaseInformationPdf } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';

export const EmptyIdentityVerificationsPage: FunctionComponent<TBaseCaseInformationPdf> = ({
  logoUrl,
  companyName,
}) => {
  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Individual Identity verifications section --- start */}
            <CaseInformationPageSectionHeader title="Individual Identity verifications" />
            <View style={tw('flex flex-row gap-4')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="normal">
                Individual identity verifications not available
              </Typography>
            </View>
            {/* Individual Identity verifications section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
