import { ParsedBooleanSchema } from '@ballerine/ui';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useAssessmentQuery } from '@/domains/assessments/hooks/queries/useAssessmentQuery/useAssessmentQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { useAssessmentChecks, useAssessmentWarningFlags } from './useAssessmentChecks';
import { useSectionData } from './useSectionData';

export const useAssessmentPageLogic = () => {
  const { assessmentId } = useParams<{
    assessmentId: string;
    assessmentType: string;
  }>();
  const { data: customer } = useCustomerQuery();
  const navigate = useNavigate();

  const { data: assessment, isLoading: isLoadingAssessment } = useAssessmentQuery({
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

  const assessmentChecks = useAssessmentChecks(assessment);
  const warningFlags = useAssessmentWarningFlags(assessment);

  const sections = useSectionData({
    assessment,
    assessmentChecks,
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
    warningFlags,
  };
};
