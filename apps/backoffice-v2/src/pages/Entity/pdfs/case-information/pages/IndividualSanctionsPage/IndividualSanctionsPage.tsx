import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { IndividualSanctionsItem } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/IndividualSanctionsItem';
import { TIndividualSanctionsData } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/individual-sanctions.schema';
import { tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';
import poweredByLogo from './assets/title-page-ballerine-logo.png';

interface IIndividualSanctionsPageProps {
  data: TIndividualSanctionsData;
}

export const IndividualSanctionsPage: FunctionComponent<IIndividualSanctionsPageProps> = ({
  data,
}) => {
  const { items } = data;

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
              {items.map((item, index) => (
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
