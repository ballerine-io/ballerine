import { CaseInformationDisclaimer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationDisclaimer/CaseInformationDisclaimer';
import { CaseInformationPageContainer } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageContainer/CaseInformationPageContainer';
import { CaseInformationPageHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageHeader/CaseInformationPageHeader';
import { CaseInformationPageSection } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSection/CaseInformationPageSection';
import { CaseInformationPageSectionHeader } from '@/pages/Entity/pdfs/case-information/components/CaseInformationPageSectionHeader/CaseInformationPageSectionHeader';
import { ValueOrNone } from '@/pages/Entity/pdfs/case-information/pages/IndividualSanctionsPage/components/IndividualSanctionsItem/ValueOrNone';
import { TRegistryInformationData } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/registry-information.schema';
import { registryItemsAdapter } from '@/pages/Entity/pdfs/case-information/pages/RegistryInformationPage/utils/create-registry-items';
import { Link, Typography, tw } from '@ballerine/react-pdf-toolkit';
import { View } from '@react-pdf/renderer';
import dayjs from 'dayjs';
import { FunctionComponent } from 'react';

export interface IRegistryInformationPageProps {
  data: TRegistryInformationData;
}

export const RegistryInformationPage: FunctionComponent<IRegistryInformationPageProps> = ({
  data,
}) => {
  const { companyName, logoUrl } = data;

  const registryItems = registryItemsAdapter(data);

  return (
    <CaseInformationPageContainer>
      <View style={tw('mb-3')}>
        <CaseInformationPageHeader companyLogo={logoUrl} companyName={companyName} />
      </View>
      <View style={tw('flex flex-col gap-5')}>
        <CaseInformationPageSection>
          <View style={tw('flex flex-col gap-4 py-3')}>
            {/* Registry Information section --- start */}
            <CaseInformationPageSectionHeader
              title="Registry Information"
              subtitle={`Check conducted at: ${dayjs().format('D MMM YYYY HH:mm')}`}
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
                  item.valueType === 'link' && item.value ? (
                    <Link
                      key={item.key}
                      url="View"
                      href={item.value}
                      styles={[tw('text-[#007AFF] no-underline')]}
                    ></Link>
                  ) : (
                    <ValueOrNone value={item.value} key={item.key} />
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
