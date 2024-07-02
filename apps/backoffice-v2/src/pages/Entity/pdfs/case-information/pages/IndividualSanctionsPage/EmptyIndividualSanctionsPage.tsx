import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { tw, Typography } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';
import poweredByLogo from '../../assets/title-page-ballerine-logo.png';
import { TBaseCaseInformationPdf } from '@/pages/Entity/pdfs/case-information/schemas/base-case-information-pdf.schema';

export const EmptyIndividualSanctionsPage: FunctionComponent<TBaseCaseInformationPdf> = ({
  companyName,
}) => {
  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={poweredByLogo} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Company Sanctions section --- start */}
            <CaseInformationPageSectionHeader title="Individual PEP/Sanctions" />
            <View style={tw('flex flex-row gap-4')}>
              <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="normal">
                Individual PEP/Sanctions not available
              </Typography>
            </View>
            {/* Company Sanctions section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
