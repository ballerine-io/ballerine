import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { ExtractCellProps } from '@ballerine/blocks';
import { systemCreatedIconCell } from '@/lib/blocks/utils/constants';

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
                  .addCell(systemCreatedIconCell)
                  .addCell({
                    type: 'container',
                    value: createBlocksTyped()
                      .addBlock()
                      .addCell({
                        id: 'nested-details-heading',
                        type: 'heading',
                        value: 'Registry Information',
                        props: { className: 'mt-0' },
                      })
                      .addCell({
                        id: 'nested-details-subheading',
                        type: 'subheading',
                        value: 'Registry-Provided Data',
                      })
                      .buildFlat(),
                  })
                  .buildFlat(),
                props: {
                  className: 'flex space-x-1 items-center',
                },
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
                documents: documents?.map(({ details: _details, ...document }) => document),
                isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
              })
              .buildFlat(),
          })
          .build(),
      );
  }, [registryInfo, documents, workflowId]);
};
