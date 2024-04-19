import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { Link, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

interface IRegistryItem {
  key: string;
  title: string;
  value: string;
  valueType?: 'text' | 'link';
}

const registryItems: IRegistryItem[] = [
  {
    key: 'name',
    title: 'Name',
    value: 'Singapore Airlines Limited',
  },
  {
    key: 'registrationNumber',
    title: 'Registration number',
    value: '128947342867',
  },
  {
    key: 'incorporationDate',
    title: 'Incorporation date',
    value: '12/12/2012',
  },
  {
    key: 'companyType',
    title: 'Company type',
    value: 'Public Company',
  },
  {
    key: 'currentStatus',
    title: 'Current status',
    value: 'Active',
  },
  {
    key: 'lastUpdate',
    title: 'Last update',
    value: '12/12/2021',
  },
  {
    key: 'registeredAddress',
    title: 'Registered Address',
    value: 'Singapore',
  },
  {
    key: 'createdAt',
    title: 'Created at',
    value: '12/12/2021',
  },
  {
    key: 'registryPage',
    title: 'Registry page',
    value: 'https://www.example.com',
    valueType: 'link',
  },
];

export const RegistryInformationPage = () => {
  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={poweredByLogo} companyName="Ballerine" />
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
              <View style={tw('flex flex-col gap-1 w-[80px]')}>
                {registryItems.map(item => (
                  <Typography
                    styles={[tw('text-[8px] leading-[1.45rem]')]}
                    weight="bold"
                    key={item.key}
                  >
                    {item.title}
                  </Typography>
                ))}
              </View>
              <View style={tw('flex flex-1 flex-col gap-1')}>
                {registryItems.map(item =>
                  item.valueType === 'link' ? (
                    <Link
                      key={item.key}
                      url="View"
                      href={item.value}
                      styles={[tw('text-[#007AFF] no-underline')]}
                    ></Link>
                  ) : (
                    <Typography styles={[tw('text-[8px] leading-[1.45rem]')]} key={item.key}>
                      {item.value}
                    </Typography>
                  ),
                )}
              </View>
            </View>
            {/* Registry Information section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
