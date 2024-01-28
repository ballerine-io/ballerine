import { useMemo } from 'react';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@/common/components/atoms/icons';
import * as React from 'react';

export const useKybRegistryInfoBlock = ({ pluginsOutput, workflow }) =>
  useMemo(() => {
    console.log(pluginsOutput?.businessInformation);

    const cell = Object.keys(pluginsOutput?.businessInformation?.data?.[0] ?? {}).length
      ? {
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
              <span>{pluginsOutput?.businessInformation?.message}</span>
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
          .addCell(cell)
          .build()
          .flat(1),
      })
      .build();
  }, [pluginsOutput, workflow]);
