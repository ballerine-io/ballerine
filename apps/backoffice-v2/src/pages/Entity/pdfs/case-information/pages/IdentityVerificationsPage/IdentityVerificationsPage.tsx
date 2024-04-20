import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import {
  IIdentityItem,
  IdentityItem,
} from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage/components/IdentityItem/IdentityItem';
import { tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

const identities: IIdentityItem[] = [
  {
    checkedAt: '12/12/2021',
    result: 'approved',
    reason: 'Matched with known PEP',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '01/01/1990',
    id: '123',
    gender: 'Male',
    nationality: 'Singaporean',
  },
  {
    checkedAt: '12/12/2021',
    result: 'rejected',
    reason: 'Matched with known PEP',
    firstName: 'Jane',
    lastName: 'Doe',
    dateOfBirth: '01/01/1990',
    id: '123',
    gender: 'Female',
    nationality: 'Singaporean',
  },
];

export const IdentityVerificationsPage = () => {
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
            {/* Individual Identity verifications section --- start */}
            <CaseInformationPageSectionHeader title="Individual Identity verifications" />
            <View style={tw('flex flex-col gap-6')}>
              {identities.map((item, index) => (
                <IdentityItem key={index} item={item} />
              ))}
            </View>
            {/* Individual Identity verifications section --- end */}
          </View>
        </CaseInformationPageSection>
        <CaseInformationDisclaimer />
      </View>
    </CaseInformationPageContainer>
  );
};
