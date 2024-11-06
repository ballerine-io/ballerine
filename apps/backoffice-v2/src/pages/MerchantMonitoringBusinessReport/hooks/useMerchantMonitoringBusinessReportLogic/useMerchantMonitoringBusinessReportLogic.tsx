import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParsedBooleanSchema, useReportTabs } from '@ballerine/ui';

import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { MERCHANT_REPORT_STATUSES_MAP } from '@/domains/business-reports/constants';

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });

  const { data: notes } = useNotesByNoteable({
    noteableId: businessReportId,
    noteableType: 'Report',
  });

  const { tabs } = useReportTabs({
    reportVersion: businessReport?.workflowVersion,
    report: businessReport?.data ?? {},
    companyName: businessReport?.companyName,
    Link: RiskIndicatorLink,
  });
  const tabsValues = useMemo(() => tabs.map(tab => tab.value), [tabs]);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    isNotesOpen: ParsedBooleanSchema.catch(false),
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab, isNotesOpen }] = useZodSearchParams(
    MerchantMonitoringBusinessReportSearchSchema,
  );
  const navigate = useNavigate();
  const onNavigateBack = useCallback(() => {
    const previousPath = sessionStorage.getItem(
      'merchant-monitoring:business-report:previous-path',
    );

    if (!previousPath) {
      navigate('../');

      return;
    }

    navigate(previousPath);
    sessionStorage.removeItem('merchant-monitoring:business-report:previous-path');
  }, [navigate]);
  const statusToBadgeData = {
    [MERCHANT_REPORT_STATUSES_MAP.completed]: { variant: 'info', text: 'Manual Review' },
    [MERCHANT_REPORT_STATUSES_MAP['in-progress']]: { variant: 'violet', text: 'In-progress' },
    [MERCHANT_REPORT_STATUSES_MAP['quality-control']]: {
      variant: 'violet',
      text: 'Quality Control',
    },
  } as const;

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    notes,
    activeTab,
    isNotesOpen,
  };
};
