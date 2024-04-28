import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { TCompanyOwnershipData } from '@/pages/Entity/pdfs/case-information/pages/CompanyOwnershipPage/company-ownership.schema';
import { ValueOrNone } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/ValueOrNone';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

export interface ICompanyOwnershipPageProps {
  data: TCompanyOwnershipData;
}

export const CompanyOwnershipPage: FunctionComponent<ICompanyOwnershipPageProps> = ({ data }) => {
  const { items, companyName, logoUrl } = data;

  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Company Ownership section --- start */}
            <CaseInformationPageSectionHeader
              title="Company Ownership"
              subtitle={`Check conducted at: ${new Date().toISOString()}`}
            />
            <View style={tw('flex flex-col gap-2')}>
              <View style={tw('flex flex-row gap-4')}>
                {/* Table Header --- start */}
                <View style={tw('flex flex-row')}>
                  <View style={tw('flex w-[50%]')}>
                    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                      Name
                    </Typography>
                  </View>
                  <View style={tw('flex w-[20%]')}>
                    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                      Type
                    </Typography>
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                      Percentage
                    </Typography>
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} weight="bold">
                      Level
                    </Typography>
                  </View>
                </View>
                {/* Table Header --- end */}
              </View>
              {/* Table Body --- start */}
              {items.map(({ companyName, companyType, ownershipPercentage, level }) => (
                <View key={companyName} style={tw('flex flex-row')}>
                  <View style={tw('flex w-[50%] text-ellipsis')}>
                    <View style={tw('mr-4 overflow-hidden')}>
                      <ValueOrNone value={companyName} />
                    </View>
                  </View>
                  <View style={tw('flex w-[20%]')}>
                    <ValueOrNone value={companyType} />
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <ValueOrNone
                      value={ownershipPercentage ? `${ownershipPercentage}%` : undefined}
                    />
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <ValueOrNone value={level} />
                  </View>
                </View>
              ))}
              {/* Table Body --- end */}
            </View>
            {/* Company Ownership section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
