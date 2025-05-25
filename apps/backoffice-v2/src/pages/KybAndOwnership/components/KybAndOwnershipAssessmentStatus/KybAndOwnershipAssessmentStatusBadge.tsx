import { Badge } from '@ballerine/ui';
import { ASSESSMENT_STATUSES_MAP } from '@ballerine/common';

import { ctw } from '@/common/utils/ctw/ctw';
import { useEllipsesWithTitle } from '@/common/hooks/useEllipsesWithTitle/useEllipsesWithTitle';

export const statusToData = {
  [ASSESSMENT_STATUSES_MAP['in-progress']]: {
    variant: 'gray',
    title: 'Case in progress',
    text: '',
  },
  [ASSESSMENT_STATUSES_MAP['pending-review']]: {
    variant: 'gray',
    title: 'Pending Review',
    text: 'The review process has not yet started',
  },
  [ASSESSMENT_STATUSES_MAP['under-review']]: {
    variant: 'info',
    title: 'Under Review',
    text: 'The merchant is currently being assessed',
  },
  [ASSESSMENT_STATUSES_MAP['approved']]: {
    variant: 'success',
    title: 'Approved',
    text: 'Merchant reviewed and found compliant or low risk',
  },
  [ASSESSMENT_STATUSES_MAP['rejected']]: {
    variant: 'destructive',
    title: 'Rejected',
    text: 'Merchant reviewed and confirmed non-compliant or high risk',
  },
} as const;

export const KybAndOwnershipAssessmentStatusBadge = ({
  status,
  disabled = false,
  ...props
}: {
  status: keyof typeof statusToData;
  disabled?: boolean;
}) => {
  const isReportInProgress = [ASSESSMENT_STATUSES_MAP['in-progress']].includes(status);

  const { ref, styles } = useEllipsesWithTitle<HTMLSpanElement>();

  return (
    <Badge
      {...props}
      variant={statusToData[status].variant}
      className={ctw(`h-6 space-x-1 text-sm font-medium`, {
        '!cursor-not-allowed': disabled,
        ' bg-[#E3E2E0] text-[#32302C]/40 ': isReportInProgress,
        'cursor-pointer hover:shadow-[0_0_2px_rgba(0,0,0,0.3)]': !disabled,
        'bg-[#E3E2E0] text-[#32302C]': status === ASSESSMENT_STATUSES_MAP['pending-review'],
        'text-[#32302C]/40': status === ASSESSMENT_STATUSES_MAP['pending-review'] && disabled,
        'bg-[#D3E5EF] text-[#183347]': status === ASSESSMENT_STATUSES_MAP['under-review'],
        'text-[#183347]/40': status === ASSESSMENT_STATUSES_MAP['under-review'] && disabled,
        'bg-[#DBEDDB] text-[#1C3829]': status === ASSESSMENT_STATUSES_MAP['approved'],
        'bg-[#F4D8B9] text-[#183347]': status === ASSESSMENT_STATUSES_MAP['rejected'],
      })}
    >
      <span
        className={ctw(`rounded-full d-2`, {
          'bg-[#91918E]':
            isReportInProgress || status === ASSESSMENT_STATUSES_MAP['pending-review'],
          'bg-[#5B97BD]': status === ASSESSMENT_STATUSES_MAP['under-review'],
          'bg-[#6C9B7D]': status === ASSESSMENT_STATUSES_MAP['approved'],
          'bg-[#DF2222]': status === ASSESSMENT_STATUSES_MAP['rejected'],
        })}
      >
        &nbsp;
      </span>
      <span ref={ref} style={{ ...styles, width: '100%' }}>
        {statusToData[status].title}
      </span>
    </Badge>
  );
};

KybAndOwnershipAssessmentStatusBadge.displayName = 'KybAndUboChecksStatusBadge';
