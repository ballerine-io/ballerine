import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';

type Ubo = {
  name?: string;
  type?: string;
  level?: number;
  percentage?: number;
};

export const useUbosBlock = (ubos: Ubo[] | undefined, message: string | undefined) =>
  useMemo(() => {
    const cell =
      Array.isArray(ubos) && ubos?.length
        ? ({
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
          >)
        : ({
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
          >);

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
          .addCell(cell)
          .build()
          .flat(1),
      })
      .build();
  }, [message, ubos]);
