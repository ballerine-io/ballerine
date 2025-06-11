import { ParsedBooleanSchema } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useKybAndOwnershipAssessmentQuery } from '@/domains/assessments/hooks/queries/useKybAndOwnershipAssessmentQuery/useKybAndOwnershipAssessmentQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';
import { useAssessmentChecks } from './useAssessmentChecks';
import { useSectionData } from './useSectionData';

export const useKybAndOwnershipAssessmentPageLogic = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: customer } = useCustomerQuery();
  const navigate = useNavigate();

  const { data: assessment, isLoading: isLoadingAssessment } = useKybAndOwnershipAssessmentQuery({
    id: assessmentId ?? '',
  });

  const onNavigateBack = useCallback(() => navigate(-1), [navigate]);

  const notes = [] as any[]; // TODO: Implement notes when API is available

  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(
    z.object({ isNotesOpen: ParsedBooleanSchema.catch(false) }),
    { replace: true },
  );

  const setIsNotesOpen = useCallback(
    (value: boolean) => setSearchParams({ isNotesOpen: value }),
    [setSearchParams],
  );

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

  const companySanctionsBlock = useCompanySanctionsBlock(companySanctions, true);

  const registryInfoBlock = useKybRegistryInfoBlock(
    {
      pluginsOutput: {
        businessInformation: { data: [assessment?.companyRegistryInformation?.output?.data] },
      },
      workflow: {},
    },
    true,
  );

  const companyStructureBlock = useUbosRegistryProvidedBlock(
    assessment?.companyStructure?.output?.nodes && assessment?.companyStructure?.output.edges
      ? assessment?.companyStructure?.output
      : { nodes: [], edges: [] },
    true,
  );

  const assessmentChecks = useAssessmentChecks(assessment);

  const sections = useSectionData({
    assessment,
    assessmentChecks,
    companySanctionsBlock,
    companyStructureBlock,
    registryInfoBlock,
  });

  return {
    assessment,
    isLoadingAssessment,
    sections,
    customer,
    assessmentId,
    onNavigateBack,
    notes,
    isNotesOpen,
    setIsNotesOpen,
  };
};
