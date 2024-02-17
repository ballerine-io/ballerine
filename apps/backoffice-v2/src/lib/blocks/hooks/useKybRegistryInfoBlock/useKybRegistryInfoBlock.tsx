import { useCallback, useMemo } from 'react';

import { WarningFilledSvg } from '@/common/components/atoms/icons';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useKybRegistryInfoBlock = ({ pluginsOutput, workflow }) => {
  const getCell = useCallback(() => {
    if (Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length) {
      return {
        id: 'nested-details',
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
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'details';
        }
      >;
    }

    if (pluginsOutput?.businessInformation?.message) {
      return {
        type: 'paragraph',
        value: (
          <span className="flex text-sm text-black/60">
            <WarningFilledSvg
              className={'mr-[8px] mt-px text-black/20'}
              width={'20'}
              height={'20'}
            />
            <span>{pluginsOutput?.businessInformation?.message}</span>
          </span>
        ),
      } satisfies Extract<
        Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
        {
          type: 'paragraph';
        }
      >;
    }
  }, [pluginsOutput, workflow]);

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
            id: 'nested-details-heading',
            type: 'heading',
            value: 'Registry Information',
          })
          .addCell({
            id: 'nested-details-subheading',
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
