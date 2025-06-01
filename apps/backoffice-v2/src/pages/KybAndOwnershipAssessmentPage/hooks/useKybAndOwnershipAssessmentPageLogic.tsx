import { BlocksComponent } from '@ballerine/blocks';
import { ctw, ParsedBooleanSchema } from '@ballerine/ui';
import {
  AlertTriangleIcon,
  ListChecksIcon,
  LucideIcon,
  SearchCheckIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  ShieldQuestionIcon,
  UsersIcon,
} from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { z } from 'zod';

import { Card } from '@/common/components/atoms/Card/Card';
import { CardContent } from '@/common/components/atoms/Card/Card.Content';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useKybAndOwnershipAssessmentQuery } from '@/domains/assessments/hooks/queries/useKybAndOwnershipAssessmentQuery/useKybAndOwnershipAssessmentQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCompanySanctionsBlock } from '@/lib/blocks/hooks/useCompanySanctionsBlock/useCompanySanctionsBlock';
import { useKybRegistryInfoBlock } from '@/lib/blocks/hooks/useKybRegistryInfoBlock/useKybRegistryInfoBlock';
import { useUbosRegistryProvidedBlock } from '@/lib/blocks/hooks/useUbosRegistryProvidedBlock/useUbosRegistryProvidedBlock';

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

/**
 * Types for checks data structure
 */
type CheckStatus = 'positive' | 'neutral' | 'negative';

type CheckItem = {
  displayName: string;
  status: CheckStatus;
  note: string;
};

/**
 * Generates check items based on assessment data
 * Status mapping:
 * - positive (green): Verified, Extracted, or Clear - successful extraction/validation with no issues
 * - neutral (gray): Unverified - when checks can't be performed due to limitations but no red flags
 * - negative (red): Flagged, Issues - when risks or issues are confirmed
 */
const getChecks = (assessment: any): CheckItem[] => {
  if (!assessment) return [];

  // Helper function to create a check with default fallback to neutral/unverified
  const createCheck = (
    displayName: string,
    condition: boolean | null | undefined,
    positiveNote = 'Verified',
    negativeNote = 'Flagged',
    neutralNote = 'Unverified',
  ): CheckItem => {
    return {
      displayName,
      status: condition === true ? 'positive' : condition === false ? 'negative' : 'neutral',
      note: condition === true ? positiveNote : condition === false ? negativeNote : neutralNote,
    };
  };

  const hasRegistryData = Boolean(
    assessment?.companyRegistryInformation?.status === 'completed' &&
      assessment?.companyRegistryInformation?.output?.data,
  );

  const registryData = assessment?.companyRegistryInformation?.output?.data;

  const checks: CheckItem[] = [];

  // 1. Registry Information check
  checks.push(
    createCheck(
      'Registry Information',
      assessment?.companyRegistryInformation
        ? assessment.companyRegistryInformation.status === 'completed' && Boolean(registryData)
        : null,
      'Extracted',
      'Flagged',
    ),
  );

  // 2. Company Structure check
  const hasStructureData = Boolean(
    assessment?.companyStructure?.status === 'completed' &&
      (assessment?.companyStructure?.output?.nodes?.length ||
        assessment?.companyStructure?.output?.edges?.length),
  );

  checks.push(
    createCheck(
      'Company Structure',
      assessment?.companyStructure ? hasStructureData : null,
      'Extracted',
    ),
  );

  // 3. Active Company check
  if (registryData?.status?.normalized) {
    const companyStatus = String(registryData.status.normalized).toLowerCase();
    const isActive =
      companyStatus.includes('active') ||
      companyStatus.includes('live') ||
      (!companyStatus.includes('inactive') &&
        !companyStatus.includes('dissolved') &&
        !companyStatus.includes('revoked'));

    checks.push(createCheck('Active Company', isActive));
  } else if (hasRegistryData) {
    checks.push(createCheck('Active Company', null));
  }

  // 4. Company Sanctions check
  if (assessment?.companySanctions) {
    const sanctionsStatus = assessment.companySanctions.status === 'completed';
    const hasSanctions = Boolean(assessment.companySanctions.output?.data?.length);

    checks.push(
      createCheck('Company Sanctions', sanctionsStatus ? !hasSanctions : null, 'Clear', 'Flagged'),
    );
  } else {
    checks.push(createCheck('Company Sanctions', null));
  }

  // 5. Incorporation date check
  if (registryData?.foundationDate?.normalized) {
    try {
      const foundationDate = new Date(registryData.foundationDate.normalized);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      checks.push(createCheck('Incorporated > 1 Year', foundationDate < oneYearAgo));
    } catch (e) {
      checks.push(createCheck('Incorporated > 1 Year', null));
    }
  } else if (hasRegistryData) {
    checks.push(createCheck('Incorporated > 1 Year', null));
  }

  // 6. Registered Address check
  if (registryData?.addresses?.length) {
    const hasRegisteredAddress = registryData.addresses.some(
      (addr: any) => addr.type.toLowerCase().includes('registered') && addr.fullAddress,
    );

    checks.push(createCheck('Registered Address', hasRegisteredAddress, 'Extracted'));
  } else if (hasRegistryData) {
    checks.push(createCheck('Registered Address', null));
  }

  // 7. Company Jurisdiction check
  if (registryData?.incorporationJurisdiction?.original) {
    // High-risk jurisdictions
    // FIXME: In a real implementation, this would be from a configuration
    const highRiskJurisdictions = ['RU', 'BY', 'IR', 'KP', 'SY', 'CU', 'VE'];
    const jurisdiction = String(registryData.incorporationJurisdiction.original);
    const isHighRisk = highRiskJurisdictions.includes(jurisdiction);

    checks.push(createCheck('Company Jurisdiction', !isHighRisk, 'Clear', 'High Risk'));
  } else if (hasRegistryData) {
    checks.push(createCheck('Company Jurisdiction', null));
  }

  return checks;
};

