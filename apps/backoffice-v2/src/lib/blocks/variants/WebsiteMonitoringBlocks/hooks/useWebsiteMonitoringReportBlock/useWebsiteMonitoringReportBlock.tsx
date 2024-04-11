import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useMemo } from 'react';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { useStorageFileByIdQuery } from '@/domains/storage/hooks/queries/useStorageFileByIdQuery/useStorageFileByIdQuery';
import { useBusinessReportsQuery } from '@/domains/business-reports/hooks/queries/useBusinessReportsQuery/useBusinessReportsQuery';

export const useWebsiteMonitoringReportBlock = () => {
  const { data: workflow } = useCurrentCaseQuery();
  const { data: businessReports } = useBusinessReportsQuery({
    businessId: workflow?.context?.entity?.id,
  });
  const { data: reportUrl } = useStorageFileByIdQuery(businessReports?.[0]?.reportFileId ?? '', {
    isEnabled: !!businessReports?.[0]?.reportFileId,
    withSignedUrl: false,
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
