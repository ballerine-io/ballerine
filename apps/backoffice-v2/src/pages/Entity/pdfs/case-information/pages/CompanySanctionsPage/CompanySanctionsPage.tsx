import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import {
  CompanySanctionsMatchSection,
  ICompanySanctionsMatchSectionAddress,
} from '@/pages/Entity/pdfs/case-information/pages/CompanySanctionsPage/components/CompanySanctionsMatchSection/CompanySanctionsMatchSection';
import { Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

interface ICompanySanctionsItem {
  primaryName: string;
  lastReviewed: string;
  labels: string[];
  matchReasons: string[];
  //urls
  sources: string[];
  //address line
  addresses: ICompanySanctionsMatchSectionAddress[];
}

const matches: ICompanySanctionsItem[] = [
  {
    primaryName: 'Singapore Airlines Limited',
    lastReviewed: '12/12/2021',
    labels: [
      'PEP',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'PEP',
      'Sanction',
      'PEP',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'PEP',
      'Sanction',
      'PEP',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'Sanction',
      'PEP',
      'Sanction',
    ],
    matchReasons: [
      'Name',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Name',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Name',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
      'Address',
    ],
    sources: [
      'https://www.singaporeairlines.com',
      'https://www.example.com',
      'https://www.example.com',
      'https://www.example.com',
      'https://www.example.com',
      'https://www.example.com',
      'https://www.example.com',
      'https://www.example.com',
    ],
    addresses: [
      {
        addresses: [
          'Sutton yard, 65 Goswell Road, London, United Kingdom',
          'Sutton yard, 65 Goswell Road, London, United Kingdom',
          'Sutton yard, 65 Goswell Road, London, United Kingdom',
          'Sutton yard, 65 Goswell Road, London, United Kingdom',
        ],
        city: 'London',
        country: 'United Kingdom',
      },
      {
        addresses: ['Sutton yard, 65 Goswell Road, London, United Kingdom'],
        city: 'London',
        country: 'United Kingdom',
      },
    ],
  },
  {
    primaryName: 'Singapore Airlines Limited',
    lastReviewed: '12/12/2021',
    labels: ['PEP', 'Sanction'],
    matchReasons: ['Name', 'Address'],
    sources: [
      'https://www.singaporeairlines.com',
      'https://www.example.com',
      'https://www.example.com',
    ],
    addresses: [
      {
        addresses: ['Sutton yard, 65 Goswell Road, London, United Kingdom'],
        city: 'London',
        country: 'United Kingdom',
      },
      {
        addresses: ['Sutton yard, 65 Goswell Road, London, United Kingdom'],
        city: 'London',
        country: 'United Kingdom',
      },
    ],
  },
];

export const CompanySanctionsPage = () => {
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
                <Typography styles={[tw('text-[#EA4335]')]} weight="bold">
                  {matches.length}
                  {' matches'}
                </Typography>
              </View>
            </View>
            <View style={tw('flex flex-col gap-4')}>
              {matches.map((item, index) => (
                <CompanySanctionsMatchSection
                  key={item.primaryName}
                  primaryName={item.primaryName}
                  labels={item.labels}
                  matchNumber={index + 1}
                  lastReviewedDate={item.lastReviewed}
                  matchReasons={item.matchReasons}
                  sources={item.sources}
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
