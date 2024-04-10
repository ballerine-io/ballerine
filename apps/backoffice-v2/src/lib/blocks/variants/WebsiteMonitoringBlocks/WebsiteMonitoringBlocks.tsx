import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useWebsiteMonitoringBlocks } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringBlocks/useWebsiteMonitoringBlocks';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';
import { BlocksComponent } from '@ballerine/blocks';

export const WebsiteMonitoringBlocks = () => {
  const blocks = useWebsiteMonitoringBlocks();
  const { data: workflow } = useCurrentCase();
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
    </div>
  );
};
