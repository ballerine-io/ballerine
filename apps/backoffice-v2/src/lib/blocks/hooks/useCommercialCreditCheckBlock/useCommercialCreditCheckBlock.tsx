import { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { WarningFilledSvg } from '@ballerine/ui';

export const useCommercialCreditCheckBlock = ({
  workflowId,
  pluginsOutput,
  isDocumentsV2,
}: {
  workflowId: string;
  pluginsOutput: any;
  isDocumentsV2: boolean;
}) => {
  return useMemo(() => {
    if (!pluginsOutput?.commercialCreditCheck) {
      return [];
    }

    if (!pluginsOutput?.commercialCreditCheck?.data) {
      return createBlocksTyped()
        .addBlock()
        .addCell({
          type: 'block',
          value: createBlocksTyped()
            .addBlock()
            .addCell({
              id: 'nested-details-heading',
              type: 'heading',
              value: 'Commercial Credit Check',
            })
            .addCell({
              id: 'nested-details-subheading',
              type: 'subheading',
              value: 'Experian-Provided Data',
              props: {
                className: 'mb-4',
              },
            })
            .addCell({
              type: 'paragraph',
              value: (
                <span className="flex text-sm text-black/60">
                  <WarningFilledSvg
                    className={'me-2 mt-px text-black/20 [&>:not(:first-child)]:stroke-background'}
                    width={'20'}
                    height={'20'}
                  />
                  <span>No Commercial Credit data to show.</span>
                </span>
              ),
            })
            .buildFlat(),
        })
        .build();
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
            value: 'Commercial Credit Check',
          })
          .addCell({
            id: 'nested-details-subheading',
            type: 'subheading',
            value: 'Experian-Provided Data',
            props: {
              className: 'mb-4',
            },
          })
          .addCell({
            id: 'nested-details',
            type: 'details',
            hideSeparator: true,
            workflowId,
            value: {
              id: 'nested-details-value-id',
              title: '',
              data: Object.entries(pluginsOutput.commercialCreditCheck.data).map(
                ([title, value]) => ({
                  type: 'editable-details',
                  isEditable: false,
                  title,
                  value,
                }),
              ),
            },
            props: {
              config: {
                sort: { predefinedOrder: ['CommercialName', 'RegNumber'] },
              },
            },
            isDocumentsV2,
          })
          .buildFlat(),
      })
      .build();
  }, [isDocumentsV2, pluginsOutput.commercialCreditCheck, workflowId]);
};
