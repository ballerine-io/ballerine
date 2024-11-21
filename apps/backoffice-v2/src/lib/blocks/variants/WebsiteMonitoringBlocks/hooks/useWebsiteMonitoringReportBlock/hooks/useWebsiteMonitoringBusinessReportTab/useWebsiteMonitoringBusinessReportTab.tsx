import { TBusinessReport } from '@/domains/business-reports/fetchers';
import { useCallback } from 'react';
import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { useLocation } from 'react-router-dom';
import { createReportAdapter, useReportTabs } from '@ballerine/ui';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { UnknownRecord } from 'type-fest';

export const useWebsiteMonitoringBusinessReportTab = ({
  businessReport,
}: {
  businessReport: TBusinessReport;
}) => {
  const { tabs: tabsWithSummary, riskIndicators: originalRiskIndicators } = useReportTabs({
    reportVersion: businessReport?.workflowVersion,
    report: businessReport?.data ?? {},
    companyName:
      (businessReport?.data?.websiteCompanyAnalysis as UnknownRecord | undefined)?.companyName ??
      '',
    Link: RiskIndicatorLink,
  });
  const adapter = createReportAdapter({
    reportVersion: businessReport?.workflowVersion,
  });
  const { riskLevels, riskScore, summary, ongoingMonitoringSummary, homepageScreenshotUrl } =
    adapter(businessReport?.data ?? {});
  const tabs = tabsWithSummary?.filter(tab => tab.value !== 'summary');
  const [{ activeMonitoringTab }] = useSearchParamsByEntity();
  const { search } = useLocation();
  const getUpdatedSearchParamsWithActiveMonitoringTab = useCallback(
    ({ tab, search }: { tab: string; search: string }) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set('activeMonitoringTab', tab);

      return searchParams.toString();
    },
    [],
  );
  const riskIndicators = originalRiskIndicators?.map(riskIndicator => ({
    ...riskIndicator,
    search: getUpdatedSearchParamsWithActiveMonitoringTab({
      tab: riskIndicator.search.split('=')[1] ?? '',
      search,
    }),
  }));

  return {
    activeMonitoringTab,
    riskIndicators,
    riskLevels,
    riskScore,
    tabs,
    summary,
    ongoingMonitoringSummary,
    getUpdatedSearchParamsWithActiveMonitoringTab,
    search,
    homepageScreenshotUrl,
  };
};
