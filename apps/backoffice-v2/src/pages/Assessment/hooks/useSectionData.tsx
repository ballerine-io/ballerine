import {
  AlertTriangleIcon,
  ListChecksIcon,
  MapPinIcon,
  SearchCheckIcon,
  UsersIcon,
} from 'lucide-react';
import { useMemo } from 'react';

import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { BlocksComponent } from '@ballerine/blocks';
import { BlockCardWrapper } from '../components/BlockCardWrapper';
import { ChecksSectionContent } from '../components/ChecksSectionContent';
import { StreetViewComponent } from '../components/StreetViewComponent';
import { AssessmentPageSection, SectionDataProps } from '../types';

export const useSectionData = ({
  assessment,
  assessmentChecks,
}: SectionDataProps): AssessmentPageSection[] => {
  const companySanctions = useMemo(() => {
    return assessment?.companySanctions?.output?.data?.map(sanction => ({
      sources: sanction?.entity?.sources,
      officialLists: sanction?.entity?.officialLists,
      fullReport: sanction,
      linkedIndividuals: sanction?.entity?.linkedIndividuals,
      lastReviewed: sanction?.entity?.lastReviewed,
      primaryName: sanction?.entity?.name,
      labels: sanction?.entity?.categories,
      reasonsForMatch: sanction?.matchedFields,
      furtherInformation: sanction?.entity?.furtherInformation,
      alternativeNames: sanction?.entity?.otherNames,
      places: sanction?.entity?.places,
    }));
  }, [assessment?.companySanctions?.output?.data]);
  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions);

  const registryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput: {
      businessInformation: { data: [assessment?.companyRegistryInformation?.output?.data] },
    },
    workflow: {},
  });

  const companyStructureBlock = useUbosRegistryProvidedBlock(
    assessment?.companyStructure?.output?.nodes && assessment?.companyStructure?.output.edges
      ? assessment?.companyStructure?.output
      : { nodes: [], edges: [] },
  );

  return useMemo(() => {
    const registryData = assessment?.companyRegistryInformation?.output?.data;
    const getRegisteredAddress = () => {
      if (!registryData?.addresses?.length) return null;

      const registeredAddressObj = registryData.addresses.find((addr: any) => {
        if (addr.type) {
          return addr.type.toLowerCase().includes('registered') && addr.fullAddress;
        }

        return !!addr.fullAddress;
      });

      return registeredAddressObj?.fullAddress || null;
    };

    const registeredAddress = getRegisteredAddress();

    // Company sanctions section
    const companySanctionsSection = {
      id: 'company-sanctions',
      title: 'Company Sanctions',
      Icon: AlertTriangleIcon,
      hasViolations: Boolean(assessment?.companySanctions?.output?.data?.length),
      Component: (
        <BlockCardWrapper
          status={assessment?.companySanctions?.status}
          errorMessage="Company Sanctions check failed"
          emptyMessage="Company Sanctions data is not available"
          showContent={assessment?.companySanctions?.status === 'completed'}
        >
          <BlocksComponent blocks={[...companySanctionsBlock]} cells={cells}>
            {(Cell: any, cell: any) => <Cell {...cell} />}
          </BlocksComponent>
        </BlockCardWrapper>
      ),
    };

    if (assessment?.type === 'company_sanctions') {
      return [companySanctionsSection];
    }

    return [
      {
        id: 'checks',
        title: 'Checks',
        Icon: ListChecksIcon,
        hasViolations: assessmentChecks.some(check => check.status === 'negative'),
        Component: <ChecksSectionContent assessmentChecks={assessmentChecks} />,
      },
      companySanctionsSection,
      {
        id: 'registry-information',
        title: 'Registry Information',
        Icon: SearchCheckIcon,
        hasViolations: assessment?.companyRegistryInformation?.status === 'failed',
        Component: (
          <BlockCardWrapper
            status={assessment?.companyRegistryInformation?.status}
            errorMessage="Company Registry Information check failed"
            emptyMessage="Company Registry Information data is not available"
            showContent={Boolean(assessment?.companyRegistryInformation?.output?.data)}
          >
            <BlocksComponent blocks={[...registryInfoBlock]} cells={cells}>
              {(Cell: any, cell: any) => <Cell {...cell} />}
            </BlocksComponent>
          </BlockCardWrapper>
        ),
      },
      {
        id: 'company-structure',
        title: 'Company Structure',
        Icon: UsersIcon,
        hasViolations: assessment?.companyStructure?.status === 'failed',
        Component: (
          <BlockCardWrapper
            status={assessment?.companyStructure?.status}
            errorMessage="Company Structure check failed"
            emptyMessage="Company Structure data is not available"
            showContent={Boolean(
              assessment?.companyStructure?.output?.nodes ||
                assessment?.companyStructure?.output?.edges,
            )}
          >
            <BlocksComponent blocks={[...companyStructureBlock]} cells={cells}>
              {(Cell: any, cell: any) => <Cell {...cell} />}
            </BlocksComponent>
          </BlockCardWrapper>
        ),
      },
      {
        id: 'registered-address',
        title: 'Registered Address',
        Icon: MapPinIcon,
        Component: (
          <BlockCardWrapper
            status={
              registeredAddress ? 'completed' : assessment?.companyRegistryInformation?.status
            }
            errorMessage="Company address information check failed"
            emptyMessage="No registered address information available"
            showContent={Boolean(registeredAddress)}
          >
            <StreetViewComponent
              address={registeredAddress}
              countryCode={assessment?.input?.country}
            />
          </BlockCardWrapper>
        ),
      },
    ];
  }, [
    assessment,
    assessmentChecks,
    companySanctionsBlock,
    companyStructureBlock,
    registryInfoBlock,
  ]);
};
