import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { TCompanySanctionsData } from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage/company-sanctions.schema';
import { CompanySanctionsMatchSection } from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage/components/CompanySanctionsMatchSection/CompanySanctionsMatchSection';
import { tw, Typography } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';
import { checkIsUrl } from '@ballerine/common';

export const CompanySanctionsPage: FunctionComponent<TCompanySanctionsData> = ({
  sanctions,
  companyName,
  logoUrl,
}) => {
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
              subtitle={`Check conducted at: ${dayjs().format('D MMM YYYY HH:mm')}`}
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
                <Typography styles={[tw('text-[#EA4335]')]} weight="bold">
                  {sanctions.length}
                  {' matches'}
                </Typography>
              </View>
            </View>
            <View style={tw('flex flex-col gap-4')}>
              {sanctions.map((item, index) => (
                <CompanySanctionsMatchSection
                  key={item.name}
                  primaryName={item.name}
                  labels={item.labels}
                  matchNumber={index + 1}
                  lastReviewedDate={item.reviewDate ? new Date(item.reviewDate) : undefined}
                  matchReasons={item.matchReasons}
                  sources={item.sources.filter(source => checkIsUrl(source))}
                  addresses={item.addresses}
                />
              ))}
            </View>
            {/* Company Sanctions section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
