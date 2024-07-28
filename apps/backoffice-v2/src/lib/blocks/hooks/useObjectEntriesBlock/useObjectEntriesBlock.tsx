import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { useMemo } from 'react';
import { Json } from '@/common/types';

export const useObjectEntriesBlock = ({
  object,
  heading,
  subheading,
}: {
  object: Record<string, Json>;
  heading: string;
  subheading?: string;
}) => {
  return useMemo(() => {
    if (Object.keys(object ?? {}).length === 0) {
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
            value: [
              ...createBlocksTyped()
                .addBlock()
                .addCell({
                  type: 'heading',
                  value: heading,
                })
                .build()
                .flat(1),
              ...(subheading
                ? createBlocksTyped()
                    .addBlock()
                    .addCell({
                      type: 'subheading',
                      value: subheading,
                    })
                    .build()
                    .flat(1)
                : []),
            ],
          })
          .addCell({
            type: 'readOnlyDetails',
            value: Object.entries(object)?.map(([label, value]) => ({
              label,
              value,
            })),
          })
          .build()
          .flat(1),
      })
      .build();
  }, [object, heading, subheading]);
};
