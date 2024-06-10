import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useWebsiteMonitoringReportPDFBlock } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringReportPDFBlock/useWebsiteMonitoringReportPDFBlock';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCaseQuery } from '@/pages/Entity/hooks/useCurrentCaseQuery/useCurrentCaseQuery';
import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';

export const WebsiteMonitoringBlocks = () => {
  const blocks = useWebsiteMonitoringReportPDFBlock();
  const { data: workflow, isLoading } = useCurrentCaseQuery();
  const plugins = useCasePlugins({ workflow: workflow as TWorkflowById });
  const processes = ['merchant-monitoring'];

  return (
    <div className="flex h-full flex-col">
      {workflow?.workflowDefinition?.config?.isCaseOverviewEnabled && (
        <ProcessTracker workflow={workflow} plugins={plugins} processes={processes} />
      )}
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
    </div>
  );
};
