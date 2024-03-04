import { BlocksComponent } from '@ballerine/blocks';
import { NoBlocks } from '@/lib/blocks/components/NoBlocks/NoBlocks';
import { cells } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useOngoingBlocksLogic } from '@/lib/blocks/variants/OngoingBlocks/hooks/useOngoingBlocksLogic/useOngoingBlocksLogic';

export const OngoingBlocks = () => {
  const { blocks, isLoading } = useOngoingBlocksLogic();

  return (
    <>
      <BlocksComponent blocks={blocks} cells={cells}>
        {(Cell, cell) => <Cell {...cell} />}
      </BlocksComponent>
      {!isLoading && !blocks?.length && <NoBlocks />}
    </>
  );
};
