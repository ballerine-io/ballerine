import { useMemo } from 'react';

import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

export const useCommercialCreditCheckBlock = ({ pluginsOutput }) => {
  return useMemo(() => {
    if (Object.keys(pluginsOutput?.commercialCreditCheck?.data ?? {}).length === 0) {
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
            value: {
              data: Object.entries(pluginsOutput.commercialCreditCheck.data).map(
                ([title, value]) => ({
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
          } satisfies Extract<
            Parameters<ReturnType<typeof createBlocksTyped>['addCell']>[0],
            {
              type: 'details';
            }
          >)
          .buildFlat(),
      })
      .build();
  }, [pluginsOutput?.commercialCreditCheck?.data]);
};
