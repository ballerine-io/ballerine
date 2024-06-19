import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React, { useMemo } from 'react';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useLatestBusinessReportQuery } from '@/domains/business-reports/hooks/queries/useLatestBusinessReportQuery/useLatestBusinessReportQuery';
import { WebsiteMonitoringBusinessReportTab } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportBlock/WebsiteMonitoringBusinessReportTab';

export const useWebsiteMonitoringReportBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: businessReport } = useLatestBusinessReportQuery({
    businessId: workflow?.context?.entity?.ballerineEntityId,
    reportType: 'MERCHANT_REPORT_T1',
  });
  const blocks = useMemo(() => {
    if (!businessReport?.report?.data) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'container',
        props: {
          className: 'rounded-md overflow-hidden h-full',
        },
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'node',
            value: <WebsiteMonitoringBusinessReportTab businessReport={businessReport} />,
          })
          .buildFlat(),
      })
      .build();
  }, [businessReport]);

  return blocks;
};