const checkIconMap = {
  positive: <ShieldCheckIcon className="size-5 text-green-500" />,
  negative: <ShieldAlertIcon className="size-5 text-red-500" />,
  neutral: <ShieldQuestionIcon className="size-5" />,
};

export const useKybAndOwnershipAssessmentPageLogic = () => {
  const { assessmentId } = useParams<{ assessmentId: string }>();
  const { data: customer } = useCustomerQuery();
  const navigate = useNavigate();

  const { data: assessment, isLoading: isLoadingAssessment } = useKybAndOwnershipAssessmentQuery({
    id: assessmentId ?? '',
  });

  const onNavigateBack = useCallback(() => navigate(-1), [navigate]);

  const notes = [] as any[];
  // TODO: Implement notes when API is available
  // const { data: notes } = useNotesByNoteable({
  //   noteableId: assessment?.id || '',
  //   noteableType: 'Report',
  // });

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

  const sections = useMemo(() => {
    const assessmentChecks = getChecks(assessment);

    return [
      {
        id: 'checks',
        title: 'Checks',
        Icon: ListChecksIcon,
        hasViolations: assessmentChecks.some(check => check.status === 'negative'),
        Component: (
          <Card>
            <CardContent className="grid grid-cols-3 gap-4 p-6">
              {assessmentChecks.length > 0 ? (
                assessmentChecks.map((check, index) => (
                  <div
                    key={`${check.displayName}-${index}`}
                    className={ctw(
                      'flex h-16 items-center justify-between rounded-md border border-gray-200 px-4',
                      check.status === 'positive' && 'bg-green-50',
                      check.status === 'negative' && 'bg-red-50',
                    )}
                  >
                    <p className="font-semibold">{check.displayName}</p>

                    <div className="flex w-[6.5rem] items-center gap-3">
                      <p>{checkIconMap[check.status]}</p>
                      <p>{check.note}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-4 text-center text-gray-500">
                  No checks data available
                </div>
              )}
            </CardContent>
          </Card>
        ),
      },
      {
        id: 'company-sanctions',
        title: 'Company Sanctions',
        Icon: AlertTriangleIcon,
        hasViolations: Boolean(assessment?.companySanctions?.output?.data?.length),
        Component: (
          <>
            {assessment?.companySanctions?.status === 'completed' ? (
              <BlocksComponent blocks={[...companySanctionsBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {assessment?.companySanctions?.status === 'failed'
                    ? 'Company Sanctions check failed'
                    : 'Company Sanctions data is not available'}
                </CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'registry-information',
        title: 'Registry Information',
        Icon: SearchCheckIcon,
        hasViolations: assessment?.companyRegistryInformation?.status === 'failed',
        Component: (
          <>
            {assessment?.companyRegistryInformation?.output?.data ? (
              <BlocksComponent blocks={[...registryInfoBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {assessment?.companyRegistryInformation?.status === 'failed'
                    ? 'Company Registry Information check failed'
                    : 'Company Registry Information data is not available'}
                </CardContent>
              </Card>
            )}
          </>
        ),
      },
      {
        id: 'company-structure',
        title: 'Company Structure',
        Icon: UsersIcon,
        hasViolations: assessment?.companyStructure?.status === 'failed',
        Component: (
          <>
            {assessment?.companyStructure?.output?.nodes ||
            assessment?.companyStructure?.output?.edges ? (
              <BlocksComponent blocks={[...companyStructureBlock]} cells={cells}>
                {(Cell, cell) => <Cell {...cell} />}
              </BlocksComponent>
            ) : (
              <Card>
                <CardContent className="p-6">
                  {assessment?.companyStructure?.status === 'failed'
                    ? 'Company Structure check failed'
                    : 'Company Structure data is not available'}
                </CardContent>
              </Card>
            )}
          </>
        ),
      },
    ] satisfies AssessmentPageSection[];
  }, [assessment, companySanctionsBlock, companyStructureBlock, registryInfoBlock]);

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
  };
};
