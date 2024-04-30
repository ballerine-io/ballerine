import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { IdentityItem } from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage/components/IdentityItem/IdentityItem';
import { TIdentityVerificationsData } from '@/pages/Entity/pdfs/case-information/pages/IdentityVerificationsPage/identity-verifications.schema';
import { tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import { FunctionComponent } from 'react';

interface IIDentityVerificationPageProps {
  data: TIdentityVerificationsData;
}

export const IdentityVerificationsPage: FunctionComponent<IIDentityVerificationPageProps> = ({
  data,
}) => {
  const { logoUrl, companyName, items } = data;

  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Individual Identity verifications section --- start */}
            <CaseInformationPageSectionHeader title="Individual Identity verifications" />
            <View style={tw('flex flex-col gap-6')}>
              {items.map((item, index) => (
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
