import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import {
  IIndividualSanctionsItem,
  IndividualSanctionsItem,
} from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/IndividualSanctionsItem';
import { tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import poweredByLogo from '../TitlePage/assets/title-page-ballerine-logo.png';

const individualSanctions: IIndividualSanctionsItem[] = [
  {
    checkedAt: '12/12/2021',
    matchesCount: 2,
    names: ['John Doe', 'Jane Doe'],
    warnings: [],
    sanctions: [],
    PEP: [],
    adverseMedia: [],
    firstName: 'John',
    lastName: 'Doe',
  },
  {
    checkedAt: '12/12/2021',
    matchesCount: 0,
    names: ['John Doe', 'Jane Doe'],
    warnings: ['Matched with known PEP', 'Matched with known PEP'],
    sanctions: ['PEP', 'PEP'],
    PEP: ['PEP', 'PEP'],
    adverseMedia: ['PEP', 'PEP'],
    firstName: 'John',
    lastName: 'Doe',
  },
];

export const IndividualSanctionsPage = () => {
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
            <CaseInformationPageSectionHeader title="Individual PEP/Sanctions" />
            <View style={tw('flex flex-col gap-6')}>
              {individualSanctions.map((item, index) => (
                <IndividualSanctionsItem key={index} item={item} />
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
