import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

interface ICompanyOwnershipItem {
  name: string;
  type: string;
  percentage: string;
  level: number;
}

const tableItems: ICompanyOwnershipItem[] = [
  {
    name: 'AIR STAR ALLIANCE GLOBAL SINGAPORE PTE. LTD.',
    type: 'COMPANY',
    percentage: '100%',
    level: 1,
  },
  {
    name: 'MENG, XIANGHONG',
    type: 'PERSON',
    percentage: '100%',
    level: 3,
  },
];

export const CompanyOwnershipPage = () => {
  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader
          companyLogo={poweredByLogo}
          companyName="Ballerine Onboarding Data Report"
        />
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
              {tableItems.map(item => (
                <View key={item.name} style={tw('flex flex-row')}>
                  <View style={tw('flex w-[50%] text-ellipsis')}>
                    <View style={tw('mr-4 overflow-hidden')}>
                      <Typography styles={[tw('text-[8px]')]}>{item.name}</Typography>
                    </View>
                  </View>
                  <View style={tw('flex w-[20%]')}>
                    <Typography styles={[tw('text-[8px]')]}>{item.type}</Typography>
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <Typography styles={[tw('text-[8px]')]}>{item.percentage}</Typography>
                  </View>
                  <View style={tw('flex w-[15%]')}>
                    <Typography styles={[tw('text-[8px]')]}>{item.level}</Typography>
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
