import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useEntityLogic } from '@/pages/Entity/hooks/useEntityLogic/useEntityLogic';
import { useMemo } from 'react';

export const useProcessTrackerBlock = () => {
  const { workflow, plugins } = useEntityLogic();

  const block = useMemo(
    () =>
      createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'processTracker',
          plugins,
          context: workflow?.context,
          childWorkflows: workflow?.childWorkflows ?? [],
        })
        .build(),
    [workflow, plugins],
  );

  return block;
};
