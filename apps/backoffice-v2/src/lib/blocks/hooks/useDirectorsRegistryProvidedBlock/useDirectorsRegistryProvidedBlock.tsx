import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useDirectorsRegistryProvidedBlock = directorsRegistryProvided => {
  return useMemo(() => {
    if (!Array.isArray(directorsRegistryProvided) || !directorsRegistryProvided.length) {
      return [];
    }

    return createBlocksTyped()
      .addBlock()
      .addCell({
        type: 'block',
        value: createBlocksTyped()
          .addBlock()
          .addCell({
            type: 'heading',
            value: 'Directors',
          })
          .addCell({
            type: 'subheading',
            value: 'Registry-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
            type: 'table',
            value: {
              columns: [
                {
                  accessorKey: 'name',
                  header: 'Name',
                },
                {
                  accessorKey: 'position',
                  header: 'Position',
                },
              ],
              data: directorsRegistryProvided,
            },
          })
          .build()
          .flat(1),
      })
      .build();
  }, [directorsRegistryProvided]);
};
