import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useUbosBlock = ubos => {
  return useMemo(() => {
    if (!Array.isArray(ubos) || !ubos?.length) {
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
            value: 'UBOs',
          })
          .addCell({
            type: 'subheading',
            value: 'Registry-provided Data',
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
                  accessorKey: 'percentage',
                  header: 'Percentage (25% or higher)',
                },
                {
                  accessorKey: 'type',
                  header: 'Type',
                },
                {
                  accessorKey: 'level',
                  header: 'Level',
                },
              ],
              data: ubos.map(({ name, percentage, type, level }) => ({
                name,
                percentage,
                type,
                level,
              })),
            },
          })
          .build()
          .flat(1),
      })
      .build();
  }, [ubos]);
};
