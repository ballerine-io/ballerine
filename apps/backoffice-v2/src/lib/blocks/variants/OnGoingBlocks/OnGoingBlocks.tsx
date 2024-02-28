import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useOnGoingBlocksLogic } from '@/lib/blocks/variants/OnGoingBlocks/hooks/useOnGoingBlocksLogic/useOnGoingBlocksLogic';

export const OnGoingBlocks = () => {
  const { blocks, isLoading } = useOnGoingBlocksLogic();

  return (
    <>
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
