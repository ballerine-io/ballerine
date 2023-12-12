import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useKybRegistryInfoBlock = ({ pluginsOutput, workflow }) => {
  return useMemo(() => {
    if (Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length === 0) {
      return [];
    }

    return createBlocksTyped()
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
                value: 'Registry-provided data',
              })
              .build()
              .flat(1),
          })
          .addCell({
            type: 'details',
            hideSeparator: true,
            value: {
              data: Object.entries(pluginsOutput?.businessInformation?.data?.[0])?.map(
                ([title, value]) => ({
                  title,
                  value,
                }),
              ),
            },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [pluginsOutput, workflow]);
};
