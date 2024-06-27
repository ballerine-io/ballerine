import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useWebsiteMonitoringReportPDFBlock } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportPDFBlock/useWebsiteMonitoringReportPDFBlock';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { CaseOverview } from '@/pages/Entity/components/Case/components/CaseOverview/CaseOverview';

export const WebsiteMonitoringBlocks = () => {
  const blocks = useWebsiteMonitoringReportPDFBlock();
  const { isLoading } = useCurrentCaseQuery();
  const processes = ['merchant-monitoring'];

  return (
    <div className="flex h-full flex-col">
      <CaseOverview processes={processes} />
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
    </div>
  );
};
