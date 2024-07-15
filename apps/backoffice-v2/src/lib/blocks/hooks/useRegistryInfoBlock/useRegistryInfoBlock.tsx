import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ExtractCellProps } from '@ballerine/blocks';

export const useRegistryInfoBlock = ({
  registryInfo,
  workflowId,
  documents,
}: {
  registryInfo: Record<string, unknown>;
  workflowId: string;
  documents: ExtractCellProps<'details'>['documents'];
}) => {
  return useMemo(() => {
    if (Object.keys(registryInfo ?? {}).length === 0) {
      return [];
    }

    const registryInfoKeys = Object.keys(registryInfo);

    return registryInfoKeys
      ?.filter(
        key => !!Object.keys(registryInfo[key] ?? {})?.length && !('error' in registryInfo[key]),
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
                  data: Object.entries(registryInfo[key] ?? {})?.map(([title, value]) => ({
                    title,
                    value,
                  })),
                },
                workflowId,
                documents,
              })
              .build()
              .flat(1),
          })
          .build(),
      );
  }, [registryInfo, documents, workflowId]);
};
