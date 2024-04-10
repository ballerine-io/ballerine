import { ProcessTracker } from '@/common/components/molecules/ProcessTracker/ProcessTracker';
import { TWorkflowById } from '@/domains/workflows/fetchers';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useCasePlugins } from '@/pages/Entity/hooks/useCasePlugins/useCasePlugins';
import { useCurrentCase } from '@/pages/Entity/hooks/useCurrentCase/useCurrentCase';
import { useMemo } from 'react';

export const useProcessTrackerBlock = () => {
  const { data: workflow } = useCurrentCase();
  const plugins = useCasePlugins({ workflow: workflow as TWorkflowById });

  const block = useMemo(
    () =>
      createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'nodeCell',
          value: (
            <ProcessTracker
              workflow={workflow}
              plugins={plugins}
              processes={['collection-flow', 'third-party', 'ubos']}
            />
          ),
        })
        .build(),
    [workflow, plugins],
  );

  return block;
};
