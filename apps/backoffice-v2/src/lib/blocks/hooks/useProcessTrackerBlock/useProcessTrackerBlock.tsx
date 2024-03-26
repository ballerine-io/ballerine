import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';
import { useMemo } from 'react';

export const useProcessTrackerBlock = () => {
  const { workflow, plugins } = useCurrentCase();

  const block = useMemo(
    () =>
      createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'nodeCell',
          value: (
            <ProcessTracker
              tags={workflow?.tags ?? []}
              plugins={plugins}
              context={workflow?.context}
              childWorkflows={workflow?.childWorkflows ?? []}
            />
          ),
        })
        .build(),
    [workflow, plugins],
  );

  return block;
};
