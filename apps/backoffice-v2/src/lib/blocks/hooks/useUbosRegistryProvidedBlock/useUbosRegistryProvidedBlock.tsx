import { useCallback, useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';

type Ubo = {
  name?: string;
  type?: string;
  level?: number;
  percentage?: number;
};

export const useUbosRegistryProvidedBlock = (
  ubos: Ubo[] | undefined,
  message: string | undefined,
) => {
  const getCell = useCallback(() => {
    if (Array.isArray(ubos) && ubos?.length) {
      return {
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
          data: ubos,
        },
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'table';
        }
      >;
    }

    if (message) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'mr-[8px] mt-px text-black/20'}
              width={'20'}
              height={'20'}
            />
            <span>{message}</span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }
  }, [message, ubos]);

  return useMemo(() => {
    const cell = getCell();

    if (!cell) {
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
            value: 'Registry-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell(cell)
          .build()
          .flat(1),
      })
      .build();
  }, [getCell]);
};
