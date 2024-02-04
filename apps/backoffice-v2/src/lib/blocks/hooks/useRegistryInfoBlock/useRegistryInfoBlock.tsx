import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useRegistryInfoBlock = ({ pluginsOutputKeys, filteredPluginsOutput, workflow }) => {
  return useMemo(() => {
    if (Object.keys(filteredPluginsOutput ?? {}).length === 0) {
      return [];
    }

    return pluginsOutputKeys
      ?.filter(
        key =>
          !!Object.keys(filteredPluginsOutput[key] ?? {})?.length &&
          !('error' in filteredPluginsOutput[key]),
      )
      ?.flatMap((key, index, collection) =>
        createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'block',
            value: createBlocksTyped()
              .addBlock()
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    id: 'nested-details-heading',
                    type: 'heading',
                    value: 'Registry Information',
                  })
                  .addCell({
                    type: 'subheading',
                    value: 'Registry-Provided Data',
                  })
                  .build()
                  .flat(1),
              })
              .addCell({
                type: 'details',
                hideSeparator: index === collection.length - 1,
                value: {
                  data: Object.entries(filteredPluginsOutput[key] ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
                workflowId: workflow?.id,
                documents: workflow?.context?.documents,
              })
              .build()
              .flat(1),
          })
          .build(),
      );
  }, [filteredPluginsOutput, pluginsOutputKeys, workflow?.context?.documents, workflow?.id]);
};
