import { useReportTabs } from '@ballerine/ui';
import { useCallback } from 'react';
import { useLocation } from 'react-router-dom';

import { useSearchParamsByEntity } from '@/common/hooks/useSearchParamsByEntity/useSearchParamsByEntity';
import { RiskIndicatorLink } from '@/domains/business-reports/components/RiskIndicatorLink/RiskIndicatorLink';
import { TBusinessReport } from '@/domains/business-reports/fetchers';

export const useWebsiteMonitoringBusinessReportTab = ({
  businessReport,
}: {
  businessReport: TBusinessReport;
}) => {
  const { tabs: tabsWithSummary, sectionsSummary: originalSectionsSummary } = useReportTabs({
    report: businessReport ?? {},
    Link: RiskIndicatorLink,
  });
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
  const riskIndicators = originalSectionsSummary?.map(section => ({
    ...section,
    search: getUpdatedSearchParamsWithActiveMonitoringTab({
      tab: section.search.split('=')[1] ?? '',
      search,
    }),
  }));

  return {
    activeMonitoringTab,
    riskIndicators,
    tabs,
    getUpdatedSearchParamsWithActiveMonitoringTab,
    search,
  };
};
