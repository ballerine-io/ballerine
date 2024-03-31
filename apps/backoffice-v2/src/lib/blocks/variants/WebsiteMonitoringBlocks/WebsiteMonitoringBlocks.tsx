import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useWebsiteMonitoringBlocks } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringBlocks/useWebsiteMonitoringBlocks';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';
import { BlocksComponent } from '@ballerine/blocks';

export const WebsiteMonitoringBlocks = () => {
  const blocks = useWebsiteMonitoringBlocks();
  const { workflow, plugins } = useEntityLogic();

  return (
    <div className="flex h-full flex-col">
      <ProcessTracker workflow={workflow} plugins={plugins} />
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
    </div>
  );
};
