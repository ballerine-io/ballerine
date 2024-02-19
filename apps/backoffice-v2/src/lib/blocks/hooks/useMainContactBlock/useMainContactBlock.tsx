import { useMemo } from 'react';
import { getPhoneNumberFormatter } from '@/common/utils/get-phone-number-formatter/get-phone-number-formatter';
import { createBlocksTyped } from '@/lib/blocks/create-blocks-typed/create-blocks-typed';

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
            type: 'heading',
            value: 'Main Contact',
          })
          .addCell({
            type: 'subheading',
            value: 'User-Provided Data',
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
            documents: workflow?.context?.documents,
            hideSeparator: true,
          })
          .build()
          .flat(1),
      })
      .build();
  }, [mainContact, workflow]);
};
