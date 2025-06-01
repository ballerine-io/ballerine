import { useMemo } from 'react';
import { getPhoneNumberFormatter } from '@/common/utils/get-phone-number-formatter/get-phone-number-formatter';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';
import { userCreatedIconCell } from '@/lib/blocks/utils/constants';

export const useMainContactBlock = ({ mainContact, workflow }) => {
  return useMemo(() => {
    if (Object.keys(mainContact ?? {}).length === 0) {
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
            value: createBlocksTyped()
              .addBlock()
              .addCell(userCreatedIconCell)
              .addCell({
                type: 'container',
                value: createBlocksTyped()
                  .addBlock()
                  .addCell({
                    id: 'header',
                    type: 'heading',
                    value: 'Main Contact',
                    props: {
                      className: 'mt-0',
                    },
                  })
                  .addCell({
                    type: 'subheading',
                    value: 'User-Provided Data',
                  })
                  .buildFlat(),
              })
              .buildFlat(),
            props: {
              className: 'flex space-x-1 items-center mt-4',
            },
          })
          .addCell({
            type: 'details',
            value: {
              data: Object.entries(mainContact).map(([title, value]) => {
                const formatter =
                  getPhoneNumberFormatter(value) ?? getPhoneNumberFormatter(`+${value}`);

                return {
                  title,
                  value: formatter?.formatInternational() ?? value,
                };
              }),
            },
            workflowId: workflow?.id,
            documents: workflow?.context?.documents?.map(
              ({ details: _details, ...document }) => document,
            ),
            hideSeparator: true,
            isDocumentsV2: !!workflow?.workflowDefinition?.config?.isDocumentsV2,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [mainContact, workflow]);
};
