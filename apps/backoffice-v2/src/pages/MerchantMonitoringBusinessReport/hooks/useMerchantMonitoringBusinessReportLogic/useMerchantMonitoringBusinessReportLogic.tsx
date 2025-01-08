import { z } from 'zod';
import { useCallback, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ParsedBooleanSchema, useReportTabs } from '@ballerine/ui';

import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { useNotesByNoteable } from '@/domains/notes/hooks/queries/useNotesByNoteable/useNotesByNoteable';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useTurnMonitoringOnMutation } from '@/pages/MerchantMonitoringBusinessReport/mutations/useTurnMonitoringOnMutation/useTurnMonitoringOnMutation';
import { useTurnMonitoringOffMutation } from '@/pages/MerchantMonitoringBusinessReport/mutations/useTurnMonitoringOffMutation/useTurnMonitoringOffMutation';

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });

  const { data: notes } = useNotesByNoteable({
    noteableId: businessReportId,
    noteableType: 'Report',
  });

  const turnMonitoringOnMutation = useTurnMonitoringOnMutation();
  const turnMonitoringOffMutation = useTurnMonitoringOffMutation();

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
    { replace: true },
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

  const turnOngoingMonitoringOn = useCallback(
    (merchantId: string | undefined) => {
      if (merchantId) {
        turnMonitoringOnMutation.mutate(merchantId);
      }
    },
    [turnMonitoringOnMutation],
  );

  const turnOngoingMonitoringOff = useCallback(
    (merchantId: string | undefined) => {
      if (merchantId) {
        turnMonitoringOffMutation.mutate(merchantId);
      }
    },
    [turnMonitoringOffMutation],
  );

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    tabs,
    notes,
    activeTab,
    isNotesOpen,
    turnOngoingMonitoringOn,
    turnOngoingMonitoringOff,
  };
};
