import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { TEmptyCompanySanctionsPageData } from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage/empty-company-sanctions.schema';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface IEmptyCompanySanctionsPageProps {
  data: TEmptyCompanySanctionsPageData;
}

export const EmptyCompanySanctionsPage: FunctionComponent<IEmptyCompanySanctionsPageProps> = ({
  data,
}) => {
  const { companyName, logoUrl } = data;

  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Company Sanctions section --- start */}
            <CaseInformationPageSectionHeader
              title="Company Sanctions"
              subtitle={`Check conducted at: ${new Date().toISOString()}`}
            />
            <View style={tw('flex flex-col gap-2')}>
              <View style={tw('flex flex-row')}>
                <View style={tw('w-[72px]')}>
                  <Typography styles={[tw('text-[8px]')]} weight="bold">
                    Scan Status
                  </Typography>
                </View>
                <Typography>Completed</Typography>
              </View>
              <View style={tw('flex flex-row')}>
                <View style={tw('w-[72px]')}>
                  <Typography styles={[tw('text-[8px]')]} weight="bold">
                    Total Matches
                  </Typography>
                </View>
                <Typography styles={[tw('text-[#00BD59]')]} weight="bold">
                  0 matches
                </Typography>
              </View>
            </View>
            {/* Company Sanctions section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
