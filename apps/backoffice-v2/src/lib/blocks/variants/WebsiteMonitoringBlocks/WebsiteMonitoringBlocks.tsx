import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useWebsiteMonitoringBlocks } from '@/lib/blocks/variants/WebsiteMonitoringBlocks/hooks/useWebsiteMonitoringBlocks/useWebsiteMonitoringBlocks';
import { BlocksComponent } from '@ballerine/blocks';

export const WebsiteMonitoringBlocks = () => {
  const { blocks } = useWebsiteMonitoringBlocks();

  return (
    <div className="h-full">
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
    </div>
  );
};
