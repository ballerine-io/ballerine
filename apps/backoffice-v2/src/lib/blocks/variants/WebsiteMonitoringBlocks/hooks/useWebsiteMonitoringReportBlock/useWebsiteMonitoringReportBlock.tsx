import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useMemo } from 'react';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useStorageFileByIdQuery } from '@/domains/storage/hooks/queries/useStorageFileByIdQuery/useStorageFileByIdQuery';
import { useLatestBusinessReportQuery } from '@/domains/business-reports/hooks/queries/useLatestBusinessReportQuery/useLatestBusinessReportQuery';

export const useWebsiteMonitoringReportBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: businessReport } = useLatestBusinessReportQuery({
    businessId: workflow?.context?.entity?.ballerineEntityId,
    reportType: 'ONGOING_MERCHANT_REPORT_T1',
  });
  const { data: reportUrl } = useStorageFileByIdQuery(businessReport?.reportFileId ?? '', {
    isEnabled: !!businessReport?.reportFileId,
    withSignedUrl: true,
  });
  const blocks = useMemo(() => {
    if (!reportUrl) {
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
            type: 'pdfViewer',
            props: {
              width: '100%',
              height: '100%',
            },
            value: reportUrl || '',
          })
          .build()
          .flat(1),
      })
      .build();
  }, [reportUrl]);

  return blocks;
};
