import { AlertTriangleIcon, LucideIcon, ShieldCheck } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useLocale } from '@/common/hooks/useLocale/useLocale';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useIdentityVerificationAssessmentQuery } from '@/domains/assessments/hooks/queries/useIdentityVerificationAssessmentQuery/useIdentityVerificationAssessmentQuery';
import { ParsedBooleanSchema } from '@ballerine/ui';
import { z } from 'zod';

type CheckPageSection = {
  id: string;
  title: string;
  Component: JSX.Element;
  description?: string;
  Icon?: LucideIcon;
  label?: string;
  hasViolations?: boolean;
};

const getLinkedCaseEntityId = (data: Record<string, unknown> | undefined) => {
  if (!data) {
    return undefined;
  }

  const candidates = [data.entityId, data.endUserId, data.businessId];

  return candidates.find(candidate => typeof candidate === 'string' && candidate.length > 0) as
    | string
    | undefined;
};

export const useIdentityVerificationPageLogic = () => {
  const locale = useLocale();
  const { checkId } = useParams<{ checkId: string }>();
  const { data: check, isLoading: isLoadingCheck } = useIdentityVerificationAssessmentQuery({
    id: checkId ?? '',
  });

  const checkData = (check?.data ?? {}) as Record<string, unknown>;
  const linkedCaseEntityId = getLinkedCaseEntityId(checkData);
  const linkedCasePath = linkedCaseEntityId
    ? `/${locale}/case-management/entities/${linkedCaseEntityId}`
    : undefined;

  const sections = useMemo(() => {
    const details = [
      { label: 'Assessment ID', value: check?.assessmentId ?? 'N/A' },
      { label: 'Email', value: check?.email ?? 'N/A' },
      { label: 'Verification Link', value: check?.verificationLink ?? 'N/A' },
    ];

    return [
      {
        id: 'identity-verification',
        title: 'Identity Verification',
        Icon: ShieldCheck,
        Component: (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {details.map(item => (
                  <div key={item.label}>
                    <p className="text-sm text-slate-400">{item.label}</p>
                    <p className="break-all text-sm font-medium">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {linkedCasePath && (
              <Link
                to={linkedCasePath}
                className="inline-flex items-center rounded-md border px-3 py-1.5 text-sm font-medium hover:bg-slate-50"
              >
                Open related KYC case
              </Link>
            )}
          </div>
        ),
      },
      {
        id: 'issues',
        title: 'Issues',
        Icon: AlertTriangleIcon,
        Component: (
          <div className="rounded-xl border border-slate-200 bg-white p-4">
            {Array.isArray(check?.issues) && check.issues.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-sm">
                {check.issues.map((issue, index) => (
                  <li key={`${issue}-${index}`}>{issue}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-slate-500">No issues</p>
            )}
          </div>
        ),
      },
    ] as CheckPageSection[];
  }, [check, linkedCasePath]);

  const navigate = useNavigate();
  const onNavigateBack = () => navigate(-1);

  const notes = [] as any[];

  const [{ isNotesOpen }, setSearchParams] = useZodSearchParams(
    z.object({ isNotesOpen: ParsedBooleanSchema.catch(false) }),
    { replace: true },
  );

  const setIsNotesOpen = useCallback(
    (value: boolean) => setSearchParams({ isNotesOpen: value }),
    [setSearchParams],
  );

  return {
    check,
    isLoadingCheck,
    checkId,
    onNavigateBack,
    sections,
    isNotesOpen,
    setIsNotesOpen,
    notes,
    linkedCaseEntityId,
  };
};
