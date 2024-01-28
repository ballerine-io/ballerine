import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';

type Ubo = {
  name?: string;
  percentage?: number;
  type?: string;
  level: number;
};

export const useUbosBlock = (ubos?: Ubo[], message?: string) =>
  useMemo(() => {
    const cell =
      Array.isArray(ubos) && ubos?.length
        ? {
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
          }
        : {
            type: 'paragraph',
            value: (
              <span className="mt-[20px] flex text-sm text-black/60">
                <WarningFilledSvg
                  className={'mr-[8px] mt-px text-black/20'}
                  width={'20'}
                  height={'20'}
                />
                <span>{message}</span>
              </span>
            ),
          };

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
