import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import React, { useMemo } from 'react';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { WebsiteMonitoringBusinessReportTab } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportBlock/WebsiteMonitoringBusinessReportTab';
import { useBusinessReportByIdQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportByIdQuery/useBusinessReportByIdQuery';
import { useCustomerQuery } from '@/domains/customer/hooks/queries/useCustomerQuery/useCustomerQuery';

export const useWebsiteMonitoringReportBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: customer } = useCustomerQuery();
  const { data: nonContextBusinessReport } = useBusinessReportByIdQuery({
    id: workflow?.context?.pluginsOutput?.merchantMonitoring?.reportId ?? '',
  });
  const businessReport = customer?.config?.isDemo
    ? workflow?.context?.pluginsOutput?.merchantMonitoring
    : nonContextBusinessReport;

  const blocks = useMemo(() => {
    if (!businessReport?.data) {
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
