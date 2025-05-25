import { BlocksComponent } from '@ballerine/blocks';
import { ParsedBooleanSchema } from '@ballerine/ui';
import { AlertTriangleIcon, ListChecksIcon, LucideIcon, UsersRoundIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { useKybAndOwnershipAssessmentQuery } from '@/domains/assessments/hooks/queries/useKybAndOwnershipAssessmentQuery/useKybAndOwnershipAssessmentQuery';

type AssessmentPageSection = {
  id: string;
  title: string;
  Component: JSX.Element;
  description?: string;
  Icon?: LucideIcon;
  label?: string;
  hasViolations?: boolean;
  condition?: () => boolean;
};

export const useKybAndOwnershipAssessmentPageLogic = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: customer } = useCustomerQuery();

  const { data: assessment, isLoading: isLoadingAssessment } = useKybAndOwnershipAssessmentQuery({
    id: assessmentId ?? '',
  });

  const navigate = useNavigate();
  const onNavigateBack = () => navigate(-1);

  // TODO
  const notes = [] as any[];
  // useNotesByNoteable({
  //   noteableId: assessment?.id || '',
  //   noteableType: 'Report',
  // });

  const companySanctions = assessment?.companySanctions?.output?.data?.map(sanction => ({
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

  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions);

  const registryInfoBlock = useKybRegistryInfoBlock({
    pluginsOutput: {
      businessInformation: { data: [assessment?.companyRegistryInformation?.output?.data] },
    },
    workflow: {},
  });

  // TODO: temp fix, remove when the output is actually either null or an object of correct shape:
  // { nodes: [], edges: [] }
  const companyStructureBlock = useUbosRegistryProvidedBlock(
    assessment?.companyStructure?.output?.nodes && assessment?.companyStructure?.output.edges
      ? assessment?.companyStructure?.output
      : { nodes: [], edges: [] },
  );

  const sections = useMemo(() => {
    return [
      {
        id: 'company-sanctions',
        title: 'Company Sanctions',
        Icon: AlertTriangleIcon,
        Component: (
          <>
            {assessment?.companySanctions ? (
              <BlocksComponent blocks={[...companySanctionsBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">Company Sanctions data is not available</CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'registry-information',
        title: 'Company Registry Information',
        Icon: UsersRoundIcon,
        Component: (
          <>
            {assessment?.companyRegistryInformation?.output?.data ? (
              <BlocksComponent blocks={[...registryInfoBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">
                  Company Registry Information data is not available
                </CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'company-structure',
        title: 'Company Structure',
        Icon: ListChecksIcon,
        Component: (
          <>
            {assessment?.companyStructure?.output ? (
              <BlocksComponent blocks={[...companyStructureBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">Company Structure data is not available</CardContent>
              </Card>
            )}
          </>
        ),
      },
    ] satisfies AssessmentPageSection[];
  }, [
    assessment?.companyStructure?.output,
    assessment?.companyRegistryInformation?.output?.data,
    assessment?.companySanctions,
    companySanctionsBlock,
    companyStructureBlock,
    registryInfoBlock,
  ]);

  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(
    z.object({ isNotesOpen: ParsedBooleanSchema.catch(false) }),
    { replace: true },
  );

  const setIsNotesOpen = useCallback(
    (value: boolean) => setSearchParams({ isNotesOpen: value }),
    [setSearchParams],
  );

  const checksErrors = useMemo(() => {
    return [
      assessment?.companyRegistryInformation?.errors,
      assessment?.companyStructure?.errors,
      assessment?.companySanctions?.errors,
    ].filter(error => error && !error?.toLowerCase()?.endsWith('not available at the moment'));
  }, [
    assessment?.companyRegistryInformation?.errors,
    assessment?.companyStructure?.errors,
    assessment?.companySanctions?.errors,
  ]);
  const checksNotifications = useMemo(() => {
    return [
      assessment?.companyRegistryInformation?.errors,
      assessment?.companyStructure?.errors,
      assessment?.companySanctions?.errors,
    ].filter(error => error?.toLowerCase()?.endsWith('not available at the moment'));
  }, [
    assessment?.companyRegistryInformation?.errors,
    assessment?.companyStructure?.errors,
    assessment?.companySanctions?.errors,
  ]);

  return {
    assessment,
    isLoadingAssessment,
    customer,
    assessmentId,
    onNavigateBack,
    sections,
    isNotesOpen,
    setIsNotesOpen,
    notes,
    checksErrors,
    checksNotifications,
  };
};
