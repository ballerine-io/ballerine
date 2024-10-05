import { useNavigate, useParams } from 'react-router-dom';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useCallback, useMemo } from 'react';
import { z } from 'zod';
import { useZodSearchParams } from '@/common/hooks/useZodSearchParams/useZodSearchParams';
import { BusinessReportStatus } from '@/domains/business-reports/fetchers';
import { safeUrl } from '@/common/utils/safe-url/safe-url';
import { useReportTabs } from '@ballerine/ui';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';

export const useMerchantMonitoringBusinessReportLogic = () => {
  const { businessReportId } = useParams();
  const { data: businessReport } = useBusinessReportByIdQuery({
    id: businessReportId ?? '',
  });
  const { tabs } = useReportTabs({
    // Right now there is no `version` property on business reports.
    reportVersion: businessReport?.report?.version,
    report: businessReport?.report?.data ?? {},
    companyName: businessReport?.companyName,
    Link: RiskIndicatorLink,
  });
  const tabsValues = useMemo(() => tabs.map(tab => tab.value), [tabs]);
  const MerchantMonitoringBusinessReportSearchSchema = z.object({
    activeTab: z
      .enum(
        // @ts-expect-error - zod doesn't like we are using `Array.prototype.map`
        tabsValues,
      )
      .catch(tabsValues[0]!),
  });
  const [{ activeTab }] = useZodSearchParams(MerchantMonitoringBusinessReportSearchSchema);
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
    [BusinessReportStatus.COMPLETED]: { variant: 'info', text: 'Manual Review' },
    [BusinessReportStatus.IN_PROGRESS]: { variant: 'violet', text: 'In-progress' },
    [BusinessReportStatus.NEW]: { variant: 'secondary', text: 'New' },
  } as const;

  const websiteWithNoProtocol = safeUrl(businessReport?.website)?.hostname;

  return {
    onNavigateBack,
    websiteWithNoProtocol,
    businessReport,
    statusToBadgeData,
    tabs,
    activeTab,
  };
};
